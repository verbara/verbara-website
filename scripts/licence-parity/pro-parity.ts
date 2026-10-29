// End-to-end parity check between the licence issuer and the licence validator.
//
// Issues one licence per case through the real `onRequestPost` handler, signed
// with an ephemeral P-256 key, then loads each `.lic` with the licence reader
// and checks it with the licence validator (ProValidate/), against the matching
// public key. Prints one line per case with the validator's result.
//
// Maintainer-only: it needs the .NET 10 SDK and a local checkout of the
// licensing validator, which is not part of this repository. It never runs in
// CI. Every build output and issued licence goes to a temporary directory; the
// checkout is only read.
//
// Usage (from the repository root):
//   npx tsx scripts/licence-parity/pro-parity.ts --pro-dir <dir> [--ref <git-ref>] [--out <dir>]
//
//   --pro-dir  a checkout of the licensing validator (required, no default)
//   --ref      issue with the handler as committed at this git ref instead of
//              the working tree, e.g. to show that an older issuer fails
//   --out      write the issued licences and the public key here (default: a
//              new temporary directory)
//
// Exit code: 0 when every licence validates `Valid`, 1 when any does not,
// 2 on a usage or environment error.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Handler = (typeof import('../../functions/api/developer-license/index'))['onRequestPost'];

interface Case {
  name: string;
  email: string;
  company: string;
}

// Licensees the validator re-serializes with escapes, plus plain ASCII ones
// that must stay valid. The lone-surrogate case reaches the handler intact:
// JSON.stringify writes a lone surrogate as a \uXXXX escape.
const CASES: Case[] = [
  { name: 'ascii', email: 'dev@example.com', company: '' },
  { name: 'ascii-company', email: 'dev@example.com', company: 'Acme Ltd' },
  { name: 'plus-tag', email: 'dev+trial@example.com', company: '' },
  { name: 'plus-tag-company', email: 'dev+trial@example.com', company: 'Café & Søn\'s <Ltd>' },
  { name: 'quotes-backslash', email: "o'neil@example.com", company: 'A&B "Quotes" \\ back' },
  { name: 'cjk-rtl', email: 'dev@example.com', company: '東京 שלום' },
  { name: 'non-bmp', email: 'dev@example.com', company: 'Rocket \u{1F680} Labs' },
  { name: 'cut-before-pair', email: 'dev@example.com', company: 'A'.repeat(199) + '\u{1F680}tail' },
  { name: 'lone-surrogates', email: 'Dev\uDC00@Example.com', company: 'Acme \uD800 Ltd' },
];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const HANDLER_DIR = 'functions/api/developer-license';

function fail(message: string): never {
  process.stderr.write(`pro-parity: ${message}\n`);
  process.exit(2);
}

function parseArgs(argv: string[]): { proDir: string; ref: string | null; out: string | null } {
  const values = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i]!;
    const value = argv[i + 1];
    if (!['--pro-dir', '--ref', '--out'].includes(flag) || value === undefined) {
      fail(`unexpected argument '${flag}'.\nusage: pro-parity.ts --pro-dir <dir> [--ref <git-ref>] [--out <dir>]`);
    }
    values.set(flag, value);
  }
  const proDir = values.get('--pro-dir');
  if (proDir === undefined) {
    fail('--pro-dir is required: a checkout of the licensing validator.');
  }
  if (!existsSync(proDir)) fail(`--pro-dir '${proDir}' does not exist.`);
  return { proDir: resolve(proDir), ref: values.get('--ref') ?? null, out: values.get('--out') ?? null };
}

/** Writes the handler directory as committed at `ref` into `dest` and returns its index.ts. */
function exportHandlerAt(ref: string, dest: string): string {
  const files = execFileSync('git', ['-C', repoRoot, 'ls-tree', '--name-only', `${ref}:${HANDLER_DIR}`], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter((f) => f !== '');
  const dir = join(dest, HANDLER_DIR);
  mkdirSync(dir, { recursive: true });
  for (const file of files) {
    writeFileSync(join(dir, file), execFileSync('git', ['-C', repoRoot, 'show', `${ref}:${HANDLER_DIR}/${file}`]));
  }
  return join(dir, 'index.ts');
}

/** Minimal D1 stand-in: no earlier licence for any email, every write accepted. */
function fakeD1() {
  const prepare = () => {
    const stmt = {
      bind: () => stmt,
      first: async () => null,
      run: async () => ({}),
    };
    return stmt;
  };
  return { prepare };
}

function fakeKV() {
  const store = new Map<string, string>();
  return {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

/** Issues one licence through the handler and returns the exact `.lic` bytes it emails. */
async function issue(handler: Handler, signingKeyPem: string, c: Case): Promise<Buffer> {
  let attachment: Buffer | null = null;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (new URL(String(input)).hostname === 'challenges.cloudflare.com') {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    const sent = JSON.parse(String(init?.body)) as { attachments: { content: string }[] };
    attachment = Buffer.from(sent.attachments[0]!.content, 'base64');
    return new Response('{}', { status: 200 });
  };
  try {
    const request = new Request('https://verbara.io/api/developer-license', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7' },
      body: JSON.stringify({
        email: c.email,
        fullName: 'Parity Check',
        company: c.company,
        useCase: 'Licence parity check',
        eulaAccepted: true,
        captchaToken: 'parity-token',
      }),
    });
    const env = {
      LICENSE_AUDIT_DB: fakeD1(),
      RATE_LIMIT_KV: fakeKV(),
      VERBARA_LICENSE_SIGNING_KEY: signingKeyPem,
      RESEND_API_KEY: 'parity-resend-key',
      TURNSTILE_SECRET_KEY: 'parity-turnstile-secret',
    };
    const res = await handler({ request, env, waitUntil: () => {} } as never);
    if (res.status !== 202) fail(`case '${c.name}': handler returned ${res.status} ${await res.text()}`);
  } finally {
    globalThis.fetch = realFetch;
  }
  if (attachment === null) fail(`case '${c.name}': no .lic was attached to the email`);
  return attachment;
}

async function main(): Promise<number> {
  const { proDir, ref, out } = parseArgs(process.argv.slice(2));
  const work = mkdtempSync(join(tmpdir(), 'licence-parity-'));
  const licDir = out === null ? join(work, 'licences') : resolve(out);
  mkdirSync(licDir, { recursive: true });

  const indexPath = ref === null ? join(repoRoot, HANDLER_DIR, 'index.ts') : exportHandlerAt(ref, join(work, 'src'));
  const handler = ((await import(pathToFileURL(indexPath).href)) as { onRequestPost: Handler }).onRequestPost;

  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pkcs8 = Buffer.from(await crypto.subtle.exportKey('pkcs8', kp.privateKey)).toString('base64');
  const pem = `-----BEGIN PRIVATE KEY-----\n${pkcs8.match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----`;
  const publicKeyPath = join(licDir, 'public-key.der');
  writeFileSync(publicKeyPath, Buffer.from(await crypto.subtle.exportKey('spki', kp.publicKey)));

  const licPaths: string[] = [];
  for (const c of CASES) {
    const p = join(licDir, `${c.name}.lic`);
    writeFileSync(p, await issue(handler, pem, c));
    licPaths.push(p);
  }

  const artifacts = join(work, 'artifacts');
  const build = spawnSync(
    'dotnet',
    [
      'build',
      join(repoRoot, 'scripts/licence-parity/ProValidate/ProValidate.csproj'),
      '-c',
      'Release',
      '--nologo',
      '-v:q',
      '--artifacts-path',
      artifacts,
      `-p:ProDir=${proDir}`,
      // Read the checkout, never write it: every bin/ and obj/ goes under
      // --artifacts-path, and the lock file restore reads and writes is a
      // fresh one there (a newer SDK would otherwise rewrite the checkout's).
      `-p:NuGetLockFilePath=${join(artifacts, 'packages.lock.json')}`,
      // A local tool, not a shipped build: skip the package vulnerability
      // audit, which fails offline or behind an unreachable feed.
      '-p:NuGetAudit=false',
    ],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  if (build.status !== 0) {
    process.stderr.write(build.stdout + build.stderr);
    fail(`dotnet build exited ${build.status}`);
  }

  const dll = join(artifacts, 'bin', 'ProValidate', 'release', 'ProValidate.dll');
  if (!existsSync(dll)) fail(`build output not found at ${dll}`);
  const run = spawnSync('dotnet', [dll, publicKeyPath, ...licPaths], { cwd: repoRoot, encoding: 'utf8' });
  if (run.status !== 0 && run.status !== 1) {
    process.stderr.write(run.stdout + run.stderr);
    fail(`ProValidate exited ${run.status}`);
  }

  process.stdout.write(`issuer: ${ref === null ? 'working tree' : `git ref ${ref}`}\n`);
  process.stdout.write(`licences: ${licDir}\n`);
  process.stdout.write(run.stdout);
  return run.status === 0 ? 0 : 1;
}

main().then(
  (code) => process.exit(code),
  (e: unknown) => fail(e instanceof Error ? (e.stack ?? e.message) : String(e)),
);

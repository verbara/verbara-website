/**
 * Canonical JSON for the signed licence payload, byte for byte what
 * System.Text.Json writes with its default options.
 *
 * The validator re-serializes the payload with STJ (default options, so
 * `JavaScriptEncoder.Default`) and verifies the signature over those UTF-8
 * bytes. Each field is written the way STJ writes its .NET type:
 *   - `LicenseId`, `Licensee`: strings, through the default encoder (`stjString`).
 *   - `ExpiresAt`: a `DateTimeOffset`, whose writer escapes nothing, so the
 *     `+00:00` offset keeps a literal `+`.
 *   - `Tier`, `Features`: int-backed enums, written as numbers.
 *   - `MaxAgents`, `MaxNodes`: integers.
 *
 * The committed golden vectors (`tests/fixtures/stj-canonical-vectors.json`,
 * produced by `scripts/licence-parity/StjVectors`) are the authority for every
 * rule below.
 */

/** The signed payload, typed the way the validator's .NET record is. */
export interface CanonicalLicensePayload {
  LicenseId: string;
  Licensee: string;
  Tier: number;
  /** .NET `DateTimeOffset` form, `yyyy-MM-ddTHH:mm:ss+00:00`. */
  ExpiresAt: string;
  Features: number;
  MaxAgents: number;
  MaxNodes: number;
}

const HEX = '0123456789ABCDEF';

/** `\uXXXX` with uppercase hex, as STJ writes it. */
function unicodeEscape(unit: number): string {
  return (
    '\\u' +
    HEX[(unit >> 12) & 0xf] +
    HEX[(unit >> 8) & 0xf] +
    HEX[(unit >> 4) & 0xf] +
    HEX[unit & 0xf]
  );
}

/** The two-character escapes STJ uses. `"` is not among them: STJ writes it as `"`. */
const SHORT_ESCAPES: Readonly<Record<number, string>> = {
  0x08: '\\b',
  0x09: '\\t',
  0x0a: '\\n',
  0x0c: '\\f',
  0x0d: '\\r',
  0x5c: '\\\\',
};

/** Printable ASCII the default encoder escapes anyway (HTML-sensitive). */
const HTML_SENSITIVE = new Set([0x22, 0x26, 0x27, 0x2b, 0x3c, 0x3e, 0x60]); // " & ' + < > `

const isHigh = (u: number) => u >= 0xd800 && u <= 0xdbff;
const isLow = (u: number) => u >= 0xdc00 && u <= 0xdfff;

/** A JSON string literal (quotes included) escaped as the default STJ encoder escapes it. */
export function stjString(s: string): string {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const u = s.charCodeAt(i);

    const short = SHORT_ESCAPES[u];
    if (short !== undefined) {
      out += short;
      continue;
    }
    if (u >= 0x20 && u <= 0x7e && !HTML_SENSITIVE.has(u)) {
      out += s[i];
      continue;
    }
    if (isHigh(u) && i + 1 < s.length && isLow(s.charCodeAt(i + 1))) {
      // A well-formed pair: both halves escaped.
      out += unicodeEscape(u) + unicodeEscape(s.charCodeAt(i + 1));
      i++;
      continue;
    }
    if (isHigh(u) || isLow(u)) {
      // A lone surrogate becomes the escaped replacement character.
      out += '\\uFFFD';
      continue;
    }
    // C0 controls, DEL, the HTML-sensitive characters and every other BMP character.
    out += unicodeEscape(u);
  }
  return out + '"';
}

const DATE_TIME_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;

function stjInteger(name: string, n: number): string {
  if (!Number.isSafeInteger(n) || n < -2147483648 || n > 2147483647) {
    throw new Error(`${name} must be a 32-bit integer`);
  }
  return String(n);
}

/** The compact canonical payload, in declaration order, as STJ serializes it. */
export function stjCanonical(payload: CanonicalLicensePayload): string {
  if (!DATE_TIME_OFFSET.test(payload.ExpiresAt)) {
    throw new Error('ExpiresAt must be in DateTimeOffset form without fraction');
  }
  return (
    `{"LicenseId":${stjString(payload.LicenseId)}` +
    `,"Licensee":${stjString(payload.Licensee)}` +
    `,"Tier":${stjInteger('Tier', payload.Tier)}` +
    `,"ExpiresAt":"${payload.ExpiresAt}"` +
    `,"Features":${stjInteger('Features', payload.Features)}` +
    `,"MaxAgents":${stjInteger('MaxAgents', payload.MaxAgents)}` +
    `,"MaxNodes":${stjInteger('MaxNodes', payload.MaxNodes)}}`
  );
}

/** Replaces every unpaired surrogate code unit with U+FFFD; well-formed pairs are kept. */
export function replaceLoneSurrogates(s: string): string {
  // String.prototype.toWellFormed (ES2024) is not in every Worker/TS lib target, so do it by hand.
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const u = s.charCodeAt(i);
    if (isHigh(u) && i + 1 < s.length && isLow(s.charCodeAt(i + 1))) {
      out += s[i]! + s[i + 1]!;
      i++;
    } else if (isHigh(u) || isLow(u)) {
      out += '�';
    } else {
      out += s[i]!;
    }
  }
  return out;
}

/**
 * The first `maxUnits` UTF-16 code units of `s`, cut so that a surrogate pair
 * is never split: when the cut falls between the two halves, the pair is dropped.
 */
export function truncateUtf16Safe(s: string, maxUnits: number): string {
  if (s.length <= maxUnits) return s;
  const end = maxUnits > 0 && isHigh(s.charCodeAt(maxUnits - 1)) && isLow(s.charCodeAt(maxUnits))
    ? maxUnits - 1
    : maxUnits;
  return s.slice(0, end);
}

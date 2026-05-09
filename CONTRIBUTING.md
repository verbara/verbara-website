# Contributing to verbara-website

Thanks for your interest in improving the Verbara marketing site! This repo is open to community contributions.

## What we accept

- ✅ Copy improvements (typos, clarity, grammar)
- ✅ Translation improvements for `es-419`, `en-US`, `pt-BR`
- ✅ New blog posts (once the blog launches)
- ✅ Accessibility (WCAG) improvements
- ✅ Performance optimizations (bundle size, Lighthouse scores)
- ✅ Bug fixes (broken links, render glitches, etc.)
- ✅ New page sections that fit the marketing scope

## What we don't accept

- ❌ PRs that change the licensing model, tier names, or pricing without prior discussion (these are governed by ADRs in the `Verbara.Sdk.Pro` repo)
- ❌ PRs that add tracking analytics beyond the privacy-respecting baseline (Cloudflare Web Analytics)
- ❌ PRs that add cookie banners (we deliberately use cookieless analytics)
- ❌ PRs that introduce dependencies > 50 KB without a strong justification

## Developer Certificate of Origin (DCO)

We use the [Developer Certificate of Origin](https://developercertificate.org) instead of a CLA. By signing your commits with `git commit -s`, you certify:

> By making a contribution to this project, I certify that:
>
> 1. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
> 2. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications; or
> 3. The contribution was provided directly to me by some other person who certified (1), (2), or (3) and I have not modified it.
> 4. I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed.

Sign your commits:

```sh
git commit -s -m "fix: clarify Tier 0.5 description in pricing page"
```

This adds a `Signed-off-by: Your Name <you@example.com>` trailer.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature (page, component, etc.)
- `fix:` — bug fix
- `docs:` — documentation only changes
- `style:` — formatting, missing semicolons, etc.
- `refactor:` — neither a bug fix nor a new feature
- `perf:` — performance improvement
- `test:` — adding tests
- `chore:` — build process, dependency updates, etc.
- `i18n:` — translation updates

**No `Co-Authored-By` lines** in commits.

## Local development

```sh
# Install (requires Node ≥22.12)
npm install

# Run dev server with HMR (defaults to http://localhost:4321)
npm run dev

# Type-check + production build
npm run build

# Preview the production build
npm run preview
```

## PR process

1. Fork the repo and create a topic branch (`git checkout -b fix/typo-pricing`)
2. Make your changes
3. Sign your commits (`git commit -s`)
4. Push to your fork and open a PR against `main`
5. CI will run build + lint checks
6. A maintainer will review; small copy/translation PRs are usually merged within 48h

## Translations

The three locales (`es-419`, `en-US`, `pt-BR`) must remain in parity. If you add a new key to one locale, add it to all three (you may use machine translation as a placeholder marked with a `// TODO: review translation` comment, but flag this in the PR description).

## Licensing of contributions

By submitting a PR, you agree your contribution is released under the [MIT License](LICENSE) of this repository.

## Reporting security issues

**Do NOT open a public issue for security vulnerabilities.** Email `security@verbara.io` with details. We follow [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116) for security disclosure.

## Code of conduct

Be kind, be patient, assume good faith. Harassment, discrimination, or personal attacks of any kind will result in immediate removal from the project. We will adopt a formal Code of Conduct (likely [Contributor Covenant](https://www.contributor-covenant.org/)) when contributor volume warrants it.

## Questions

Open a Discussion in this repository or email `hello@verbara.io`.

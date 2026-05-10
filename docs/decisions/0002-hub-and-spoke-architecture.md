# ADR-0002: Hub-and-Spoke Marketing Site Architecture

- **Status:** Accepted
- **Date:** 2026-05-10
- **Deciders:** Verbara maintainer (Harol A. Reina H.)
- **Related:**
  - ADR-0001 (Marketing Site Stack) — the operational stack; unchanged
  - Spec: [`docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`](../specs/2026-05-10-website-phase-f-hub-and-spoke.md)
  - Phases A–E spec: [`docs/specs/2026-05-09-website-redesign.md`](../specs/2026-05-09-website-redesign.md)
  - Auto-memory `website_positioning_decision.md` (Option I — operator-first + open-core proof + LATAM)

## Context

Phases A–E (shipped 2026-05-09 → 2026-05-10) delivered `verbara.io` with a single narrative: *"Verbara is an open-core contact center."* That positioning came from Option I — chosen deliberately after eliminating 8 alternatives — and remains correct **for the audience** (operators) and **the trust mechanism** (open-core proof).

A 4-repo capability inventory performed 2026-05-10 revealed the narrative is incomplete **for the product surface**. Verbara already ships:

- A telephony SDK (AMI/AGI/ARI/Live API) with multi-server federation — usable as a programmable telephony runtime independent of any contact center
- A Voice AI pipeline with 6 STT providers, 6 TTS providers, Smart Turn detection, and an OpenAI Realtime bridge — usable as a voicebot platform independent of contact center
- 11 omnichannel connectors (WhatsApp, SMS, WebChat, Messenger, Instagram, Telegram, Email SMTP+Graph, Video, Twitter, RCS) with a Flows DAG editor — usable as an omnichannel messaging product independent of voice
- Pro overlays (multi-tenant, dialer, CallAnalytics, AgentAssist, EventStore, Cluster, Licensing) that turn any of the above into a SaaS or white-label OEM product

The contact-center narrative covers one slice of this surface and renders the rest invisible to visitors. A second strategic analysis (2026-05-10) confirmed:

- **Pivoting away from CC** (e.g., to pure Voice AI or pure CPaaS) loses the integrated-stack moat; competitors in those single categories have year-plus lead in DX
- **Adding a generic "platform" hero** without structure re-opens the two-door trap that Option I closed
- **Operator audience is not a use-case** — operators run multiple use-cases on the same stack and benefit from seeing all of them

The decision below codifies the architecture that surfaces the product surface without abandoning Option I.

## Decision

`verbara.io` adopts a **hub-and-spoke** information architecture:

- **Hub** = `/` (home). Hero subject is **the comms runtime**, not "the contact center." Contact center is named in the hero subtitle as the lead use-case alongside voice AI, omnichannel, and "more." Audience (operators), proof mechanism (open-core), tactical hook ("Asterisk-native"), and LATAM subtext from Option I are preserved verbatim.
- **Spokes** = `/use-cases/{contact-center,voice-ai,omnichannel,cpaas}/`. Each spoke is a self-contained narrative for one use-case with its own anti-positioning, code proof, FAQ, and pricing pointer. Spokes share the home's 7-section template for narrative consistency.
- **Index** = `/use-cases/`. Lightweight 4-card overview that funnels visitors into the spoke matching their intent.
- **Navigation** exposes spokes via a `Soluciones` dropdown, replacing the previous `Producto` anchor link.
- **Pricing matrix** gains a `Mejor para` column mapping each tier to the use-case(s) it serves, so a visitor arriving via a spoke does not feel pricing was written for a different product.

The 4 initial spokes are picked because each maps 1:1 to capabilities that already ship and to a competitive category visitors search for. The architecture supports adding or archiving spokes over time; the criteria are documented in the Phase F spec §13.

## Consequences

**Positive:**

- Surfaces ~7 ship-ready capability categories (Voice AI, omnichannel, CPaaS, white-label, speech analytics, agent assist, dialer) that Phases A–E rendered invisible.
- Each spoke gets to compete in its own SEO category (open-source Vapi alternative, OSS Twilio Conversations alternative, etc.) without diluting the home's operator-first message.
- Architecture is **reversible at the spoke level**: a spoke that fails to attract traffic in 90 days can be archived without touching the home or the other spokes.
- Architecture is **extensible**: a new use-case (e.g., compliance-grade voice for regulated verticals) can be added as Spoke 5 without re-doing the IA.
- Pricing coherence is preserved through the `Mejor para` matrix column — visitors don't perceive pricing was designed for a single product.
- ADR-0001 stack (Astro static + Workers Sites + D1) is **unchanged**; no new vendor relationships, no infra cost delta.

**Negative:**

- More pages to maintain: 5 new pages (1 index + 4 spokes) × 3 locales = 15 new page renders. ~146 new i18n keys (taking total to ~378 × 3 = ~1,134 strings).
- More E2E coverage: ~57 new test cases × 3 browsers = 171 new test executions per CI run.
- Home hero copy change re-touches Phase B's most carefully-worded section. Mitigation: the change is surgical — only the hero subject (`hero_h1_pre`, `hero_sub`, `hero_cta_secondary`, `final_h2_pre`); audience, anti-positioning, how-it-works, code-proof, pricing-teaser, FAQ are preserved verbatim.
- Risk that visitors arriving via the home now feel "less specifically addressed" if they only care about CC. Mitigation: the Spoke 1 (Contact Center) page replicates the previous home narrative verbatim, so a CC-only visitor reaches the same content one click deeper.

**Trade-off:**

- Trades **narrative concentration** (one story, deeply told) for **product-surface coverage** (four stories, each told well). Acceptable because the inventory shows the product surface is genuinely broader than CC and visitors searching for non-CC use-cases were previously bouncing.
- Trades **cheap maintenance** (one page to edit) for **architectural reversibility** (spokes can be archived independently). Acceptable because the spoke template is shared and changes propagate via composites, not duplicated copy.

## Alternatives considered

The brainstorming session that produced this ADR evaluated 21 distinct moves across 4 axes (messaging, funnel, product-architecture, narrative-tone). The Phase F spec §14 records all of them. The most consequential rejections:

- **Status quo** (keep CC-only narrative). Rejected: leaves 7+ ship-ready capability categories invisible.
- **Generic "platform" hero** without spokes. Rejected: re-opens the two-door trap Option I closed.
- **Two parallel narratives on the home** (CC + Voice AI co-headlining). Rejected: pricing models differ (per-agent vs. per-call); home becomes incoherent.
- **Pivot to pure Voice AI** ("OSS Vapi/Retell"). Rejected: tira la moat (Asterisk-native + multi-tenant + integrated); Vapi/Retell have 18–24 month framework-DX lead.
- **Pivot to pure CPaaS** ("OSS Twilio"). Rejected: Twilio's moat is global SIP infra Verbara doesn't operate.
- **Vertical reframe** (BPO + Telco + Fintech). Rejected: locks audience too narrow; revisit on PMF.
- **Three-persona reframe** (operator / builder / telco). Rejected: builder and telco are sub-segments of operator per Option I; separate doors fragment the funnel.
- **Stack-as-product** (4 repo cards on home). Rejected: tested in the pre-Phase-A site, didn't convert — buyers buy outcomes, not repos. Footer `Stack` column preserves this surface for the audience that wants it.
- **Marketplace / app store** of templates. Rejected: cementeries without users; revisit at ≥ 10 community-built templates.
- **Vertical sub-products** (Verbara for Cobranzas, etc.). Rejected: premature without PMF.
- **Verbara Cloud free Tier 0 hosted**. Rejected as a site change: that is a product change (multi-tenant hosted, billing, abuse, support), evaluated separately.
- **Docs-as-marketing primary**. Rejected: operators don't buy by reading docs; devs do, and devs are top-of-funnel only per Option I. Docs portal reserved as Phase G.3 complement.
- **GitHub-as-marketing primary**. Rejected: operator buyers don't comparison-shop on GitHub.
- **Engineering blog / research lab as headline**. Rejected as headline; reserved as Phase G.7.

## Status update

(append-only; do not modify the original ADR text above)

- **2026-05-10**: ADR Accepted. Phase F spec drafted at `docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`. Implementation plan to follow.

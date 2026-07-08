# PLAN: La Prensa — monthly headline ticker
## Status: design approved for build, pending Danny's go

**The idea.** A newsprint-styled strip at the top of the main screen showing a real
(interpreted/translated) Mexican newspaper headline for the current game month —
the country talking to itself while you organize under it.

**Architecture (all pieces proven in this codebase):**
1. `out/html/headlines.js` — a data file: `window.HEADLINES = { "1968-10": {src:"Excélsior", h:"..."}, ... }`
   plus `window.HEADLINES_ERA` fallbacks per period for uncovered months.
2. A `<div id="prensa_ticker">` injected above #content; game.css gives it the
   masthead look (rule, small caps date, serif headline).
3. game.js observer (same MutationObserver pattern as the war map) reads
   Q.year/Q.month on every scene change and swaps the headline.
4. Dynamic override: events can set `Q.headline_override = "..."` for reactive
   headlines (election nights, the earthquake) — ticker prefers it when set, and
   post_event clears it monthly.

**Coverage plan (~150 entries):**
- MONTHLY where history is dense: Oct 1968–Dec 1971, Jul 1975–Dec 1977,
  Jan–Dec 1982, Sep 1985–Mar 1986, Jun 1986–Jul 1989.
- QUARTERLY otherwise; era fallbacks fill gaps ("PEMEX ANUNCIA NUEVO DESCUBRIMIENTO…" for the boom, etc.)
- Sources to mine, in order: Excélsior (to Jul 1976), unomásuno (1977+),
  Proceso covers (Nov 1976+), La Jornada (Sep 1984+), El Universal archive,
  plus the Hemeroteca Nacional Digital for exact front pages.
- Each entry: interpreted headline (English with Spanish key terms, per style
  guide) + source tag. Research via web archive searches, batched by year;
  estimated 3–4 research passes.

**Why a JS file and not scene text:** zero compile cost, editable without
touching Dendry, and the ticker can never break a scene.

**Build order when approved:** ticker shell + era fallbacks first (one pass),
then research batches fill 1968–74, 1975–81, 1982–89.

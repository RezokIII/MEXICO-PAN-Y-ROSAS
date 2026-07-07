# La Izquierda Mexicana — v0.1 vertical slice
## Aligned to RezokIII/MEXICO-PAN-Y-ROSAS (fork of aucchen/social_democracy_alternate_history, dendrynexus)

Verified against the real repo conventions on 2026-07-06. Everything below matches the
base game's actual syntax (qdisplay range format, `tags: event`, `is-card`, advisor
pinned-cards, `=` status sections, `#` comments).

## The core conversion trick

Base-game events are all gated on `view-if: year = 1929 and month = 5` style checks.
**Set the clock to October 1968 and the entire Weimar event calendar goes dormant** —
no deletion needed for the slice to run. (Elections, the Reichstag panel, and the
class/party support engine still reference SPD-era qualities; those get converted in
v0.3 when we build the 1979 election. For now they're harmless background.)

## File map & where each piece goes

```
source/scenes/root_additions.scene.dry
   -> paste the Q.* block INSIDE root.scene.dry's @start on-arrival {! ... !},
      and CHANGE the base lines: Q.year = 1968; Q.month = 10;
source/scenes/main_additions.scene.dry
   -> add "- @movimiento" to the option lists of BOTH @main hands in main.scene.dry
      (normal and easy), and paste the @movimiento deck block with the other decks
source/scenes/status_gobierno.scene.dry
   -> paste the "= Gobierno" section into status.scene.dry (base status is one page
      of = sections, NOT tabs - tabs are a Dynamic-mod thing)
source/scenes/events/*.scene.dry          -> drop into source/scenes/events/
source/scenes/party/*.scene.dry           -> new folder source/scenes/movimiento/ in the repo
                                             (cards carry tags: movimiento either way)
source/scenes/advisors/valentin_campa.scene.dry -> source/scenes/advisors/
   (also add him to shuffle_leadership per the guide; campa_advisor starts 0,
    set to 1 by the los_liberados event)
source/qdisplays/*.qdisplay.dry           -> source/qdisplays/
game_css_additions.css                    -> append to out/html/game.css (v0.3 use)
```

## Build & test

Locally: `npm install`, then `dendrynexus make-html` (per repo README), open out/html/index.html.
Or push and let the GitHub Actions workflow compile; red X -> read the log's line number.

## Known v0.1 limitations (deliberate)

- No elections yet (1970 is a stance event, matching the design; the election
  engine conversion is v0.3 alongside registro/LFOPPE).
- Q.classes / Q.parties arrays untouched; post_event's support recalculation
  still runs on SPD data in the background. Harmless until v0.3.
- face-image / card-image paths are placeholders for your art.
- The base game's start menu, credits, and library text still say Weimar.

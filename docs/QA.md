# Initial verification — 2026-11-15

## Automated
- `npm run build`: TypeScript check and Vite production build pass.
- `npm test`: 10 tests pass, covering arithmetic/answer boundaries, Hebrew combining marks, progress imports, all-stroke tracing coverage, speech IDs/languages/cache invalidation and audio output handling.
- `npm run validate:content`: 16 books and 150 pages pass content and media-reference checks.
- `npm run audio:catalog`: 200 speech entries, 0 recordings ready. Actual OpenAI generation has not run because no API key was available. Missing-audio checks intentionally fail until clips are generated.
- Repository text scan found no credential/token patterns; source PDF and contact details are excluded.

## Browser
Checked the desktop UI and a 768px-wide browser iframe for tablet layout (768px viewport/content, no horizontal overflow). Verified free page selection, matching after a wrong answer, all-occurrence letter finding, coloring all correct objects, character success feedback, arithmetic choices, arithmetic keypad answers, parent audio status, and progress retained after reload.

Mouse tracing verified that main+upper strokes alone (78% total) no longer earn completion; tracing the lower stroke brings coverage to 100% and earns the reward. Each stroke now needs 50% coverage in addition to 75% global coverage.

## Remaining limits
- Physical iPad/Safari touch, audio unlocking and downloaded Hebrew voices need device verification.
- Pregenerated OpenAI recordings need generation and listening review, especially names and phonics.
- Current coloring fills matching picture/numeral cards; it is not a freehand painting canvas.
- Numeral handwriting recognition and numeral puzzles made from letter-shaped pieces remain future exercise modes.
- No hosting deployment was enabled. The checked-out source is private, but publication audience must be selected separately.
- No trial with Asia has occurred.

## Play, fonts and public deployment update
+- 22 books / 159 pages; 18 automated tests now cover puzzle geometry, physical Hebrew keyboard mapping, sequence generation, and public-build privacy rejection.
+- Public production build copies allowlisted media only; no portrait directory, no private photo bytes, no PDF, no credential patterns, and no compiled portrait URL requests.
+- Four self-hosted upright fonts build as relative hashed assets for repository-path hosting.
+- Browser verified freeze-all victory, puzzle wrong-drop return, correct drag snap, and full 20-piece completion through accessible tap/keyboard controls.
+- Physical and on-screen Hebrew key entry and sequence demonstration/retry checked. Actual iPad touch still needs device testing.

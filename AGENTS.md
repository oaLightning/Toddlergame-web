# Asia's learning library

## Product requirements
- Build a single-page web game for a three-year-old, in Hebrew and English, usable with a mouse or iPad touch.
- Ship a fully static site. No active backend, runtime API credentials, accounts, or server dependency. Build output must work under a GitHub Pages repository subpath.
- Use calm pastel pink, purple, cream, and mint. Large readable targets, restrained motion, short activities, no timers or punishments.
- Organize themes as books and exercises as pages. All lessons/pages remain freely selectable and skippable.
- Save progress on the device; allow export/import/reset. Never infer that local progress syncs between devices.
- Start Hebrew from א in alphabetical order. Asia has encountered א–ד but wants to restart. Keep letter names, phonemes, and vowel sounds distinct.
- Teach letters through introduction/highlighting, tracing, examples with highlighted letters, finding letters, and coloring matching objects. Review old letters. Build simple words when their letters are available.
- English uses a separate phonics progression.
- Count through 20 in stages. Trace/recognize numerals. Visual addition and subtraction have quantities/results within 10. Start with choices; allow keypad and later handwriting modes.
- Cross-theme activities include counting letters in familiar words and matching those quantities to numerals. Letter-shaped pieces used to construct numeral shapes must not imply Hebrew letter numerical values.
- Instructions are visible and replayable aloud. Generate and review OpenAI audio offline, bundle files; browser speech is a labeled fallback. Do not claim ungenerated clips exist.
- Reward success with brief confetti/sounds and occasional Bluey/Frozen/princess cameos. Retry feedback stays gentle and instructional.
- Use first names and cropped classroom portraits from the supplied PDF. Never include the contact PDF, phone numbers, or parent details in the site or repository. Check uncertain Hebrew name spellings before teaching them.
- Lessons, characters, drawings, and sounds must be easy to extend through typed content/catalogs. Future Asia illustration assets can be added without changing exercise components.
- Do not trial with Asia yet. Finish code/content structure and technical QA first.

## Engineering rules
- Never put credentials into files, Git remotes/config, commits, browser bundles, logs, examples, or documentation.
- Use environment variables for build-time asset generation keys. Keep .env files ignored.
- Keep content in src/content, the lesson contract in src/types.ts, exercise rendering in reusable components, and media in public catalogs.
- Document sources for downloaded character images. Validate every referenced asset exists.
- Verify build, content invariants, progress behavior, and representative mouse/touch exercises. Report actual device/audio limits honestly.

## Public play and recognition updates
- Public deployments must contain no child photos or portrait catalogs. Keep source history with portraits private. Work on public-game commits in Toddlergame-web; its main branch deploys automatically.
- Provide an untimed Elsa freeze game, character puzzles with 20/30/40/60 pieces and forgiving snapping, and pastel key-bash play supporting touch.
- Keyboard lessons include finding keys and repeating short sequences, for Hebrew/English/numbers, with physical and on-screen input.
- Vary clear upright printed recognition fonts; keep instructions in a single font and tracing/keyboard labels consistent. Self-host fonts.

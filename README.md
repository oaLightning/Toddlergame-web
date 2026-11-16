# Asia's little library · הספרייה של אסיה

A calm, touch-friendly learning game for a three-year-old: the Hebrew and English alphabets, staged word building, counting, and visual arithmetic. Books contain short exercise pages. Every book and page is freely available; progress stays on the current device.

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Serve the contents of `dist/` with any static HTTPS host. There is no runtime backend, API key, account or server process. The build uses relative paths for GitHub Pages repository subpaths. The development server is only a development tool.

## Progress and controls

Open any book and choose any page. A completed page is a record of participation, not a mastery assessment. Parent controls provide progress export/import/reset and narration preferences. Progress is stored in the browser on each device; clearing browser data can remove it. Export before transferring devices.

## Extend the game

- [Product instructions](AGENTS.md) and [implementation plan](docs/PLAN.md)
- [Lesson API](docs/LESSON_API.md): add typed lesson objects in `src/content/index.ts`
- [Curriculum](docs/CURRICULUM.md): current sequence and teaching boundaries
- [Audio](docs/AUDIO.md): prepare Gemini/OpenAI speech files outside the game
- [Character assets](docs/CHARACTER_ASSETS.md): downloaded sources and catalog
- [Classroom portraits](docs/PORTRAITS.md): photo-only crops and verified name fields

Assets live under `public/` and use paths relative to that root. Keep IDs stable to retain progress and audio mappings. Future illustrations of Asia can be added through the same image fields without changing exercise renderers.

## Audio status

The game includes local success/retry WAVs and real Gemini-generated narration. Remaining clips are generated incrementally; missing narration falls back to a matching device voice. Use the visible sound activation/test button on iPhone. Parent controls show playback status and the current number of ready clips. Actual device voice availability varies.

The build-time generators support Gemini, OpenAI and approved ElevenLabs Sarah/Jessica voices, resumable caching and bounded quota/transient retries. See `docs/AUDIO.md`. The manual `Generate speech recordings` Actions workflow can generate and commit clips after an appropriately authorized provider secret is configured. No key is placed in the frontend or repository files.

## Public deployment and new play books

Use [Toddlergame-web](https://github.com/oaLightning/Toddlergame-web) for public-game development. Every push to main builds and deploys to GitHub Pages. The original private repository retains the earlier classroom-photo history; it is not made public. See [deployment and photo-exclusion details](docs/DEPLOYMENT.md).

`npm run build:public` generates and verifies the default photo-free static output. Children’s photos and the portrait catalog are absent from the public source and site. The normal UI uses a flower instead of a portrait.

The play shelf contains Elsa’s untimed freeze game, six character picture puzzles with 20/30/40/60 pieces, and a pastel key-bash/touch playground. Hebrew, English and number shelves each include find-the-key and repeat-a-sequence practice. Four self-hosted printed fonts vary recognition targets; instructions and keyboard labels stay consistent.


## Expanded activities

Hebrew א–ת and five final forms, English a–z in a separate phonics progression, milestone word-building/letter-counting books, numeral painting 0–20, letter-tile numeral mosaics, and assisted handwritten answers all remain freely selectable. Handwriting offers suggestions for confirmation and a keypad alternative. The Elsa minigame has full-arena bouncing movement that accelerates after each freeze; it remains untimed.

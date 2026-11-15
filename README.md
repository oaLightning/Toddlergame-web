# Asia's little library · הספרייה של אסיה

A calm, touch-friendly learning game for a three-year-old: Hebrew letters, English starter phonics, counting, and visual arithmetic. Books contain short exercise pages. Every book and page is freely available; progress stays on the current device.

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
- [Audio](docs/AUDIO.md): prepare OpenAI speech files outside the game
- [Character assets](docs/CHARACTER_ASSETS.md): downloaded sources and catalog
- [Classroom portraits](docs/PORTRAITS.md): photo-only crops and verified name fields

Assets live under `public/` and use paths relative to that root. Keep IDs stable to retain progress and audio mappings. Future illustrations of Asia can be added through the same image fields without changing exercise renderers.

## Audio status

The app supports pregenerated OpenAI recordings. No OpenAI API credential was available in the initial development environment, so the first version uses browser speech for missing recordings. Device Hebrew voice availability and pronunciation vary; review phonics and names before treating them as teaching recordings. See `docs/AUDIO.md` for catalog generation and resumable asset generation. Never put an API key in frontend code or in the repository.

## Public deployment and new play books

Use [Toddlergame-web](https://github.com/oaLightning/Toddlergame-web) for public-game development. Every push to main builds and deploys to GitHub Pages. The original private repository retains the earlier classroom-photo history; it is not made public. See [deployment and photo-exclusion details](docs/DEPLOYMENT.md).

`npm run build:public` generates and verifies the default photo-free static output. Children’s photos and the portrait catalog are absent from the public source and site. The normal UI uses a flower instead of a portrait.

The play shelf contains Elsa’s untimed freeze game, six character picture puzzles with 20/30/40/60 pieces, and a pastel key-bash/touch playground. Hebrew, English and number shelves each include find-the-key and repeat-a-sequence practice. Four self-hosted printed fonts vary recognition targets; instructions and keyboard labels stay consistent.


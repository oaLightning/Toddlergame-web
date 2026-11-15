# Implementation plan

## Architecture
React, TypeScript and Vite produce a static bundle. Books and pages are data. Exercise components consume a shared discriminated lesson contract. Local progress is versioned and survives reloads; import/export provides manual transfer. Relative media URLs and Vite base configuration support repository-path hosting.

## Work streams
1. App owner: publish the lesson API, build the library/page UI and all exercise renderers, accessible input, feedback and progress storage.
2. Character asset owner: locate/download character pictures, optimize them, retain provenance and publish an asset manifest.
3. Audio owner: inspect available OpenAI speech access; implement repeatable catalog generation, generate clips when credentials are available, and report missing clips accurately.
4. Lesson owner (starts after the contract): author Hebrew א–ד, staged numbers through 20, visual arithmetic through 10, English starter phonics, and letter-counting review using only implemented exercise kinds.
5. Integrator: prepare classroom portraits, coordinate interfaces, verify the finished app, document extension/deployment, and commit/push the result.

## Initial content boundaries
Use common objects, foods, Asia's name and checked familiar character names. Hebrew names whose spelling is only transliterated in the contact list stay pending verification. Do not label א as a fixed /a/ sound. Word building checks a word's letter dependencies independently of phonetic reading readiness.

## Verification and delivery
- Production build and TypeScript checks.
- Content checks: IDs, supported kinds, available choices, mathematical answers, range boundaries and word dependencies.
- Asset checks: sources, existing paths and audio generation status.
- Browser inspection at desktop and tablet sizes; exercise tracing, finding/coloring, counting/arithmetic, page selection and persistence.
- Documentation for authoring lessons, adding characters/portraits/audio, static serving, GitHub Pages and known limitations.

## Later work
The alphabet, word-building, numeral painting/mosaic and assisted handwritten-answer extensions are implemented. Remaining work: generate/review narration, broaden illustration assets and reviewed vowel/blending lessons, verify physical iPad touch, and add future Asia drawings. No backend is required.

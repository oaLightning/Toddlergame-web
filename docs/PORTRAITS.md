# Classroom portraits

`public/portraits/manifest.json` contains 26 cropped head portraits extracted from photo regions of the supplied two-page class PDF. No parent names, telephone numbers, or source PDF are included. Small source faces (especially Ella) have limited detail; replace them with better photos later.

Only Asia's Hebrew name, אסיה, is verified by the parent. All other entries keep the source's Latin first-name label and `hebrewNameVerified: false`. Review Hebrew spellings with the parent before using them as Hebrew teaching examples. Manifest IDs are stable and disambiguate repeated names.

To add/replace a portrait, place an optimized WebP under `public/portraits/`, update the manifest, and use its relative `src` in lesson examples or choices. Replace pictures without changing the stable child ID. Lesson authors can attach pictures independently of text highlighting.

These classroom images are intended for this private family project. A private source repository does not itself make a published static site private; choose deployment visibility before publishing children's pictures.

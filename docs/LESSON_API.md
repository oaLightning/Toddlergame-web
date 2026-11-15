# Lesson authoring API

Export `lessons: Lesson[]` from `src/content/index.ts`. Import types from `../types`.
Every lesson has a stable id, theme (`hebrew`, `english`, `numbers`), locale (`he`, `en`), title, subtitle, cover (emoji), optional color, and pages.
Every page has a stable id, kind, instruction, optional speech (pronunciation-specific text), audioId, help.

Kinds and fields:
- introduce: target, examples [{word, highlight, emoji?, image?}]. Highlight can contain one or more characters. Child taps examples to hear them; continue button completes page.
- trace: target, optional strokes (SVG d paths in a 200x200 viewBox). Template defaults available for Hebrew and English letters/digits. Complete by covering the guided path; free coloring is not completion.
- find: text, target. Child taps all matching letters. Text is split into graphemes so Hebrew vowel marks stay attached.
- match: choices [{id,label,emoji?,image?,correct:true/false}], target optional. Tap one correct choice.
- color: choices as above; all choices marked correct must be painted. Use choices for pictured objects, not alphabet knowledge beyond the lesson.
- count: count, emoji, answer, choices optional. Objects can be tapped one at a time; select numeral answer.
- arithmetic: operands [a,b], operation '+'/'-', emoji, choices optional. answer can be omitted. Set responseMode: 'keypad' for numeric entry or 'handwrite' for assisted drawn-digit answers instead of choices. Explicit answer is required for handwriting.
- keypad: answer, count optional, emoji optional; child enters a number using large keypad.
- build: target (word), letters (array including needed letters; repeats allowed). Select letters in reading order to build target; allow undo.

All books/pages always accessible. Keep IDs stable across edits for progress. Use exact `audioId` for pregenerated speech manifest lookup. Missing recordings fall back to device speech. Asset paths relative to public root, e.g. `portraits/asia.webp`, so GitHub Pages subpaths work.

Content rules: Hebrew starts at א in alphabetical order, first batch א–ד, expose all lessons. Separate letter name from sound. Do not imply א always says /a/. Include friendly review, numbers 0–20 staged, arithmetic <=10, and English separately. Instructions in Hebrew except English phonics exercise text may be English. No timing, penalties, locked lessons, or automatic mastery claims.

Additional kinds: `freeze`, `puzzle`, `keybash` provide untimed standalone play pages. `typing` takes `typingMode: find|repeat`, `keyboardLocale: he|en|numbers`, and optional `targets: string[]` / `sequences: string[]`. Place fun books in the `play` theme or insert pages into another book. All games accept mouse/touch; typing also accepts physical keyboards.

Recognition targets use deterministic `recognitionClass(seed, variant)` from `src/recognition.ts`. Instructions never use recognition-font classes. Public builds disable portrait references.

`select` is the multi-picture recognition activity (tap all correct choices); it has no color picker. The legacy `color` kind is rendered as selection for backward compatibility. `paint` is an independent freehand drawing page using a target-matching outline, palette, brushes, eraser and undo. Completing painting is a child's explicit choice, never a correctness grade. Keep selection and painting on different pages.


## Extended curriculum and numeric creation
- `handwrite`: integer `answer` 0–20; optional `count` and `emoji` for a visual counting question. The local recognizer compares ink against all ten digit templates, offers up to three suggestions, and requires explicit confirmation. Uncertain ink is not marked wrong. A keypad alternative always remains available. Two-digit answers are composed one digit at a time.
- `number-shape`: a single digit `target` 0–9 and a nonempty `letters` bank. Children drag letters onto the numeral path or select a letter and tap slots. This is a visual mosaic activity, with no numerical values assigned to letters.
- `paint`: numeral targets 0–20 use outlined numeral glyphs. New letter targets without a matching object outline use the letter glyph; instructions must say letter coloring rather than claim an object starts with that letter.

Alphabet data and print tracing paths live in `src/content/alphabet.ts`. Word-building chapters declare `wordBuildingPrerequisites` in the content entrypoint; validation rejects targets with glyphs outside their milestone. Hebrew final forms are introduced after their regular form. Preserve existing lesson/page IDs when extending content so saved progress remains valid.

# Curriculum

All books and pages are selectable. Order is a suggestion, never a lock. Pages record completion, not a claim that a child has mastered a skill.

## Hebrew

Start again at א, then ב, ג, ד. Each book introduces the letter by name, guides tracing, highlights it in familiar words, asks for a matching word, finds every occurrence in written words, colors pictures whose labels begin with it, and reviews recognition. Books ב–ד also recall the previous letter. Words are spoken and illustrated; a child's recognition of an initial printed letter is distinct from independently reading an unpointed word.

א is not taught as a fixed /a/ sound. ב is introduced by its letter name; its בּ/ב pronunciation distinction is not falsely collapsed into one immutable sound. Future vowel lessons should define reviewed recordings for exact consonant/vowel combinations. Existing phonics prompts require listening review before relying on automatic TTS pronunciation.

The combination book uses only א–ד to construct אבא, דג, גג. It is explicitly supported spelling/letter ordering, not unassisted unpointed decoding. The full known name אסיה appears as an example and for letter counting even though ס, י, ה have not received individual lessons. Classroom names other than Asia are pending confirmed Hebrew spelling.

Letter counting means written letters, not phonemes or syllables. אבא has three, דג two, אסיה four. This connects literacy to number recognition without introducing gematria.

## English

Separate lowercase phonics books s, a, t, m introduce both the upper/lowercase relationship and a familiar initial-sound word. The short vowel in apple is separate from the letter name A. Each book includes listening, tracing, finding, matching and coloring. Word construction mat/sat follows the four starter letters, with adult-supported blending and spoken meanings. No isolated phoneme TTS is assumed accurate without review.

## Numbers

Three books cover 0–5, 6–10, 11–20. Each number receives a count-and-match page. Every numeral 0–20 receives explicit stroke guides. Multi-digit guides place their component digits side by side in left-to-right numeral order; keypad practice reinforces entering them. Each range includes quantity coloring and a keypad challenge. Zero is an empty set. The largest choice in a stage stays within that stage.

Addition and subtraction use thirteen visual stories each, all operands/results within 0–10; subtraction never yields a negative quantity. Both include zero (adding to an empty group and taking everything away). Initial stories use answer choices; each operation ends with three harder visual stories answered on a keypad. Each number range also has a numeral-coloring page, separate from coloring matching quantities. A separate keypad book practices entering counted quantities without multiple-choice cues.

## Full alphabet and word-building extensions

Hebrew continues in order through ת. Five final-form books appear directly after כ, מ, נ, פ and צ; final forms are alternate shapes of the same letter rather than additional alphabet positions. Every new letter has explicit upright print tracing guides, familiar word examples, recognition, finding and review. Later coloring pages paint the letter glyph; the original starter objects remain available.

English continues from s/a/t/m through i/n/p/c/k/e/h/r/d/g/o/u/l/f/b/j/v/w/x/y/z/q. Short vowels are distinguished from letter names; c/g examples use their hard sound, x is found inside/at the end of words such as fox (not falsely presented as an initial /ks/ word), and q/u are discussed together. Milestone word books use previously introduced letters; written-letter counting is separate from phoneme counting. Keyboard chapters cover the expanded alphabets in small selectable groups.

Every number 0–20 now has a freehand painting page. The number creation book builds ten numeral shapes from familiar letter tiles and practices handwritten answers through 20. This is a letter-tile mosaic, not gematria. Handwriting recognition runs on the device, proposes candidates for explicit confirmation, and provides a keypad alternative. It does not silently interpret an uncertain toddler drawing as a wrong answer. Additional visual arithmetic stories allow the same assisted drawn-digit response.

## Extending

Add lessons in src/content/index.ts using the contract in docs/LESSON_API.md. Retain IDs after release so device-local completion is stable. Every page gets a deterministic audioId. Each new word-building target must be constructible from its supplied letter tiles and use only letters already introduced in the suggested sequence. New pages must not silently change an existing page's expected answer.

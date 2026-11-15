# Starter curriculum

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

## Deferred exercise modes

The shared renderer has no API for assembling numeral outlines from letter-shaped pieces or freehand numeral recognition. These are extension points, not silently simulated as completed features. Current harder number answers use a visible keypad, including the final three visual stories in each arithmetic book.

## Extending

Add lessons in src/content/index.ts using the contract in docs/LESSON_API.md. Retain IDs after release so device-local completion is stable. Every page gets a deterministic audioId. Each new word-building target must be constructible from its supplied letter tiles and use only letters already introduced in the suggested sequence. New pages must not silently change an existing page's expected answer.

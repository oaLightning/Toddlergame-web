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

## Painting, richer puzzles, speech and iPhone feedback update
+- Selection pages and freehand painting now use separate exercise kinds. Browser verified freehand ink and undo; selection no longer has a cosmetic palette.
+- Added target-appropriate printable outlines, expanded Hebrew and English vocabulary, and alternating reward corners.
+- Puzzles have rich themed backgrounds with landmarks in every dense-grid cell and animated wrong-drop returns.
+- Audio feedback uses bundled WAV media files; explicit enable/test control and visible playback diagnostics were added for iOS. Physical iPhone validation still requires the user's device.
+- Gemini generated real narration WAVs. Quota/transient missing-output handling is resumable; completed clips are preserved. The user authorized encrypted GitHub secret storage and GEMINI_API_KEY is configured; no Gemini credential is in source or frontend output.

## Current outstanding work
- Finish the 1197 pending narration clips (12 of 1209 ready after curriculum expansion), then review Hebrew pronunciation, letter names, phonics and volume.
- Verify audio unlocking/replay and touch tracing/painting/puzzle dragging on physical iPhone/iPad browsers.
- Full alphabets and milestone word-building activities are implemented; future vowel/blending lessons can deepen reading practice.
- Numeral painting, assisted drawn answers and number-shape mosaics are implemented.
- Add future approved Asia illustrations; keep classroom photos/contact data out of public deployment.
- A parent content review precedes any trial with Asia.

The first authorized Actions run generated number.he.5, committed it, dispatched deployment, and then stopped on Gemini HTTP 429 daily/zero quota exhaustion. Secret authentication and partial-result publication were verified.

## Alphabet, number creation and faster freeze release — 2026-11-15
- User confirmed the sound check works on a physical iPhone. Physical iPad drawing/dragging remains unverified.
- 76 books / 720 pages validate. Full alphabets and final forms, painting for 0–20, correct initial-letter choices, and word-building milestones checked against actual preceding letter introductions.
- 43 automated tests pass, including all ten handwriting templates under translation/scaling, uncertainty for scribbles, mosaic geometry, full-arena travel and acceleration/bounds.
- Browser completed numeral1 mosaic via tap controls and a handwritten1 via drawing, candidate confirmation and answer checking. Freeze progressed through all8 targets and victory at3.8x speed via keyboard input. Mouse/touch drawing uses pointer events; no physical iPad trial or trial with Asia.
- 1209 speech entries now cataloged,12ready and1197pending. No new recorded speech claimed; provider quota remains the audio bottleneck.

## Faster speech and varied feedback
- Existing narration now plays at1.15×, preserving pitch; device speech uses0.95.
- Random praise uses three Hebrew and three English phrases, without consecutive repetition. Retry variations retain the exercise language. Three additional bundled playful effects rotate with the original success chime.
- Parent audio review lists actual ready clips and clearly labelled device-voice instruction examples.
-46automated tests, production/privacy check and content validation pass. Browser review confirmed ready/pending labels and playback activation.

## Approved ElevenLabs integration —2026-11-16
- Parent approved Sarah/v3 and Jessica/v4 after listening to Hebrew trial samples.
- Mixed-provider generator preserves existing Gemini recordings and resumes missing content with stable per-lesson voices. Identical payloads reuse existing MP3s, preserving credits.
- Gemini generator test verifies it retains unchanged approved ElevenLabs recordings, including MP3 source paths.
- Parent review now identifies ElevenLabs voice provenance, includes attribution and paginates long recording lists. Instruction samples reflect actual ready status.
-52automated tests pass. First144ElevenLabs files decode successfully with ffprobe; browser playback accepted a recorded Hebrew instruction after explicit audio activation.

Release results: 208 ElevenLabs entries ({'Sarah': 70, 'Jessica': 138}), 3695 reported credits plus130trialcredits; 47 entries reused existing audio. 221 total ready recordings. All new files decode successfully.

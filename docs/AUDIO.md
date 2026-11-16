# Speech assets

The game is static: it plays downloaded audio and never calls an AI provider at runtime. No API key belongs in client code, Git, a browser setting, or a public file. Set `OPENAI_API_KEY` or `GEMINI_API_KEY` only in the asset-generation process environment. Do not use a `VITE_` prefix for either key.

## Current status

No OpenAI API key was available during implementation or the subsequent OpenAI generation retry. That attempt stopped with a missing-key error; it did not leave a background generation process running. A Gemini engine was subsequently added for an AI Studio key supplied only to the generation process. The manifest's `status` and `src` fields are the authoritative recording status; no pending entry is advertised as a recording. Device speech remains a fallback. Phoneme pronunciation needs adult listening review before teaching.

## Generate

Requires Node 22+ and installed project dependencies. From the repository root:

```sh
npm install
node scripts/generate-audio.mjs --catalog-only
node scripts/generate-audio.mjs --only he- --limit 3
node scripts/generate-audio.mjs
node scripts/generate-audio.mjs --check
```

Set the key in the shell/session beforehand; the script intentionally does not load `.env` files or accept keys as command arguments. The catalog-only command is a free dry run. Generation uses the selected provider’s API quota and may incur charges. Start with a few clips and listen before generating the full catalog.

With `--engine speech`, generation uses `/v1/audio/speech`, `gpt-4o-mini-tts`, voice `marin`, WAV output and 0.9 speed. Change `--voice` or `--model` (or `OPENAI_TTS_VOICE` / `OPENAI_TTS_MODEL`). The current Speech API models are documented as supported until January 6, 2027; re-check official docs before generating after that date. `--engine realtime` selects the documented successor workflow, `gpt-realtime-2.1-mini`, over WebSocket and wraps 24kHz PCM in WAV. That optional mode requires the development dependency `ws`. It has not been live-tested without a key.

Generation writes each completed asset and manifest entry immediately, so an interrupted run resumes. Matching fingerprints skip valid existing files. Changes to pronunciation text, voice, model, or generation settings invalidate a clip. `--force` regenerates selected clips. `--only PREFIX` and `--limit N` bound paid work. Unneeded old audio files are not automatically deleted.

## Gemini / Google AI Studio

With `GEMINI_API_KEY` available only in the process environment:

```sh
node scripts/generate-audio.mjs --engine gemini --only feedback.success.he --limit 1
node scripts/generate-audio.mjs --engine gemini --delay-ms 6500
node scripts/generate-audio.mjs --engine gemini --check
```

The Gemini default is `gemini-2.5-flash-preview-tts` with voice `Kore`. Override via `--model` / `--voice` or `GEMINI_TTS_MODEL` / `GEMINI_TTS_VOICE`. Requests go to `https://generativelanguage.googleapis.com/v1beta/models/MODEL:generateContent`, with the API key in a request header, never a URL. The single-speaker response is decoded from `candidates[].content.parts[].inlineData`; 24 kHz mono 16-bit PCM is wrapped in WAV, and complete WAV responses are preserved without adding a second header. Unsupported sample rates/formats fail rather than produce broken files.

Google's official TTS docs list Hebrew support and the selected model/voice. The generator also supports the current Gemini 3.8 schema when a `gemini-3.8...` model is explicitly selected: transcript and speech-style metadata remain separate, and its default WAV output is preserved.

`--delay-ms` sets a pause between clips so a run can respect its project's quota. Gemini HTTP 429/500/503 responses retry up to six total attempts, using structured Google `RetryInfo` and `Retry-After` hints where provided, otherwise exponential backoff. Each pause is bounded to 60 seconds. Obvious daily-quota or zero-quota exhaustion stops immediately instead of retrying repeatedly. Logs include only HTTP status, safe retry timing and a generic stop reason, never credentials or full provider payloads; completed clips remain saved for resumption. Always repeat the same `--engine`, model, and voice when checking or resuming a catalog: choosing another engine intentionally invalidates the cached fingerprints.

An otherwise successful Gemini response that lacks inline audio gets up to three attempts. Logs expose only allowlisted `finishReason` / `blockReason` enums, never provider response text. Explicit content blocks stop generation. A transient missing-audio clip that still fails after retries remains pending while the generator continues with later clips; the batch exits with failure at the end so partial completion is visible and resumable. Quota failures, blocked clips, unsupported formats and other errors are not silently skipped.

## Adding content

`src/content/index.ts` is the source of lesson narration. The script loads it with Vite's TypeScript loader without starting an HTTP server. Narration language is inferred from the spoken text (Hebrew script first, then English letters, otherwise the lesson locale), so Hebrew directions in an English book remain Hebrew. Page narration uses `speech ?? instruction`; its ID is `audioId ?? lesson.id + '.' + page.id`. Example words use `lesson.id + '.' + page.id + '.example.' + index`.

Write optional `speech` as a pronunciation-specific variant (including Hebrew vowel marks where useful). A letter-name clip should say the name: אָלֶף, בֵּית, גִּימֶל, דָּלֶת. A consonant-sound clip must be separate; do not teach that א has one fixed vowel sound. Review isolated English consonants too: TTS may turn a written letter into its name instead of its phoneme. Parent recordings may be substituted by placing a WAV at the declared path and setting a matching manifest entry to `ready`.

The manifest is a JSON object keyed by stable ID. Only ready entries have `src`, relative to the static public root. Pending entries have `src: null` so missing files are never advertised as working speech. Shared feedback IDs are `feedback.success.he`, `feedback.retry.he`, `feedback.success.en`, and `feedback.retry.en`. Narration is a neutral friendly voice, not a character impersonation. The parent screen should disclose that generated narration is AI-generated.

Shared runtime prompts also include `game.freeze.win`, `number.he.0` through `number.he.20`, `number.en.0` through `number.en.20`, `key.he.alef/bet/gimel/dalet`, and `key.en.a/s/t/m`. These are letter names and number names, not isolated phonemes. Playback must use these IDs (or map the corresponding texts) to use the generated clips instead of browser speech. The current catalog size is printed on each generator run and grows as lessons or shared prompts are added.

## References

- https://developers.openai.com/api/docs/guides/text-to-speech
- https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create
- https://developers.openai.com/api/docs/guides/realtime-conversations
- https://ai.google.dev/gemini-api/docs/speech-generation
- https://ai.google.dev/gemini-api/docs/generate-content/speech-generation

## Checks

```sh
node --test scripts/generate-audio.test.mjs
```

These validate catalog ID agreement, pronunciation overrides, collision/path rejection, cache fingerprints, and PCM WAV encoding. Live OpenAI generation and listening review require a key.

Gemini is now the CLI default for this project, so catalog checks/resumes retain the existing Gemini recording fingerprints. Use `--engine speech` explicitly for OpenAI. Eleven clips were produced in the initial live run before Gemini reported exhausted quota. The user authorized encrypted GitHub Actions secret storage on 2026-11-15; `GEMINI_API_KEY` is configured in Toddlergame-web. Run the Generate speech recordings workflow to resume pending clips; quota exhaustion stops cleanly and preserves completed clips.


## Playback pace and feedback variation
Recorded narration plays at 1.15× with pitch preserved; device speech rate is 0.95 (previously0.8). Playback changes do not invalidate existing recording fingerprints. Shared feedback text lives in `src/content/feedback.json`: six praise options across Hebrew/English and six gentle retry options. Praise freely mixes languages and avoids immediate repeats; retries stay in the exercise language. Missing recordings use the labeled device-speech fallback. Local sparkle/bubble/boing WAV effects vary independently of narration and require no provider.

Parents can open להורים → האזנה להקלטות ולהוראות to hear ready recordings and representative lesson instructions. Each sample explicitly distinguishes a ready recording from device speech. The initial12ready clips include numbers0–5, activation, retry/praise and freeze victory; no lesson instructions were recorded at that checkpoint. Generate feedback variants with the Actions workflow prefix `feedback.` before resuming the full catalog.


## Approved ElevenLabs voices
The parent approved Sarah (`eleven_v3`) and Jessica (`eleven_v4`) after hearing the trial on2026-11-16. Both voices are assigned deterministically by lesson, and feedback includes both. This is offline generation only: `ELEVENLABS_API_KEY` lives in the generation process environment and is not configured in GitHub Actions.

```sh
node scripts/generate-elevenlabs.mjs --dry-run --max-credits 8000 --limit 150
node scripts/generate-elevenlabs.mjs --max-credits 8000 --limit 150
```

The key must already be in the environment. Defaults reserve at most8,000credits conservatively for one invocation. Check remaining monthly credits before another invocation; the cap is per run, not a provider-enforced account spending limit. Subscription-read permission was unavailable on the supplied key. Requests stop on quota/permission errors or unavailable cost metadata rather than retrying blindly. Each successful MP3 is saved atomically with voice/model, generation time and actual `character-cost`. Duplicate text in the same voice/model reuses audio for no extra credits. A per-clip manifest retains Gemini clips alongside ElevenLabs clips; later Gemini resumes preserve unchanged approved ElevenLabs assets.

Generation prioritizes feedback, standalone-game instructions, Hebrewא–ד and Englishs/a/t/m page instructions, early counting/arithmetic and examples. Playback still uses the existing1.15× pace. Ready recordings and voice attribution are visible in the parent listening section. Public ElevenLabs attribution is included there.

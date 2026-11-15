# Speech assets

The game is static: it plays downloaded audio and never calls OpenAI at runtime. No API key belongs in client code, Git, a browser setting, or a public file. Set `OPENAI_API_KEY` only in the asset-generation process environment. Do not use a `VITE_` prefix for it.

## Current status

No OpenAI API key was available during implementation. The initial catalog contains 180 clips; all manifest entries are pending, not fabricated recordings. Device speech is a fallback; its voices and quality vary. Phoneme pronunciation needs adult listening review before teaching.

## Generate

Requires Node 22+ and installed project dependencies. From the repository root:

```sh
npm install
node scripts/generate-audio.mjs --catalog-only
node scripts/generate-audio.mjs --only he- --limit 3
node scripts/generate-audio.mjs
node scripts/generate-audio.mjs --check
```

Set the key in the shell/session beforehand; the script intentionally does not load `.env` files or accept keys as command arguments. The first command after `npm install` is a free dry run. Generation uses paid OpenAI API calls. Start with a few clips and listen before generating the full catalog.

The default is `/v1/audio/speech`, `gpt-4o-mini-tts`, voice `marin`, WAV output and 0.9 speed. Change `--voice` or `--model` (or `OPENAI_TTS_VOICE` / `OPENAI_TTS_MODEL`). The current Speech API models are documented as supported until January 6, 2027; re-check official docs before generating after that date. `--engine realtime` selects the documented successor workflow, `gpt-realtime-2.1-mini`, over WebSocket and wraps 24kHz PCM in WAV. That optional mode requires the development dependency `ws`. It has not been live-tested without a key.

Generation writes each completed asset and manifest entry immediately, so an interrupted run resumes. Matching fingerprints skip valid existing files. Changes to pronunciation text, voice, model, or generation settings invalidate a clip. `--force` regenerates selected clips. `--only PREFIX` and `--limit N` bound paid work. Unneeded old audio files are not automatically deleted.

## Adding content

`src/content/index.ts` is the source of lesson narration. The script loads it with Vite's TypeScript loader without starting an HTTP server. Narration language is inferred from the spoken text (Hebrew script first, then English letters, otherwise the lesson locale), so Hebrew directions in an English book remain Hebrew. Page narration uses `speech ?? instruction`; its ID is `audioId ?? lesson.id + '.' + page.id`. Example words use `lesson.id + '.' + page.id + '.example.' + index`.

Write optional `speech` as a pronunciation-specific variant (including Hebrew vowel marks where useful). A letter-name clip should say the name: אָלֶף, בֵּית, גִּימֶל, דָּלֶת. A consonant-sound clip must be separate; do not teach that א has one fixed vowel sound. Review isolated English consonants too: TTS may turn a written letter into its name instead of its phoneme. Parent recordings may be substituted by placing a WAV at the declared path and setting a matching manifest entry to `ready`.

The manifest is a JSON object keyed by stable ID. Only ready entries have `src`, relative to the static public root. Pending entries have `src: null` so missing files are never advertised as working speech. Shared feedback IDs are `feedback.success.he`, `feedback.retry.he`, `feedback.success.en`, and `feedback.retry.en`. Narration is a neutral friendly voice, not a character impersonation. The parent screen should disclose that generated narration is AI-generated.

## References

- https://developers.openai.com/api/docs/guides/text-to-speech
- https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create
- https://developers.openai.com/api/docs/guides/realtime-conversations

## Checks

```sh
node --test scripts/generate-audio.test.mjs
```

These validate catalog ID agreement, pronunciation overrides, collision/path rejection, cache fingerprints, and PCM WAV encoding. Live OpenAI generation and listening review require a key.

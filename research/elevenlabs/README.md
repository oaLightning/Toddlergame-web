# ElevenLabs bounded API trial

Date:2026-11-16. No key is stored in this checkout or GitHub Actions. The key is authorized for direct ElevenLabs API use only.

Four API calls succeeded. Reported `character-cost` response headers total130credits (13+13+74+30), or1.3% of the user-stated10,000monthly allowance. Subscription read returned401 missing_permissions, so account balance/renewal were not verified.

| Asset | Model/voice | Reported credits | Duration |
|---|---|---:|---:|
| sarah-praise-v3.mp3 | eleven_v3 / Sarah |13|1.724s|
| jessica-praise-v4.mp3 | eleven_v4 / Jessica |13|2.273s|
| sarah-instructions-v3.mp3 | eleven_v3 / Sarah |74|9.482s|
| ice-magic.mp3 | default sound-effects model |30|1.515s|

Both praise samples say “כל הכבוד! הצלחת!”. Compare with public/audio/feedback.success.he.wav (Gemini Kore,3.371s original). Compare at the same playback rate; the game normally uses1.15×. The ElevenLabs instructions say “זאת האות אָלֶף. עקבי באצבע אחרי הקווים. יש לנו שלושה תפוחים. ניקח תפוח אחד. כמה תפוחים נשארו?”

Model metadata reports Hebrew support for eleven_v3 and eleven_v4, and no Hebrew support for multilingual_v2/flash_v2_5. Listed premade voices have English language labels; Hebrew accent/pronunciation requires listening review. No claim is made that an assistant listened to the files: this runtime provides no reliable audio perception. Valid MP3 metadata/duration checks are technical checks only. These samples have not replaced game recordings.

The free-plan information states personal/noncommercial use and attribution requirements; public delivery should include ElevenLabs attribution. Official references: https://elevenlabs.io/docs/overview/capabilities/text-to-speech ; https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert ; https://elevenlabs.io/pricing .

Use this provider first for short feedback and a small set of reusable instructions, not an unrestricted whole-catalog run. Existing Gemini recordings should be retained. New provider settings need per-clip provenance and credit caps so changing provider does not mark other recordings invalid.

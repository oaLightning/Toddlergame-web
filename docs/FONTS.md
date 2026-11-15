# Recognition font variation

Recognition targets, word labels and letter/numeral answer choices can rotate among four upright printed families. Instructions, controls and other explanatory UI retain the same clear application font. Tracing guides remain fixed authored paths and must not vary by font.

| CSS class | Font | Style |
| --- | --- | --- |
| `recognition-font-0` | Heebo | Clear sans serif |
| `recognition-font-1` | Rubik | Rounded printed sans serif |
| `recognition-font-2` | Frank Ruhl Libre | Traditional printed Hebrew serif |
| `recognition-font-3` | Assistant | Open, narrow printed sans serif |

Each family contains the complete Hebrew alphabet (including final forms), basic uppercase/lowercase Latin alphabet, and digits 0–9. None is italic, cursive or handwriting. Use a stable variation per exercise/choice so a letter does not change shape while the child is answering. Apply one family to an entire word rather than mixing families within it. Leave physical/on-screen keyboard key positions and labels consistent; vary the target to be identified.

All fonts are bundled locally as WOFF2 files, converted losslessly from official Google Fonts TrueType distributions without changing glyph shapes. No Google Fonts network request occurs during gameplay. The source URLs and sizes are recorded in `public/fonts/manifest.json`; each family's SIL Open Font License text is included beside the font.

Official sources:
- https://github.com/google/fonts/tree/main/ofl/heebo
- https://github.com/google/fonts/tree/main/ofl/rubik
- https://github.com/google/fonts/tree/main/ofl/frankruhllibre
- https://github.com/google/fonts/tree/main/ofl/assistant

Glyph coverage was checked programmatically against all 27 Hebrew forms, 52 basic Latin letters and ten digits. Fonts should still be reviewed at the actual exercise sizes when adding new lessons.

# Automatic public deployment

The public game source is `oaLightning/Toddlergame-web`. Pushes to its `main` branch run `.github/workflows/pages.yml`: install dependencies, run tests, validate lesson data, build and verify the photo-free output, upload only `dist/`, and deploy that artifact to GitHub Pages. Manual runs are also supported through Actions.

The original `oaLightning/Toddlergame` stays private because its existing Git history contains classroom portraits. GitHub Free cannot enable Pages on that private repository. It runs build checks, but the workflow deploys only from `Toddlergame-web`. Make future public-game changes in `Toddlergame-web` to publish them automatically.

The public repository was initialized from a clean, checked export, with neither the original Git history nor `public/portraits/` nor document screenshots. No long-lived deployment credential is stored: deployment uses GitHub's short-lived `GITHUB_TOKEN` and Pages OIDC permissions.

## Photo exclusion

- Public builds are the default; `VITE_INCLUDE_PRIVATE_PHOTOS` is false unless explicitly enabled outside Actions.
- The build copies only allowlisted media directories (`characters`, `audio`, `fonts`). Portraits are never first copied into public output.
- UI/lesson portrait references are disabled in public mode.
- `verify-public-build.mjs` rejects portrait folders, PDFs, known private photo bytes under renamed filenames, and credential patterns.
- Actions refuses builds with the private-photo flag enabled. The public source itself contains no classroom photos.
- Never make the original private repository public: removing images in a new commit does not remove them from history.

## Working with both checkouts

Normally, work in the public web repository. If changes are first made in the private checkout, commit them and run `node scripts/export-public.mjs ../Toddlergame-web` to copy only safe tracked files into a separate checkout, then review/commit/push there. This export preserves the destination's `.git` directory and never copies source Git history or credentials. It is an explicit source export, not an automatic cross-repository credential connection.

The app remains completely static. No hosting account or backend process is required beyond GitHub Pages.

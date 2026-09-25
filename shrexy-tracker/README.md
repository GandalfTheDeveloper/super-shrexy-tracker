# Super Shrexy Tracker

A wall-display + phone workout tracker that syncs to a Google Sheet via Apps Script.

## Local development

```
npm install
npm run dev
```

## Deploy

Push to the `main` branch on GitHub. The included GitHub Actions workflow
(`.github/workflows/deploy.yml`) builds the app and publishes it to GitHub
Pages automatically. Make sure Pages is set to deploy from "GitHub Actions"
in the repo's Settings → Pages.

## First-time setup in the app

Open the deployed site, tap the gear icon, and enter:

- Apps Script web app URL (ends in `/exec`)
- Secret key (matches `SECRET_KEY` in the Apps Script)
- Cycle anchor date (a Monday that begins Week 1 of the 2-week program)

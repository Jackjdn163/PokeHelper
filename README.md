# PokéPilot Living Form Dex

PokéPilot is a static Pokemon helper website with a modern Pokédex feel, a living-form dex, Switch-game tracking, shiny tools, and a dedicated scan console.

## Features

- full living-form dex with grouped alternate forms and sprites
- dedicated scan console with stats, matchups, evolutions, Pokédex entries, and location intel
- per-game Switch availability for `LGPE`, `SWSH`, `BDSP`, `PLA`, and `SV`
- shiny hunt helper, EXP planner, playthrough tracker, notebook, and HOME layout tools
- optional Supabase-powered trainer accounts with cross-device sync
- offline shell support through a service worker and web manifest

## Local Run

You can open `index.html` directly, but for the best behavior use a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Ready

This project is already prepared for GitHub Pages:

- `.github/workflows/deploy-pages.yml` deploys the site automatically from `main`
- `.nojekyll` prevents GitHub Pages from trying to process the site with Jekyll
- `.gitignore` keeps common local junk out of the repo

## Push To GitHub

Create a new empty GitHub repository, then run:

```bash
git init
git add .
git commit -m "Initial PokéPilot site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Enable GitHub Pages

After pushing:

1. Open your repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set the source to `GitHub Actions`.
4. Pushes to `main` will publish the site automatically.

Your site will usually go live at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

## Cloud Accounts Setup

PokéPilot can now use Supabase for real sign-in accounts and cross-device save sync.

### 1. Create a Supabase project

Create a project, then enable `Email` and `Google` under `Authentication` -> `Providers`.

For Google:

1. Create a Google OAuth client for a `Web application`.
2. Add your site origin, such as `https://YOUR-USERNAME.github.io`, under authorized JavaScript origins.
3. Add your Supabase Google callback URL under authorized redirect URIs.
4. In Supabase, open the Google provider page and copy the callback URL shown there.
5. Paste the Google client ID and secret into the Google provider settings in Supabase.

### 2. Add the cloud save table

Open the Supabase SQL editor and run:

```sql
-- from supabase/schema.sql
```

The actual file is here:

- `supabase/schema.sql`

This creates a `public.cloud_saves` table with row-level security so each user can only read and write their own save.

### 3. Add your project keys

Edit `supabase-config.js` and fill in:

```js
window.DEXTER_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  redirectTo: "https://YOUR-USERNAME.github.io/YOUR-REPO/"
};
```

Use your deployed GitHub Pages URL for `redirectTo`, and add that same URL to the Supabase Auth redirect URL list.

Recommended local dev value:

```js
redirectTo: "http://localhost:8000/"
```

### 4. Redeploy

Commit and push the config and app changes:

```bash
git add .
git commit -m "Add Supabase account sync"
git push
```

### 5. Sign in from the Vault tab

Once configured, the `Cloud Accounts` card in `Trainer Vault` can:

- create a real email/password account
- sign in with Google
- sign in on a second device
- pull the cloud save onto a new device
- push the current device over the cloud save
- auto-sync later local changes once the device is linked

## Notes

- Live Pokemon data comes from [PokeAPI](https://pokeapi.co/).
- Progress and helper data are currently stored in browser `localStorage`.
- Cloud sync is optional and only turns on after `supabase-config.js` is filled out.
- Service workers only work on `http://localhost` or `https://`, so the offline installable behavior will be much better once the site is hosted.

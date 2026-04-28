# DexterOS Living Form Dex

DexterOS is a static Pokemon helper website with a modern Pokédex feel, a living-form dex, Switch-game tracking, shiny tools, and a dedicated scan console.

## Features

- full living-form dex with grouped alternate forms and sprites
- dedicated scan console with stats, matchups, evolutions, Pokédex entries, and location intel
- per-game Switch availability for `LGPE`, `SWSH`, `BDSP`, `PLA`, and `SV`
- shiny hunt helper, EXP planner, playthrough tracker, notebook, and HOME layout tools
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
git commit -m "Initial DexterOS site"
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

## Notes

- Live Pokemon data comes from [PokeAPI](https://pokeapi.co/).
- Progress and helper data are currently stored in browser `localStorage`.
- Service workers only work on `http://localhost` or `https://`, so the offline installable behavior will be much better once the site is hosted.

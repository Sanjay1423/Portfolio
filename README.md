# Sanjay S — portfolio

Personal site: https://sanjay1423.github.io/Portfolio/

A single static page built with [Astro](https://astro.build), TypeScript and hand-written CSS. The full design and build plan is in [`docs/REDESIGN_SPEC.md`](docs/REDESIGN_SPEC.md).

## Principles

- **Content is data.** All copy lives in `src/content/*.ts`; components only render it. Optional fields (`?:`) render nothing until they are filled in, so there are no placeholder strings.
- **No client framework.** About 2 KB (gzipped) of vanilla TypeScript for the menu, scrollspy, theme toggle, project filter, copy button and clock.
- **Works without JavaScript.** Controls that need JS are hidden until it runs; every section, link and project is readable without it.
- **Native HTML first.** `<dialog>` for the mobile menu, `<details>` for the stack layers, `:target` for highlighting.
- **Accessible by default.** WCAG 2.2 AA contrast in both themes (measured), visible focus, reduced-motion support, live regions for the filter and copy.

## Run it

Requires Node 22.23.4 or newer.

```sh
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve the build at http://localhost:4321/Portfolio/
npm run check     # type check
npm run todo      # list optional content still missing
npm run audit     # check no copy from the old site was lost (needs the legacy-v1 tag)
```

## Structure

```
src/content/     profile, stack, experience, projects (the copy)
src/components/  one component per section
src/scripts/     small interaction scripts
src/styles/      tokens, base, layout, per-section CSS, motion
public/          favicon, OG image, robots.txt (and the résumé PDF when added)
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repository settings, **Pages → Source** must be set to **GitHub Actions**.

## Measured (local production build)

Lighthouse mobile and desktop: 100 / 100 / 100 / 100. Mobile LCP 1.8 s, CLS 0. axe: 0 violations in both themes at 390 px and 1440 px.

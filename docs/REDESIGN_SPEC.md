# Portfolio Redesign: Implementation Spec (v3, reviewed against the repo)

For Sanjay S · Revised November 10, 2026 · Hand to an agent in Antigravity, phase by phase.
Save as `docs/REDESIGN_SPEC.md` in the repo root (replace v2).

Section markers: **(unchanged)** carried over from v1, **(revised)** edited, **(new)** added in v2, **(v3)** added or changed in this review.

## v3 review summary (v3)

**Verdict:** v2 is a strong, implementable plan. The direction, scope control, phasing and accessibility posture are sound. v3 keeps all of it and fixes gaps found by checking the spec against the actual repo (`github.com/Sanjay1423/Portfolio`, branches `main` and `ui-v2` at the single commit `286a343`) and by measuring the tokens.

| v3 change | Why | Where |
| --- | --- | --- |
| Deployment added: GitHub Actions workflow, `base: '/Portfolio'`, branch strategy | Astro output cannot be served by "deploy from branch"; the repo has no workflow, no CNAME, and is a project repo, so the URL carries a case-sensitive subpath | 0.1 gate 2, 5, 14 Phase 0 |
| JS-only controls hidden without JS; no-JS mobile nav | Menu `<dialog>`, theme toggle, filter and copy buttons do nothing without JS, which contradicts the "usable without JS" rule | 0, 7, 8.5, 8.6 |
| `light-dark()` fallback | In browsers without `light-dark()`, every token is invalid, so slab text (`#f1ede4`) lands on a transparent background and disappears | 4 |
| Layer marker and slab border tokens for dark mode | Measured: dark slabs are 1.16 to 1.46:1 against the page and `--rule` is 1.33:1, so layer squares and slab edges vanish | 4 |
| Focus ring on slabs uses `--on-layer` | Measured: `--accent` ring on light Hardware (2.97:1) and Mobile (2.34:1) slabs fails 3:1 | 4, 11 |
| Phase 2 removal list completed | Several dropped labels (nav "Home"/"Skills", skill-group headings, column titles, contact labels, retired alt text) were missing, so the audit could never pass | 2.2 |
| `#skills` handled with an alias anchor | A hash cannot be "redirected" without JS | 2.1, 8.3 |
| Hero uses `min-height` | A fixed `100svh` height clips on 320×568, landscape phones and at 200% zoom | 8.1 |
| Filter is reset when a `:target` link points at a hidden row | A Stack link to Life Jacket while "Professional" is selected lands on a hidden row | 8.3, 8.5 |
| Astro gotchas recorded (inline theme script, `BASE_URL`, font family names) | Each one silently breaks something (flash of wrong theme, 404s under `/Portfolio/`, fonts not applied) | 4, 5 |
| Content made a launch gate, with a case-study template | Real evidence moves recruiters more than any visual detail | 0.1 gate 7, 17 |
| Repo hygiene: `.gitignore`, pushed tag, git identity, README | `.DS_Store` is untracked with no `.gitignore`; commits are authored as `sanjay-paperflite` | 0.1 gate 6, 14 |

## Revision summary (what changed from v1 and why)

| Change | Reason |
| --- | --- |
| Pre-flight gates added (NDA, hosting, hero claim, confirmations) | These can invalidate work if answered late |
| Desktop inline nav; overlay menu only on mobile | v1 hid 6 links behind a Menu button on every screen, hurting a 20-second recruiter skim |
| Command palette, easter egg, custom cursor, Achievements machinery, sitemap moved to Backlog (Section 18) | Highest complexity and a11y risk, lowest recruiter value; they contradict "calm, one signature animation" |
| Native `<details>`, `<dialog>`, `:target` instead of custom JS for expand, menu, highlight | Less JS, free focus handling, works without JS |
| No hover-triggered previews or expansion; click/tap/Enter only | Avoids layout jumps and hover-only content |
| Five bespoke SVG illustrations replaced by one polished architecture diagram | One strong diagram beats five mediocre ones |
| Fake ticking latency label removed from hero trace | v1 forbids invented numbers and then adds one |
| Motion rule relaxed to match what v1 actually specified (stroke draw, grid-row expansion) | v1 said transform/opacity only but specified other properties |
| Tokens rewritten with `light-dark()`; layer tones now defined for dark mode | v1 left dark-mode slabs and tags nearly invisible and the dark block as a placeholder |
| `legacy/` folder replaced by a git tag | A folder in an Astro repo is not served and would pollute `dist/` |
| TODO fields become typed optional fields | A "TODO" string can leak to production; empty panels look broken |
| Résumé promoted from optional to primary CTA (if PDF exists) | Recruiter-first audience |
| Email click no longer hijacked; `mailto:` stays the default, copy is an extra button | Hijacking mailto breaks expectations and fails without clipboard access |
| Preservation checklist and intentional-removals list added | Makes "no regressions" and the Phase 2 audit achievable |
| Phases reordered so a presentable site exists early and enhancements come last | Lower risk; the agent cannot stall on animation before content is in |

## 0. How to use this document (revised)

1. Answer the pre-flight gates (Section 0.1) first.
2. Work one phase at a time (Section 14). Do not start phase N+1 until phase N passes its criteria.
3. Commit after every phase.
4. Ask the agent for a plan first and review it before it writes code. Section 16 has prompts.

**Rules for the agent (paste into workspace rules or the top of every prompt):**

- Treat this spec as the source of truth. If something is ambiguous, ask instead of guessing. Never edit this file.
- Never invent facts, numbers, dates, or achievements. Use the copy in Section 6 verbatim. Optional fields that are missing render nothing in production (and a dev-only badge in dev); components must look complete when optional fields are absent.
- No new **client-side** dependencies. Build-time dependencies (Astro, `@fontsource/*`, the image service) are allowed; anything else needs approval.
- Every animation has a `prefers-reduced-motion` fallback. Nothing may exist only on hover. Everything must remain usable with JavaScript disabled.
- **(v3)** No dead controls: any button that needs JS (menu, theme toggle, filter, copy) is not shown until JS has run (see Section 7).
- **(v3)** Every internal URL that is not a pure `#hash` goes through `import.meta.env.BASE_URL`. Never hardcode `/resume.pdf`, `/og-image.png` or `/favicon.svg`.
- **(v3)** Before relying on a newer browser feature (`light-dark()`, `<details name>`, `::details-content`, `animation-timeline`, `commandfor`), check current support on MDN and keep the stated fallback.
- After each phase run `npm run check && npm run build` and report results.

### 0.1 Pre-flight gates (new)

Answer these before Phase 0. Defaults are in brackets.

1. **NDA / employer permission:** may the Backend, Mobile and Desktop descriptions, and any case study (including the analytics extraction), be public at the level of detail in Section 6? [Assume yes at the current level of detail; no case studies until confirmed.]
2. **Hosting and URL:** where is the site deployed now (GitHub Pages user site, project page with a subpath, Netlify, Vercel, custom domain)? This sets Astro `site` and `base`, canonical URLs and OG URLs. [Required; no default.]
   **(v3) Pre-filled from the repo, confirm in GitHub → Settings → Pages:** the remote is `github.com/Sanjay1423/Portfolio`, with no `CNAME` and no `.github/workflows`. If Pages is on, the live URL is `https://sanjay1423.github.io/Portfolio/`, which means:
   - `site: 'https://sanjay1423.github.io'`, `base: '/Portfolio'` (case-sensitive: `/portfolio` will 404).
   - Pages source must change from "Deploy from a branch" to **"GitHub Actions"** when the redesign is merged (Section 14, Phase 0 and merge step).
   - Option: rename the repo to `Sanjay1423.github.io` for a clean root URL (`base: '/'`). This breaks the current URL, so do it only if the old link is not already on your résumé or LinkedIn.
3. **Hero positioning claim:** v1 proposed "I build backend systems, and ship them to phones, desktops, and devices." Your About says you are *most interested in* backend, while day-to-day work spans mobile, desktop and backend, and "devices" refers to a student project. Default: *I work across backend, mobile, and desktop, and care most about backend systems.* Pick or write your own; you must be able to defend it in an interview.
4. **Confirm:** Astro (vs staying plain HTML/CSS/JS), signal-orange accent, layer metaphor.
   **(v3) Also confirm section order.** v2 order is About → Stack → Experience → Work → Contact. A recruiter-first alternative is About → Experience → Work → Stack → Contact, which puts proof before concept in a 20-second skim. [Default: keep v2 order; if you switch, renumber Section 8 headers and the nav, and anchors stay the same.]
5. **Résumé PDF:** will you supply one? [If yes it becomes a primary CTA.]
6. **(v3) Git identity:** commits in this repo are authored as `sanjay-paperflite` (from your global git config; no repo-local identity is set). For a public personal repo, consider `git config user.name "Sanjay S"` and `git config user.email "<personal email>"` inside this repo before Phase 0. [Default: leave as is.]
7. **(v3) Launch-minimum content:** the redesign mostly changes presentation; recruiters respond to evidence. Before publishing (end of Phase 6), have at least: the résumé PDF, the Backend services case study (Section 17 template), and one real outcome on the current role. [Default: launch without them only if you explicitly accept that the site will read as a restyle.]

## 1. Decisions locked in (revised)

| Topic | Decision |
| --- | --- |
| Direction | **The Stack** (layered story) with editorial typography; hero pulse-line motif kept small |
| Accent | Signal orange; cold slate and warm graphite as layer tones |
| Framework | **Astro** (static) + TypeScript + hand-written CSS with tokens. Plain HTML/CSS/JS is a viable alternative if you prefer no build step; the design does not depend on Astro |
| Removed | Bootstrap (CSS and JS), Bootstrap Icons, AOS, Typed.js, Google Fonts runtime requests, the template footer credit (after Phase 8 verification) |
| Audience | Recruiters first (skimmable in about 20 seconds), engineers second |
| Metrics | None invented. Placeholders only until you supply real numbers |
| Achievements | Not in v1 of the redesign (Backlog) |
| Hosting | Static host; `site`/`base` per gate 2 |

## 2. Current state and preservation (revised)

**Structure:** single `index.html`, six sections (hero, about, skills, experience, work, contact), `main.css`, `main.js`.
**Dependencies:** Bootstrap 5 (CSS + JS bundle, effectively used only for the grid), Bootstrap Icons, AOS, Typed.js, Google Fonts (Manrope, Source Sans 3).
**Behaviors in `main.js`:** mobile sidebar toggle with `aria-expanded` and close-on-link-click, scroll-to-top button, AOS init with reduced-motion bypass, Typed.js role rotation, Work filter (`aria-pressed`), manual scrollspy **including an end-of-page rule that forces Contact active at the bottom**.
**Assets:** `portrait-square.jpg`, `hero.jpg`, `portrait-about.jpg`, `favicon.svg`.
**(v3) Repo facts checked on Nov 10, 2026:** one commit (`286a343 Initial commit`) on `main` and `ui-v2` (currently checked out); no `.gitignore` (`.DS_Store` is untracked); no `docs/`, no workflow, no `CNAME`. `hero.jpg` is 1063×1450 and 256 KB (budget is 120 KB, so it must be re-encoded). `main.css` is about 12 KB.

### 2.1 Preservation checklist (new)

Each item must still be true in the new site:

- All links (LinkedIn, GitHub, mailto) and the meta description.
- The Work filter (All / Professional / Earlier) with `aria-pressed`; without JS all projects show.
- Reduced-motion handling and `scroll-behavior: smooth` disabled under reduced motion.
- Menu closes when a nav link is chosen; `aria-expanded` and label are kept in sync.
- Scrollspy: the last section (Contact) becomes active when the page bottom is reached, even though it is short.
- LinkedIn and GitHub stay visible on every screen (the old sidebar always showed them). They go in the TopBar (desktop) and the footer.
- Existing anchors keep working: `#hero`, `#about`, `#experience`, `#work`, `#contact` unchanged. **(v3)** `#skills`: the Stack section is `id="stack"` and contains an empty alias anchor `<span id="skills"></span>` as its first child (works without JS; `scroll-padding-top` applies). A hash cannot be redirected without JS, so no redirect script.
- **(v3)** The hero image keeps its alt text: "Black and white portrait of Sanjay S on a hillside".
- **(v3)** The live URL from gate 2 keeps working after the switch to GitHub Actions deployment.
- Scroll-to-top: intentionally removed (wordmark links to top and the TopBar is sticky).

### 2.2 Intentional removals for the Phase 2 audit (new)

These sentences/labels are deliberately dropped or replaced. Everything else must survive verbatim.

- Section subtitles: "Full-stack engineer focused on services that stay maintainable and software that holds up in production."; "Languages, services, clients, and the tools I use to ship them."; "Professional work, a degree in electronics, and volunteer teaching."; "Product engineering across mobile, desktop, and backend, plus earlier projects."
- About h3 "Software Engineer at Paperflite." (replaced by hero metadata)
- Typed role labels "Full-Stack Engineer" and "Backend Engineer" (role stated once as Software Engineer)
- Facts list labels City/Email/Degree in About (email lives in Contact; city in hero metadata)
- Contact sentence "Email is the most direct way to reach me. I am based in Chennai." is **kept** as supporting copy under the closing headline.
- Copyright line and template credit (credit removal gated on Phase 8).
- **(v3) Also dropped (missing from v2, needed for the audit to pass):**
  - Page title "Sanjay S — Software Engineer" (replaced per Section 13) and the "I'm" prefix of the typed line.
  - Nav labels "Home" (wordmark replaces it) and "Skills" (becomes "Stack").
  - Skills section heading "Skills" and group headings "Languages", "Clients", "Databases and tools" (the items survive, regrouped into layers in `stack.ts`; "Backend" survives as a layer name).
  - Experience column titles "Professional" and "Education and volunteering" (replaced by the main log and indented branches).
  - Contact list labels "Email", "LinkedIn", "GitHub", "City" and the link texts "linkedin.com/in/sanjay-s-developer" and "github.com/Sanjay1423" (links become "LinkedIn ↗" and "GitHub ↗"; the URLs are unchanged).
  - Alt texts of retired photos: "Portrait of Sanjay S" and "Sanjay S in a tea garden".

## 3. Design concept: The Stack (revised)

Range is the differentiator: embedded C and LoRa at the bottom, Java and Spring Boot services in the middle, Electron/web and React Native on top, with a backend-first mindset.

- **Hardware:** Intelligent Life Jacket (Embedded C, LoRa), an earlier student project
- **Backend:** services, Maatram Connect
- **Desktop & Web:** Electron app, web
- **Mobile:** React Native app

Backend is visually heaviest. The metaphor appears in the Stack section (diagram), as a small layer marker on each project row, and in the hero trace. Everywhere else is plain editorial layout.

Honesty note: slab weight must not imply equal production depth. The Hardware slab carries a small mono label "earlier project".

Tone: confident editorial layout, calm and fast, one signature animation (hero trace), no spectacle for its own sake.

## 4. Design tokens (revised)

Implement in `src/styles/tokens.css`. Uses `light-dark()` so there is one set of values, no duplicated dark block. Orange is for large text, rules, graphics only; use `--accent-text` for small text.

```css
:root {
  color-scheme: light dark;

  /* surface and ink */
  --paper:   light-dark(#f3f0e8, #0f0e0d);
  --paper-2: light-dark(#ebe7dc, #181716);
  --ink:     light-dark(#121110, #f1ede4);
  --ink-2:   light-dark(#4a4741, #b3ada0);
  --rule:    light-dark(#d6d1c3, #2b2926);

  /* accent */
  --accent:      light-dark(#e8460f, #ff7a45);
  --accent-text: light-dark(#b93a0b, #ff8d5e);

  /* layer slabs (backgrounds) and the text on them */
  --layer-hardware: light-dark(#2b3a42, #22323b);
  --layer-backend:  light-dark(#1c1b1a, #2e2b28);
  --layer-desktop:  light-dark(#3a3631, #272320);
  --layer-mobile:   light-dark(#4a4741, #201e1c);
  --on-layer:       #f1ede4;   /* verify >= 4.5:1 on every slab, both themes */

  /* type */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  --step--1: clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem); /* floor 14px: dates/stack carry real info */
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --step-2: clamp(1.5rem, 1.3rem + 1vw, 2.1rem);
  --step-4: clamp(2.4rem, 1.8rem + 3vw, 4.5rem);
  --step-6: clamp(3.5rem, 2rem + 8vw, 9rem);

  /* space and layout */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 1rem; --space-4: 1.5rem;
  --space-5: 3rem; --space-6: 6rem; --space-7: 10rem;
  --gutter: clamp(1rem, 4vw, 3rem);
  --max: 1280px;
  --measure: 62ch;
  --topbar: 56px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --t-fast: 160ms; --t-base: 280ms; --t-slow: 520ms;
}
:root[data-theme='light'] { color-scheme: light; }
:root[data-theme='dark']  { color-scheme: dark; }

html { scroll-padding-top: calc(var(--topbar) + var(--space-3)); } /* sticky bar must not cover anchor targets */
```

**(v3) Additions to the token file:**

```css
:root {
  /* layer markers (the small squares in tags and rows); >= 3:1 against --paper in both themes */
  --mark-hardware: light-dark(#2b3a42, #7f9eae);
  --mark-backend:  light-dark(#e8460f, #ff7a45);
  --mark-desktop:  light-dark(#6b6358, #a89f90);
  --mark-mobile:   light-dark(#8a8478, #d6cfc0);

  /* visible edge for slabs and other boundaries that must read in dark mode */
  --rule-strong: light-dark(#8c8578, #6a645a);
}

/* Fallback for browsers without light-dark(): without it every token above is invalid,
   and --on-layer text sits on a transparent slab and disappears. Light values only. */
@supports not (color: light-dark(#000, #fff)) {
  :root {
    --paper: #f3f0e8; --paper-2: #ebe7dc; --ink: #121110; --ink-2: #4a4741; --rule: #d6d1c3;
    --accent: #e8460f; --accent-text: #b93a0b;
    --layer-hardware: #2b3a42; --layer-backend: #1c1b1a; --layer-desktop: #3a3631; --layer-mobile: #4a4741;
    --mark-hardware: #2b3a42; --mark-backend: #e8460f; --mark-desktop: #6b6358; --mark-mobile: #8a8478;
    --rule-strong: #8c8578;
  }
}
```

Also set `<meta name="theme-color">` for both schemes (and update it when the toggle changes theme) so the mobile browser bar matches `--paper`.

**(v3) Measured contrast of the v2 tokens (WCAG ratio):**

| Pair | Light | Dark |
| --- | --- | --- |
| `--ink` on `--paper` | 16.6 | 16.5 |
| `--ink-2` on `--paper` / `--paper-2` | 8.1 / 7.5 | 8.6 / 8.0 |
| `--accent` on `--paper` (large text, graphics) | 3.47 | 7.46 |
| `--accent-text` on `--paper` / `--paper-2` | 5.02 / 4.63 | 8.47 / 7.86 |
| `--on-layer` on slabs (min) | 7.9 (Mobile) | 11.3 (Hardware) |
| Slab vs `--paper` | 8.1 to 15.1 | **1.16 to 1.46** |
| `--rule` vs `--paper` | 1.34 | 1.33 |
| `--accent` focus ring on slabs | **2.34 (Mobile), 2.97 (Hardware)** | 5.1 to 6.4 |
| `--mark-*` vs `--paper` (v3) | 3.26 to 10.3 | 6.8 to 12.4 |
| `--rule-strong` vs `--paper` (v3) | 3.21 | 3.29 |

Bold values are the problems v3 fixes: dark slabs use a `--rule-strong` border, markers use `--mark-*`, and the focus ring inside slabs uses `--on-layer` (see Section 11).

Notes:
- Layer identity in tags is a small square filled with the layer's `--mark-*` color **(v3: not the slab color, which is invisible on the dark page)** beside mono text in `--ink-2`, not colored text.
- Slabs get a 1px **`--rule-strong` (v3)** border so they stay visible against the dark page.
- Light accent on paper is about 3.5:1 (large text and graphics only). `--accent-text` is about 5:1. Verify all pairs in QA.

**Typography rules (unchanged):** Display (Instrument Serif) for hero name, section titles, pull-quote, large sizes only. Body (Geist) at 1.6 line-height, max `--measure`. Mono (Geist Mono) for metadata, labels, dates, section numbers, tags. Self-host via `@fontsource`, Latin subset, `font-display: swap`.
**Added:** define metric-adjusted fallback `@font-face` (`size-adjust`, `ascent-override`) for the display and body fonts to prevent layout shift; preload display, body and mono regular weights (mono is above the fold in the hero metadata line); check glyph coverage for `→ · – ↗` and fall back gracefully.
**(v3):** the names in `--font-display/body/mono` must match exactly the `font-family` the installed `@fontsource` package registers (open its CSS and check, for example whether Geist registers as `'Geist'` or `'Geist Sans'`); a mismatch silently falls back to the system font. Cap the font set at about five files: Instrument Serif 400 (add italic only if the pull-quote uses it), Geist 400 and 500, Geist Mono 400. Preload with the hashed URL Astro emits, not a hand-written path.
**Polish (cheap):** `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `font-variant-numeric: tabular-nums` on dates, `::selection` in accent.
**Texture:** paper grain is optional (Backlog): include only if it costs no measurable scroll or paint performance on a mid-range phone. No gradients, glassmorphism or glows.

## 5. Architecture (revised)

Astro (static), TypeScript, plain CSS, vanilla TS for interactions. Icons are inline SVG: mail, arrow-up-right, copy, sun, moon, github, linkedin, menu.

```
/
├─ docs/REDESIGN_SPEC.md
├─ public/ favicon.svg, og-image.png, robots.txt, (resume.pdf if supplied)
├─ src/
│  ├─ content/ profile.ts, stack.ts, experience.ts, projects.ts
│  ├─ components/
│  │  TopBar.astro, MobileMenu.astro (<dialog>), SectionHeader.astro,
│  │  RequestTrace.astro, StackDiagram.astro, LogTimeline.astro,
│  │  ProjectRow.astro, ArchDiagram.astro, ContactBlock.astro
│  ├─ layouts/Base.astro
│  ├─ pages/index.astro
│  ├─ scripts/ theme.ts, nav.ts (scrollspy + menu), work-filter.ts, copy-email.ts, clock.ts
│  └─ styles/ tokens.css, base.css, layout.css, sections/*.css
├─ .github/workflows/deploy.yml   (v3: withastro/action + actions/deploy-pages)
├─ .gitignore         (v3: node_modules/, dist/, .astro/, .DS_Store)
├─ README.md          (v3: what it is, stack, decisions, how to run; engineers read it)
├─ scripts/audit-copy.mjs (v3: Phase 2 copy audit)
├─ astro.config.mjs   (site/base from gate 2)
└─ package.json       (scripts: dev, build, preview, check, todo, audit)
```

**(v3) Astro specifics the agent must follow:**
- The pre-paint theme script in `Base.astro` must be `<script is:inline>`. A normal `<script>` is bundled and deferred, which causes a flash of the wrong theme. The same inline script adds the `js` class to `<html>` (Section 7).
- Files in `public/` are not rewritten for `base`. Reference them as `` `${import.meta.env.BASE_URL}resume.pdf` `` and check the trailing slash of `BASE_URL` with the chosen `trailingSlash` setting.
- Run Lighthouse against `npm run build && npm run preview`, never the dev server.

- Old site is **not** kept in the working tree. Run `git tag legacy-v1` on the current commit before Phase 0 **and push it (`git push origin legacy-v1`) so it is recoverable off this laptop (v3)**; compare with `git worktree add ../legacy legacy-v1`.
- Principles: content is data and components only render it; one small script per interaction, loaded only where needed; native HTML elements (`details`, `dialog`) before custom JS; no framework runtime on the client.
- `astro check` (type check) is part of every phase.

## 6. Content model (verbatim from the current site; unchanged except where marked)

Optional fields are typed `?:` and omitted until you supply them. No `"TODO"` strings in data. `npm run todo` lists every missing optional field so you can see what is outstanding.

**profile.ts**
- name: Sanjay S
- role: Software Engineer at Paperflite
- city: Chennai
- email: sanjayssp1423@gmail.com
- linkedin: https://www.linkedin.com/in/sanjay-s-developer/
- github: https://github.com/Sanjay1423
- degree: BE ECE, St. Peters Institute of Higher Education and Research (Sep 2020 – May 2024)
- positioning line **(revised: per gate 3)**
- about paragraph 1: I joined Paperflite as an intern in March 2023 and moved into a full-time software engineer role in May 2023. Since then I have been building production software across backend services, web, mobile, and desktop.
- about paragraph 2: Working across those surfaces has shaped how I think about the way components interact, how systems change, and how to approach a problem on any part of the stack. I am most interested in backend engineering: designing services that stay maintainable, taking on hard technical problems, and making software more reliable.
- pull-quote: Good engineering is more than writing code.
- about closing: It is understanding the problem, making careful technical decisions, working well with other people, and shipping something that is actually useful.
- principles (derived, one line each): Services that stay maintainable. Understand the problem first. Ship something actually useful.
- contact headline (proposed copy, approve or replace): Have a system that needs to stay up? Let's talk.
- contact supporting line (original): Email is the most direct way to reach me. I am based in Chennai.
- resume: optional path to PDF

**stack.ts** (layers, bottom to top)

| Layer | Items |
| --- | --- |
| Hardware (earlier project) | Embedded C, LoRa, C |
| Backend | Java, Spring, Spring Boot, Microservices, REST APIs, FastAPI, Express, MongoDB, AWS, Python |
| Desktop & Web (revised: React moved here; JavaScript stays) | Electron, React, JavaScript |
| Mobile | React Native, iOS, Android |
| Tooling (quiet footer row, not a layer) | Git |

Each layer has an optional `whatIDid` sentence. If absent, the slab shows items and related-project links only and the slab is not expandable if it has nothing to reveal.

**experience.ts** (rendered as log entries; copy unchanged)
- Software Engineer, Paperflite, Chennai, May 2023 – Present. Build and maintain a production mobile app on iOS and Android. Contribute to the desktop app, including offline content and a hub experience brought over from the web app. Design and maintain backend services and REST APIs. (optional `outcome` per bullet)
- Software Engineer Intern, Paperflite, Chennai, Mar 2023 – May 2023. Built web applications and worked with several teams on design, development, and testing. (Display as intern, then promoted to full-time May 2023.)
- Education branch: BE ECE, St. Peters Institute of Higher Education and Research, Sep 2020 – May 2024.
- Volunteer branch: Maatram Foundation, Chennai, from Jun 2021. Conducted Python training sessions for students. Helped coordinate student logistics for the Maatram Summit.

**projects.ts** (fields: `slug`, `title`, `layer`, `group`, `summary`, `stack[]`, optional `status`, optional `caseStudy {problem, whatIDid, decision, result}`, optional `links[]`)

**(v3)** `slug` doubles as the row's `id` (for example `backend-services`, `life-jacket`) so Stack links and `:target` work. If gate 1 allows, the professional titles can name the product ("Paperflite mobile app") and `links[]` can point to the public App Store / Play Store listings: an anonymous "Mobile application" gives a recruiter nothing to click. Keep the current titles until confirmed.

1. Backend services (backend, professional). Java and Spring Boot services with REST APIs, including moving an analytics feature out of a larger application into its own service. Stack: Java, Spring Boot, REST.
2. Mobile application (mobile, professional). Production React Native app for iOS and Android. Work includes collections, document and video viewing, offline content, and a major React Native upgrade. Stack: React Native, iOS, Android.
3. Desktop application (desktop, professional). Electron app for desktop. Work includes offline content and bringing a hub experience over from the web app. Stack: Electron, JavaScript.
4. Maatram Connect (backend, earlier). A platform for a foundation: students keep their profiles, and stakeholders manage approvals and follow academic progress. Stack: Java, Spring, React Native, AWS.
5. Intelligent Life Jacket (hardware, earlier). Sensors and LoRa send a wearer's health data to a remote monitor. Built with Embedded C for extreme conditions. Stack: Embedded C, LoRa.

Default order is Backend, Mobile, Desktop, Maatram Connect, Life Jacket. This differs from the old order (Mobile, Desktop, Backend) deliberately, to match the backend-first story.

## 7. Global components (revised)

**TopBar.** Sticky, `--topbar` tall, `--paper` at 85 percent with a 1px bottom rule, no blur. Skip link is the first focusable element.
- ≥768px: wordmark (links to top), **inline links** to every section, LinkedIn and GitHub icon links, theme toggle. Active section highlighted via `nav.ts`.
- <768px: wordmark, theme toggle, Menu button opening a `<dialog>` (native focus trap, Esc, focus return). Lists the same links plus LinkedIn and GitHub; closes on link click; `aria-expanded` and label synced.
- Résumé link here or in the hero if a PDF is supplied.
- **(v3) Menu details:** on a link click, call `dialog.close()` first and then let the default hash navigation run (test on iOS Safari: navigating while the modal is open can leave the page unscrolled, and focus return can fight the jump). Where supported, the Menu button may use `commandfor` / `command="show-modal"` so it opens without JS; otherwise `nav.ts` calls `showModal()`.

**(v3) No-JS rule for controls.** The inline head script sets `document.documentElement.classList.add('js')`. Controls that do nothing without JS (Menu button, theme toggle, Work filter, Copy button) are hidden unless `.js` is present (`html:not(.js) [data-needs-js] { display: none; }`). Without JS:
- <768px: the nav renders as a wrapping row of plain links under the wordmark (the same list the dialog uses), so mobile users can still navigate.
- The theme follows the system; the filter is absent and all projects show; the email is still a `mailto:` link.

**Scrollspy (`nav.ts`).** One `IntersectionObserver` for the active section, **plus the end-of-page rule from the old `main.js`** (Contact active when the viewport reaches the bottom). Test with the short Contact section. **(v3)** The active link gets `aria-current="true"` as well as the visual style (the old site used a class only).

**LayerGauge (optional, decorative).** Thin right-edge indicator, desktop only, with ticks per section and a mono current-section label. It is `aria-hidden`, non-focusable (`tabindex=-1`), and purely visual; keyboard and screen-reader users use the TopBar nav. No mobile bottom bar. If time is short, cut it; nothing depends on it.

**Footer.** One line: name, year, LinkedIn, GitHub. No template credit (see Phase 8). The local time lives in Contact only.

## 8. Section specifications (revised)

Every section opens with `SectionHeader`: mono number (`01 / ABOUT`), display title, thin full-width rule. Section numbers are static (no Achievements).

### 8.1 Hero
- **(v3) `min-height`** `calc(100svh - var(--topbar))`, not `height` (use `svh` so mobile browser chrome does not clip). A fixed height cuts off the name, line, metadata and buttons on 320×568, landscape phones and at 200% zoom. Name `Sanjay S` at `--step-6`, let it wrap naturally.
- Positioning line (gate 3) at `--step-2`; mono metadata: `Chennai · Software Engineer @ Paperflite · Since 2023`.
- **RequestTrace:** a thin decorative SVG behind the name showing Client → API → Service → DB → back, labels in mono, `aria-hidden`. **No latency numbers.** Draws once on load (about 1.6s via `stroke-dashoffset`, a one-time exception to the transform/opacity rule), then one subtle idle pulse. Static final frame under reduced motion and without JS.
- Photo: `hero.jpg` only (source is 1063×1450, 256 KB), AVIF + WebP via `astro:assets` with responsive `widths`/`sizes`, explicit dimensions, `fetchpriority=high` (on mobile the photo sits below the headline, so the name text is likely the LCP element there; that is fine), under 120KB, cropped right on desktop and below the headline on mobile. **Default: no duotone** (keep the existing B&W portrait; recognisability helps recruiters). Try the duotone in a branch and keep it only if it looks better in both themes. `portrait-square.jpg` and `portrait-about.jpg` are retired.
- Actions: primary `See the work`; secondary `Résumé` (if PDF) or `Email me` (`mailto:`). No typed rotation.

### 8.2 About (02)
- Pull-quote in display type. Reading column (`--measure`) with the about paragraphs. Mono spec strip: `STARTED Mar 2023 · DEGREE BE ECE`. Three principles, one line each, no icons. No photo.

### 8.3 Stack (03)
- **StackDiagram:** four horizontal slabs (Mobile top, Hardware bottom), each in its layer tone with `--on-layer` text. Backend taller and heavier. Items as plain mono text separated by slashes, not pills.
- **(v3)** The section is `id="stack"` with `<span id="skills"></span>` as its first child (legacy anchor).
- Expansion is **click/tap/Enter only** (no hover expansion), implemented with `<details name="stack">` so one is open at a time and it works without JS. A slab is expandable only if it has a `whatIDid` sentence or related-project links. Project links use anchors to Work rows; the target row is highlighted with `:target` CSS (no JS).
- **(v3)** In browsers without exclusive `<details name>`, several slabs can be open at once; that is an acceptable fallback. Animate opening only with `::details-content` + `interpolate-size: allow-keywords` where supported; otherwise open instantly. The grid-row trick does not apply cleanly to `<details>` content, so do not hand-roll it.
- **(v3)** When a Stack link targets a Work row that the current filter hides (for example Life Jacket while "Professional" is selected), `work-filter.ts` listens for `hashchange` and resets the filter to All before the row is shown. Without JS there is no filter, so nothing to reset.
- Git in a quiet "Tooling" row. No bars, stars, or levels.

### 8.4 Experience (04): log timeline
- **LogTimeline:** vertical line with commit-style entries: date range in mono, title in display type, company line. Order: Software Engineer (current), promoted-from-intern marker (May 2023), Software Engineer Intern (Mar 2023). Education and Volunteer as thinner indented branches in `--ink-2`.
- Decorative commit hashes are optional (Backlog); if used, `aria-hidden`.
- Line draws with scroll where CSS scroll-driven animation is supported; otherwise fully drawn. No JS fallback needed.
- Show existing bullets; render an outcome beneath a bullet only when `outcome` is supplied.

### 8.5 Work (05): full-width rows
- **ProjectRow** columns: number, title (display), layer marker + mono label, stack (mono), group. Hairline separators.
- Rows with a `caseStudy` are `<details>`/`<summary>` and expand inline to Problem / What I did / A decision I'm proud of / Result. **Rows without a case study are static** (no expand control, summary and stack already visible). Hover and focus apply a subtle 8px nudge only; no hover preview panel.
- **Illustration:** one polished `ArchDiagram` for Backend services (monolith with the analytics block moving out into its own service), single-color line art, shown inside the expanded Backend row (or inline in the row if no case study yet). Other projects get no illustration in v1 (Backlog).
- Filter: text-style toggle `All / Professional / Earlier`, keeps `aria-pressed`. Without JS everything shows **and the filter buttons are hidden (v3, Section 7 no-JS rule)**. Resets to All on `hashchange` to a hidden row (8.3). Filtering fades rows over `--t-base` and updates an `aria-live=polite` region (`Showing 3 projects`), not announced on load.

### 8.6 Contact (06)
- Headline in display type (proposed copy in Section 6), supporting original sentence below.
- Oversized email as a normal `mailto:` link. Next to it a `Copy` button (clipboard API with a fallback that selects the text if clipboard access fails); label swaps to `Copied` for 1.8s, announced via `aria-live`. **(v3)** The Copy button is hidden without JS. At 320px the oversized address must wrap (`overflow-wrap: anywhere`) rather than cause horizontal scroll. Résumé link if supplied.
- LinkedIn and GitHub as underlined text links with an arrow-up-right glyph, `rel="noopener noreferrer"`.
- Mono readout `Chennai · local time HH:MM` via `Intl.DateTimeFormat` with `Asia/Kolkata`, updating each minute. Server-render a static `Chennai` so it reads sensibly without JS.
- No form.

## 9. Interaction and motion spec (revised)

| Interaction | Trigger | Spec | Reduced-motion / no-JS / touch fallback |
| --- | --- | --- | --- |
| Hero trace | Load | Stroke draw 1.6s, one idle pulse | Static final frame |
| Section rule | Enters view | scaleX 0 to 1, `--t-slow`, CSS scroll-driven where supported | Fully drawn |
| Reveals | Enters view | 12px fade-up, 280 to 400ms, max 6 items, **only applied under a `.js` class and `@supports (animation-timeline: view())`** | Visible, no transform |
| Link hover | Pointer | Underline grows from left, `--t-fast` | Instant underline |
| Project row | Hover/focus | 8px nudge | None |
| Stack slab / case study | Click, tap, Enter | `<details>`; height change via grid-row trick or instant | Instant |
| Copy email | Click | `Copied` for 1.8s, `aria-live` | Same |
| Theme toggle | Click | Instant swap, saved to `localStorage` (wrapped in try/catch), set before first paint by an `is:inline` script | Same; no JS: button hidden, theme follows system |

**Hard limits:** no parallax, scroll-jacking, WebGL, canvas, custom cursor, or animation that blocks reading. Prefer `transform` and `opacity`; the documented exceptions are the one-time hero stroke draw and disclosure height. Initial hidden states for reveals must never apply when JS is off or motion is reduced.

## 10. Responsive behavior (revised)

| Breakpoint | Behavior |
| --- | --- |
| <640px | Single column; project rows stack; slabs full width; mobile menu dialog |
| 640 to 1023px | Single column, wider gutters; inline nav appears from 768px |
| ≥1024px | 12-column grid, asymmetric placement, optional gauge |
| ≥1600px | Content capped at `--max` |

Test at 320, 360, 390, 768, 1024, 1440, 1920px and landscape phone.

## 11. Accessibility requirements (revised)

- WCAG 2.2 AA; verify every token pair in both themes, including `--on-layer` on each slab and the focus ring.
- Landmarks `header`, `nav`, `main`, `footer`; one `h1`; logical headings.
- Skip link; visible 2px `--accent` focus outline, 3px offset, using `outline` (survives forced-colors mode). **(v3)** Inside slabs the ring is `--on-layer`, because `--accent` measures 2.34:1 on the light Mobile slab and 2.97:1 on the light Hardware slab (below the 3:1 needed for a focus indicator).
- Menu is a native `<dialog>` with `showModal()`: focus trap, Esc, focus returns to trigger.
- No hover-only content; disclosures are native buttons.
- Decorative SVGs `aria-hidden`; the architecture diagram has a text alternative.
- Live regions for filter results and copy confirmation.
- 200% zoom with no loss; touch targets at least 44px; informational text never below 14px.
- `prefers-reduced-motion` honored with one global base rule plus component fallbacks.

## 12. Performance budgets (unchanged targets, additions)

Lighthouse mobile ≥95 in all four categories; LCP <2.0s; CLS <0.05; INP <200ms; client JS <25KB gzipped total; CSS <20KB; fonts <90KB Latin subset; hero image <120KB with explicit size; zero third-party runtime requests. **Added:** run Lighthouse and axe at the end of every phase from Phase 3 on, not only in Phase 8; verify CLS with metric-adjusted fallback fonts.

## 13. SEO and meta (revised)

- Title `Sanjay S · Software Engineer` (short enough not to be cut off in a browser tab; v3.1); keep the current meta description unless improved; canonical from gate 2.
- **(v3)** Canonical, `og:url` and `og:image` are absolute and include the base path (for example `https://sanjay1423.github.io/Portfolio/og-image.png`). Build them from `Astro.site` + `BASE_URL`, not by hand. `Person` JSON-LD includes `sameAs` with the LinkedIn and GitHub URLs.
- Open Graph and Twitter tags with `og-image.png` (1200 by 630) and image alt text.
- `Person` JSON-LD. `robots.txt`. `lang=en`. Existing `favicon.svg`.
- **Dropped:** `sitemap.xml` (single page; the sitemap integration is an extra dependency).

## 14. Implementation phases (revised order)

From Phase 4 onward every phase leaves a working site. Do not publish before Phase 6 (Experience present).

**(v3) Branch and deploy strategy.** All redesign work happens on a branch (`ui-v2` already exists at the same commit as `main`; use it or create `redesign`). `main` keeps serving the old site from the branch until the merge. At merge time (after Phase 6, with gate 7 satisfied): merge to `main`, then switch Settings → Pages → Source to "GitHub Actions" and confirm the workflow run deploys to the gate 2 URL. GitHub Pages has no preview deploys, so review locally with `npm run preview`.

**Phase 0: Setup and safety.** `git tag legacy-v1` **and `git push origin legacy-v1` (v3)**. Scaffold Astro + TypeScript, static output, `site`/`base` from gate 2, `@fontsource` packages, `astro check`, folder structure with empty files. **(v3)** Add `.gitignore`, `.github/workflows/deploy.yml` (official `withastro/action` build + `actions/deploy-pages`, triggered on push to `main` and manually), and a stub `README.md`. *Done when* `dev`, `build`, `check`, `preview` pass, `preview` serves the site under `/Portfolio/` (or the gate 2 base), and the old site is recoverable from the pushed tag.

**Phase 1: Foundations.** `tokens.css`, `base.css` (reset, typography, focus ring, reduced-motion rule, `scroll-padding-top`), `layout.css`, `Base.astro` (meta, pre-paint theme script, skip link), fallback font metrics. *Done when* a test page shows type scale, swatches and focus ring in both themes with no layout shift on theme change and passes contrast checks.

**Phase 2: Content layer.** `src/content/*` with exact copy and types; `npm run todo`. *Done when* an audit (script or diff against the `legacy-v1` index.html) shows every sentence is present except those listed in Section 2.2.
**(v3) Audit method:** `scripts/audit-copy.mjs` reads `git show legacy-v1:index.html`, extracts visible text nodes and `alt`/`aria-label` values, normalizes whitespace, removes the Section 2.2 strings, and checks each remaining string exists in `src/content/*` (Phase 2) and later in `dist/index.html` (Phase 8). It prints missing strings and exits non-zero. Run it as `npm run audit`.

**Phase 3: Chrome.** TopBar (inline nav, mobile `<dialog>` menu, social icons, theme toggle), scrollspy with end-of-page rule, footer. Gauge only if time allows. *Done when* keyboard-only navigation reaches everything, the active link is correct while scrolling and at the page bottom, and anchors land clear of the sticky bar. **(v3)** Also: with JS disabled at 360px, the nav links are visible and work and no dead buttons are shown.

**Phase 4: Hero (static), About, Contact.** Hero without trace animation, image pipeline, About, Contact with mailto and copy button, local time. *Done when* the hero LCP is under 2.0s, copy confirmation is announced, and no JS still gives a complete page.

**Phase 5: Work.** ProjectRow, `details`-based case studies (only where data exists), filter with live region, `ArchDiagram`. *Done when* filtering works by keyboard and screen reader and no content is hover-only.

**Phase 6: Experience and Stack.** LogTimeline, StackDiagram with `<details name>` and `:target` highlighting. *Done when* slabs and timeline work by keyboard and touch and read well at 320px and in both themes.

**Phase 7: Enhancements.** RequestTrace animation, rule draws, scroll reveals, timeline line draw (all behind reduced-motion and `@supports`), optional gauge. *Done when* reduced motion shows a static frame everywhere and nothing is hidden with JS off.

**Phase 8: Hardening and launch.** axe and Lighthouse at every breakpoint, OG image, JSON-LD, image compression, confirm no Bootstrap/AOS/Typed.js/template markup in `src/` or `dist/`, then remove the footer credit. **(v3)** Also: run `npm run audit` against `dist/`; test on a real iPhone (Safari) and an Android phone (Chrome) for the menu dialog, `svh`, `<details>` and copy; finish the README (what the site is, stack, the key decisions from this spec, Lighthouse scores, how to run). *Done when* every Section 12 budget and Section 15 item passes.

**(v3) Merge and deploy.** Follow the branch and deploy strategy above. *Done when* the gate 2 URL serves the new site, the favicon, OG image and résumé resolve under the base path, and `legacy-v1` is still on the remote.

## 15. QA checklist (revised)

- [ ] Every sentence from the original is present, except Section 2.2 items.
- [ ] Preservation checklist (Section 2.1) fully ticked.
- [ ] Both themes pass contrast, including slabs, tags and focus rings.
- [ ] Keyboard-only run: skip link, nav, menu dialog, slabs, case studies, filter, copy.
- [ ] Screen-reader run (VoiceOver or NVDA) on hero, stack, work.
- [ ] Reduced motion on: nothing moves, nothing hidden.
- [ ] JavaScript off: all content readable, all links work, filter shows all projects.
- [ ] 200% zoom and 320/360px: no horizontal scroll or clipped text.
- [ ] Anchor jumps (nav, stack links, `#skills` legacy) land below the TopBar.
- [ ] Scrollspy shows Contact at page bottom.
- [ ] Lighthouse mobile ≥95 in all four categories; no console errors; no layout shift on font load.
- [ ] External links use `rel="noopener noreferrer"`; mailto correct.
- [ ] OG preview renders when shared.
- [ ] Deployed URL and base path correct (gate 2).
- [ ] **(v3)** JavaScript off: no visible control that does nothing (menu, theme, filter, copy); mobile nav still reachable.
- [ ] **(v3)** Dark mode: slab edges and layer marker squares clearly visible; focus ring visible on every slab in both themes.
- [ ] **(v3)** A browser without `light-dark()` (or with the `@supports` block forced on) shows a readable light theme, including slab text.
- [ ] **(v3)** Stack → Work link with "Professional" selected resets the filter and shows the target row.
- [ ] **(v3)** `npm run audit` passes against `dist/`.
- [ ] **(v3)** Hero fits without clipping at 320×568 and on a landscape phone.

## 16. Prompts to use in Antigravity (unchanged in spirit)

**Kickoff (planning mode):**
> Read `docs/REDESIGN_SPEC.md` fully. Do not write code yet. Produce a plan for Phase 0 and Phase 1 only, listing every file you will create or change, the dependencies you will add (build vs client), and how you will verify each acceptance criterion. Include the deploy workflow, the `base` path handling and the no-JS class setup. Flag anything ambiguous.

**Per phase:**
> Implement Phase N from `docs/REDESIGN_SPEC.md`. Follow the rules in Section 0. Use only the copy in Section 6. When done, run `npm run check && npm run build`, verify each acceptance criterion, and report what you checked. Do not start Phase N+1 and do not edit the spec.

**Review pass:**
> Audit the current build against Sections 2.1, 9, 11 and 12 of `docs/REDESIGN_SPEC.md`. List every violation with file and line. Do not fix anything yet.

**Visual check:**
> Open the site at 320, 360, 768 and 1440px in both themes. Screenshot each section and compare with Section 8. List mismatches.

## 17. Content needed from you (revised order)

1. Gate answers (Section 0.1), especially NDA and hosting.
2. Résumé PDF (strongly recommended for recruiters).
3. A short case study for Backend services (the analytics extraction), then Mobile (the React Native upgrade).
4. One outcome or real number per experience bullet.
5. One sentence per stack layer.
6. Project links where public (Maatram Connect, Life Jacket repos or demos).
7. Optional: a one-line "Now" (what you are currently working on), if you are comfortable sharing it.

**(v3) Launch minimum (gate 7):** items 2, 3 (Backend only) and one outcome from item 4.

**(v3) Case-study template** (80 to 150 words total; write it yourself, the agent only places it):
- **Problem:** what was wrong or missing, in one or two sentences, in terms a non-colleague understands.
- **What I did:** your part specifically ("I designed…", "I moved…"), not the team's.
- **A decision I'm proud of:** one trade-off you made and why (for example, how you split the analytics data or kept the old API working during the move).
- **Result:** what changed. A real number if you have one and are allowed to share it; otherwise a concrete qualitative result ("the main app no longer ships analytics changes").

NDA-safe habits: no customer names, no internal hostnames or dashboards, no revenue or usage figures unless your employer has published them; describe scale in relative terms ("several services", "tens of thousands of documents") only if you are sure that is allowed.

**(v3) Résumé PDF:** text-based (not a scanned image) so it can be searched and parsed, a stable filename such as `Sanjay-S-Resume.pdf` so links never break, and the same facts and dates as the site.

## 18. Backlog: deliberately out of scope for v1 (new)

Add only after launch and only if still wanted.

- Command palette (`⌘K`) built on native `<dialog>`, and the `sudo hire sanjay` easter egg
- Custom cursor (not recommended: accessibility and annoyance cost)
- Achievements section (add when you have at least three real entries)
- Illustrations for the other four projects
- Decorative commit hashes on the timeline
- Paper-grain texture, duotone hero treatment
- Print stylesheet, 404 page, privacy-friendly analytics

## 19. Risks and mitigations (revised)

| Risk | Mitigation |
| --- | --- |
| Stack metaphor feels gimmicky | Confined to one section, project markers and the hero trace; Hardware labelled "earlier project" |
| Orange fails contrast | Large text and graphics only; `--accent-text` for small text; verified in QA |
| Agent invents content | Section 0 rules, typed optional fields, Phase 2 audit |
| Hollow UI from missing content | Components designed for absence; expand controls only where content exists |
| Heavy dependencies | Client-side ban; budgets checked every phase |
| Breaking the live URL | Gate 2; `site`/`base`; legacy anchors preserved |
| Employer content exposure | Gate 1 before any case study is written |
| Scope creep | Backlog (Section 18) is closed until Phase 8 passes |
| Template licensing | Credit removed only after Phase 8 confirms no template code remains |
| **(v3)** Live site breaks during migration | Work on a branch; `main` serves the old site until the merge; switch Pages to GitHub Actions only at merge |
| **(v3)** Wrong base path (`/portfolio` vs `/Portfolio`) | `base` from gate 2; all `public/` URLs via `BASE_URL`; verified in `preview` and after deploy |
| **(v3)** Older browsers without `light-dark()` | `@supports not` fallback block with light values |
| **(v3)** Agent assumes browser support | Section 0 rule: check MDN, keep the fallback |
| **(v3)** Redesign launches as a restyle with no new evidence | Gate 7 launch-minimum content |

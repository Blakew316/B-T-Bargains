# B&T Bargains — Website

A professional, editorial website for **B&T Bargains** in Loudon, Tennessee — a family‑owned
store offering quality **overstock, closeout and store‑return** merchandise at near half the
big‑box price.

The design is intentionally **clean, rustic and understated**: a muted agricultural palette,
serif/sans editorial typography, generous whitespace, and **restrained motion**. The one
3D moment is a **cinematic, realistic wheat‑field hero** rendered in three.js — thousands of
wind‑swept stalks at golden hour with atmospheric haze, a low sun and drifting pollen — graded
to read like footage rather than an illustration.

## Sections

| Section | Notes |
|---|---|
| **Hero** | three.js wheat field (wind‑swayed instanced stalks, haze, sun, pollen) + cinematic grade/vignette/grain. Graded CSS golden‑hour sky as the fallback. |
| **Value strip** | Three quick value props with thin‑line icons. |
| **Featured Deals** | Catalog‑style cards with photo slots, savings tag and before/after pricing. |
| **Departments** | Six departments in a hairline grid with thin‑line icons. |
| **How to Shop** | In‑store / reserve for pickup / local delivery / nationwide shipping. |
| **About** | Brand story beside an editorial line‑art barn illustration. |
| **Visit** | Address, hours, phone and socials. |

## Tech

- **Plain HTML + CSS + JavaScript** — no build step, no install.
- **[three.js](https://threejs.org/) r161** via an ES‑module **import map** from a CDN (hero only).
- Fonts: **Fraunces** (display serif) + **Inter** (body), via Google Fonts.
- Thin‑line iconography is an inline SVG `<symbol>` sprite — no icon dependency.

### Accessible & robust
- If WebGL is unavailable, the hero shows a graded golden‑hour CSS sky (no broken state).
- Honors `prefers-reduced-motion` (renders a single still frame, no wind/drift).
- The 3D scene pauses off‑screen / when the tab is hidden, caps device pixel ratio, and
  reduces stalk density on small screens.
- Semantic landmarks, `<noscript>` keeps content visible, mobile hamburger nav.

## Add your photos

The deal cards and (optionally) other sections use **photo slots** with a tasteful textured
fallback that reads as intentional until you add real images. Drop store/product photos into
`assets/` and replace a slot's background, e.g.:

```html
<!-- in a .deal-photo -->
<img src="assets/garden-tool-set.jpg" alt="Stainless garden tool set" />
```

Using the store's **own** photos of real products and the storefront is the most professional
result — far better than generic stock imagery.

## Run locally

ES modules must be served over `http://` (not opened as a `file://` path):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or: npx serve .
```

## Deploy

Static site — host the repo root anywhere:
- **GitHub Pages:** Settings → Pages → deploy from `main` (root).
- **Netlify / Vercel / Cloudflare Pages:** no build command; publish directory = repo root.

## Customize

- **Colors & type:** CSS custom properties at the top of [`css/style.css`](css/style.css) (`:root`).
- **Copy, deals, departments:** edit the markup in [`index.html`](index.html).
- **The wheat field:** tune density, colors, wind and camera in [`js/hero3d.js`](js/hero3d.js).

> **Details:** Address `1038 Mulberry St, Loudon, TN 37774` and phone `(865) 390-1202` are
> from the store's public listings. The **hours in “Visit the Store” are sample placeholders** —
> update them in `index.html` to match the real schedule.

## Structure

```
.
├── index.html          # content + icon sprite
├── css/style.css       # editorial theme
├── js/hero3d.js        # three.js wheat-field hero
├── js/main.js          # nav, scroll-reveal
└── assets/             # favicon + social image (SVG)
```

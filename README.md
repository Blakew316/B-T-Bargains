# B&T Bargains — Website

A **static, rustic, professional** website for **B&T Bargains** in Loudon, Tennessee — a
family‑owned store offering quality **overstock, closeout and store‑return** merchandise at
near half the big‑box price.

The design is calm and real: a warm heritage palette with a subtle paper texture, a graded
golden‑hour hero, serif/sans editorial typography and clean thin‑line icons. **There are no
3D scenes and no animations** — nothing moves on the page.

## Sections

- **Hero** — graded golden‑hour backdrop with the headline and calls to action.
- **Value strip** — three reasons to shop (near ½ prices, fresh stock weekly, pickup & delivery).
- **Featured Deals** — typographic catalog cards with before/after pricing and a savings tag.
- **Departments** — six departments in a tidy hairline grid with thin‑line icons.
- **How to Shop** — in‑store / reserve for pickup / local delivery / nationwide shipping.
- **About** — the store's story beside a short “facts” card.
- **Visit** — address, hours, phone and socials.

## Tech

- **Plain HTML + CSS + a few lines of JS.** No build step, no framework, no dependencies.
- The only JavaScript runs the mobile menu and the footer year.
- Fonts: **Fraunces** (display serif) + **Inter** (body) via Google Fonts.
- Icons are an inline SVG `<symbol>` sprite — no icon library.
- Semantic landmarks, mobile hamburger nav, accessible labels.

## Products

The **Shop the Store** grid lists real B&T Bargains products (Tide, Gain, Dawn, Downy,
Snuggle, All Free & Clear, scent beads, Amish bar soap, Stout cleaner, …), and each card
links to that item's live page on `bntbargains.com`.

### Add the product photos

Every card already points at a photo path and shows a clean name label until the file
exists — so **just drop the images in and they appear** (no code change, never a broken
icon). Add JP/PNG files here, matching the `src` in `index.html`:

```
assets/products/tide-1gal.jpg
assets/products/gain-1gal.jpg
assets/products/gain-5gal.jpg
assets/products/all-free-1gal.jpg
assets/products/downy-1gal.jpg
assets/products/snuggle-1gal.jpg
assets/products/pink-beads.jpg
assets/products/rainbow-beads.jpg
assets/products/dawn-1gal.jpg
assets/products/stout-1gal.jpg
assets/products/all-free-5gal.jpg
assets/products/amish-soap.jpg
```

Square images (roughly 800×800) look best. For the **hero**, drop a storefront photo in
`assets/` and set it as the `background-image` of `.hero-photo` in the CSS.

> **Why aren't the photos already here?** This site was built in a sandbox that blocks every
> outside image host, so the product photos couldn't be downloaded automatically. The grid is
> wired so adding them is a one‑step drop‑in.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or: npx serve .
```

(It also works opened directly as a file, since there are no module imports.)

## Deploy

Static site — host the repo root anywhere:
- **GitHub Pages:** Settings → Pages → deploy from `main` (root).
- **Netlify / Vercel / Cloudflare Pages:** no build command; publish directory = repo root.

## Customize

- **Colors & type:** CSS custom properties at the top of [`css/style.css`](css/style.css) (`:root`).
- **Copy, deals, departments, hours:** edit [`index.html`](index.html).

> **Details:** Address `1038 Mulberry St, Loudon, TN 37774` and phone `(865) 390-1202` are from
> the store's public listings. The **hours in “Visit the Store” are sample placeholders** —
> update them in `index.html` to match the real schedule.

## Structure

```
.
├── index.html       # all content + icon sprite
├── css/style.css    # rustic static theme
├── js/main.js       # mobile nav + year (no animation)
└── assets/          # favicon + social image (SVG)
```

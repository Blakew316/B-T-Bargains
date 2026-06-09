# B&T Bargains — The Bargain Barn 🌾

A simple, rustic, agriculture‑themed website for **B&T Bargains** in Loudon, Tennessee —
a family‑run bargain store offering overstock, closeouts and store returns at near half the
big‑box price.

The site is intentionally **minimal and rustic**, with **3D animations throughout** that keep
the farm/ag theme: a low‑poly floating farm island in the hero (spinning windmill, barn, silo,
drifting clouds, a warm sun and orbiting produce), CSS‑3D spinning aisle icons, a rotating
produce crate, floating "how to shop" badges and reveal‑on‑scroll sections.

## ✨ What's inside

| Section | What it does |
|---|---|
| **Hero** | three.js low‑poly floating farm island with windmill, barn, silo, clouds, sun & orbiting produce. Mouse‑parallax camera. |
| **Rope marquee** | Scrolling "new deals daily / overstock / ½ big‑box prices" ticker. |
| **Featured Bargains** | Deal cards with discount badges, before/after prices and a 3D tilt on hover. |
| **Aisles** | Department cards (Feed & Seed, Tools, Farm & Garden, Pantry, Home & Kitchen, Closeout Corner) with continuously spinning 3D icons. |
| **How to Shop** | In‑store / pick‑up / local delivery / nationwide shipping, with floating 3D number badges. |
| **Our Story** | Brand story beside a CSS‑3D rotating produce crate. |
| **Where to Find Us** | Address, hours, phone, directions and social links. |

## 🧱 Tech

- **Plain HTML + CSS + JavaScript** — no build step, no dependencies to install.
- **[three.js](https://threejs.org/) r161** loaded via an ES‑module **import map** from a CDN
  (only used by the hero scene).
- Google Fonts: **Rye** (rustic wordmark), **Bitter** (slab‑serif headings), **Work Sans** (body).

### Graceful & accessible
- If WebGL is unavailable, the hero falls back to a static SVG barn illustration.
- Honors `prefers-reduced-motion` (animations stop / render a single still frame).
- The 3D scene pauses when off‑screen or the tab is hidden, caps device pixel ratio, and
  disables shadows on small screens to stay light.
- Mobile hamburger nav, semantic landmarks, alt/aria labels.

## ▶️ Run it locally

ES‑module imports need to be served over `http://` (not opened as a `file://` path), so use any
static server:

```bash
# Python (built in)
python3 -m http.server 8000

# …or Node
npx serve .
```

Then open <http://localhost:8000>.

## 🚀 Deploy

It's a static site — host the repo root anywhere:

- **GitHub Pages:** Settings → Pages → deploy from `main` (root). `index.html` is at the root.
- **Netlify / Vercel / Cloudflare Pages:** no build command, publish directory = repo root.

## 🎨 Make it yours

Everything lives in plain files so it's easy to edit:

- **Colors & fonts:** CSS custom properties at the top of [`css/style.css`](css/style.css) (`:root`).
- **Copy, deals & aisles:** edit the markup in [`index.html`](index.html).
- **Real photos:** the visuals are hand‑built SVG/3D so the site stays fast and license‑free.
  To use real store photos, drop them in `assets/` and swap the SVG art in the deal/aisle cards.
- **The 3D farm:** tweak objects, colors and animation speeds in
  [`js/hero3d.js`](js/hero3d.js).

> **Note on details:** The address `1038 Mulberry St, Loudon, TN 37774` and phone
> `(865) 390-1202` come from the store's public listings. The **store hours in the “Find Us”
> section are sample placeholders** — update them in `index.html` to match the real schedule.

## 📁 Structure

```
.
├── index.html          # all page content / sections
├── css/style.css       # rustic minimal theme + CSS‑3D animations
├── js/hero3d.js        # three.js floating farm hero scene
├── js/main.js          # nav, scroll‑reveal, card tilt
└── assets/             # favicon + social image (SVG)
```

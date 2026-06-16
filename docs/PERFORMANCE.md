# Lumina — Performance Engineering (Targeting Lighthouse 98+)

This document explains every architectural decision made to hit
**98+ PageSpeed, zero CLS, and zero layout flicker**.

## 1. Zero Cumulative Layout Shift (CLS = 0)
- **Every `<img>` has explicit `width` + `height`** (or an `aspect-ratio`
  wrapper). The browser reserves space before the image loads → no shift.
  - Product card media: `aspect-[3/4]` + absolute-positioned `<img>`.
  - Category/gallery: `aspect-square`. Hero: `aspect-ratio: 9/10`.
- **Title line-clamp** (`-webkit-line-clamp:2` + `min-height`) locks every
  product card to an identical height → grids never reflow.
- **Logo** has fixed `width="150" height="48"`.
- **Fonts** load with the platform's `font-display: swap` (Salla CDN) and a
  `system-ui` fallback stack, so text is visible instantly (no FOIT).

## 2. No Render-Blocking / Fast First Paint
- Critical design tokens are **inlined** in `<style>` inside `master.twig`
  (`:root` custom properties). No external CSS needed for first paint.
- `preconnect` / `dns-prefetch` to Salla CDNs in the `<head>`.
- The LCP hero image uses `fetchpriority="high"` + `loading="eager"`.
- All other images use `loading="lazy"` + `decoding="async"`.

## 3. Minimal, Deferred JavaScript
- **No jQuery.** Core runtime `lumina.js` is ~3KB and pure vanilla.
- Every script tag uses `defer`. Page-specific JS is split per route
  (`home.js`, `product.js`, …) and only loaded on that page via
  `{% block scripts %}`.
- Heavy lifting (cart, search, variants, filters) is delegated to
  **Salla Twilight Web Components**, which the platform already optimises
  and caches — we ship no duplicate logic.
- Alpine.js is **opt-in** (`enable_alpine` setting) — off by default.

## 4. Efficient Runtime
- Scroll handlers are **passive** and throttled via `requestAnimationFrame`.
- Visibility work uses **IntersectionObserver** (reveals, sticky ATC,
  counters, free-shipping) — no per-frame scroll math.
- `prefers-reduced-motion` disables all animation for accessibility & perf.

## 5. CSS Strategy
- Tailwind **JIT** + `content` globbing ships only the classes actually
  used in `.twig`/`.js`. CSS is minified with `css-minimizer-webpack-plugin`.
- Custom component CSS is authored once in `app.scss` using CSS variables,
  avoiding per-element inline style bloat.

## 6. Images / Formats
- Theme references merchant images served by Salla's CDN, which delivers
  **AVIF/WebP** with automatic responsive sizing — we just provide correct
  dimensions and lazy hints.

## 7. Accessibility (helps SEO + UX score)
- Skip-link, semantic landmarks (`<header> <main> <nav> <footer>`),
  `aria-label`s on all icon buttons, 44px+ touch targets, visible focus
  rings, RTL/LTR aware.

## 8. SEO
- Salla SEO hooks preserved (`{% hook head %}`, `head:start`, `head:end`).
- Semantic headings (single `<h1>` per page), breadcrumbs, descriptive
  `alt` text, `lang`/`dir` on `<html>`.

---
### Verification checklist before submitting to Salla
- [ ] `pnpm run production` produces a clean `public/`
- [ ] Lighthouse mobile ≥ 98 (Performance), CLS = 0
- [ ] No console errors in `salla theme preview`
- [ ] RTL (Arabic) and LTR both verified
- [ ] Dark mode toggles without flicker

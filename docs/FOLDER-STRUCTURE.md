# Lumina — Folder Structure & Architecture

```
lumina-theme/
├── twilight.json                 # Theme manifest: settings + custom components (merchant editor)
├── package.json                  # Dependencies + build scripts
├── tailwind.config.js            # Tailwind JIT + design tokens bound to CSS vars
├── postcss.config.js             # PostCSS (nesting, preset-env)
├── webpack.config.js             # Bundles SCSS->app.css and JS entries
├── README.md
├── docs/
│   ├── UPLOAD-GUIDE-AR.md        # خطوات الرفع والمعاينة في سلة (عربي)
│   ├── PERFORMANCE.md            # Lighthouse 98+ / zero-CLS engineering
│   └── FOLDER-STRUCTURE.md       # this file
└── src/
    ├── locales/
    │   ├── ar.json               # Arabic strings
    │   └── en.json               # English strings
    ├── assets/
    │   ├── images/               # placeholder + empty-state images (copied to public/)
    │   ├── js/
    │   │   ├── lumina.js         # CORE runtime: sticky header, bottom-nav, reveals,
    │   │   │                     #   sticky ATC, free-shipping bar, filters, counters, dark mode
    │   │   ├── home.js           # home page (kept minimal for perf)
    │   │   ├── product.js        # PDP optional gallery hooks
    │   │   ├── products.js       # listing/category
    │   │   ├── cart.js           # cart page
    │   │   └── partials/
    │   │       ├── product-card.js       # Salla product-card web component glue
    │   │       └── add-product-toast.js  # add-to-cart toast
    │   └── styles/
    │       └── app.scss          # ALL styling (ITCSS-layered, token-driven) -> app.css
    └── views/
        ├── layouts/
        │   └── master.twig       # HTML shell: head, hooks, header/footer, tokens, JS
        ├── pages/
        │   ├── index.twig        # HOME — renders {% component home %} (drag-drop sections)
        │   ├── cart.twig         # full cart (drawer is primary UX)
        │   ├── thank-you.twig
        │   ├── page-single.twig  # static CMS page
        │   ├── landing-page.twig # Salla landing builder blocks (full-bleed)
        │   ├── loyalty.twig      # rewards / points
        │   ├── product/
        │   │   ├── single.twig   # PDP: sticky buybox, gallery, variants, urgency, FBT
        │   │   └── index.twig    # category/listing: filters + 4/3/2-col grid
        │   ├── blog/
        │   │   ├── index.twig    # blog/journal listing
        │   │   └── single.twig   # article + share + comments
        │   ├── brands/
        │   │   ├── index.twig    # all brands grid
        │   │   └── single.twig   # brand hero + its products
        │   └── customer/
        │       ├── profile.twig          # account details
        │       ├── wishlist.twig         # saved products
        │       ├── notifications.twig    # alerts feed
        │       └── orders/
        │           ├── index.twig        # orders list
        │           └── single.twig       # order timeline + invoice
        ├── components/
        │   ├── header/header.twig    # sticky glass header + mega menu + instant search
        │   ├── footer/footer.twig    # trust strip + newsletter + dynamic menus
        │   └── home/                 # CUSTOM home components (declared in twilight.json)
        │       ├── hero.twig
        │       ├── featured-categories.twig
        │       ├── products-slider.twig
        │       ├── flash-offers.twig
        │       ├── brand-showcase.twig
        │       ├── stats.twig
        │       ├── testimonials.twig
        │       ├── gallery.twig
        │       ├── split-banner.twig      # dual promo banner
        │       ├── usp-strip.twig         # store-features / USP row
        │       ├── video.twig             # immersive video (lazy lite-youtube)
        │       └── countdown-cta.twig     # full-width countdown CTA band
        └── partials/
            ├── section-head.twig          # reusable section title + view-all
            ├── mobile-bottom-nav.twig     # native-style bottom nav
            ├── mini-cart.twig             # custom AJAX mini-cart drawer (no reload)
            ├── account-nav.twig           # customer account sidebar (shared)
            └── product/card.twig          # premium product card (zero-CLS contract)
```

## Key architectural decisions
1. **Tokens as single source of truth.** `master.twig :root` injects CSS custom
   properties from `theme.settings`. Components consume them, so changing a
   merchant setting re-skins everything with no rebuild and no layout shift.
2. **Salla Web Components for data.** Cart, search, variants, filters, pricing,
   ratings, comments, installments use `<salla-*>` components — we never
   duplicate platform logic, keeping the bundle tiny and future-proof.
3. **Custom home components are drag-and-drop.** Declared under `components` in
   `twilight.json`; merchants reorder/show/hide them in the Salla theme editor.
4. **Route-split JS.** Each page loads only its own bundle via `{% block scripts %}`.
5. **Mobile-first CSS.** Base styles target small screens; `@media (min-width)`
   progressively enhances to tablet/desktop.
```

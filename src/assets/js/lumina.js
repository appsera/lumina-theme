/* =====================================================================
   LUMINA — Core theme runtime (compiled to lumina.js)
   ---------------------------------------------------------------------
   Vanilla JS only. No jQuery. ~3KB minified. Everything is:
     • passive scroll listeners (no jank)
     • IntersectionObserver (no scroll math per element)
     • guarded by feature flags from window.Lumina (merchant settings)
   ===================================================================== */
(function () {
  'use strict';
  var cfg = window.Lumina || {};
  var doc = document;

  /* ---------------- 1. Sticky + condensing header ---------------- */
  (function stickyHeader() {
    var header = doc.getElementById('lumina-header');
    if (!header || header.dataset.sticky !== '1') return;
    var lastY = 0, ticking = false;
    function onScroll() {
      var y = window.scrollY || 0;
      header.classList.toggle('is-stuck', y > 8);
      header.classList.toggle('is-condensed', y > 160);
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  })();

  /* ---------------- 2. Auto-hide mobile bottom nav -------------- */
  (function bottomNav() {
    if (!cfg.bottomNav) return;
    var nav = doc.querySelector('.lumina-bottom-nav');
    if (!nav) return;
    var lastY = window.scrollY, ticking = false;
    function update() {
      var y = window.scrollY;
      // hide when scrolling down past 120px, show when scrolling up
      nav.classList.toggle('is-hidden', y > lastY && y > 120);
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  })();

  /* ---------------- 3. Scroll reveal animations ---------------- */
  (function reveal() {
    if (!cfg.animations || !('IntersectionObserver' in window)) {
      doc.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    doc.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- 4. Sticky mobile add-to-cart bar ----------- */
  (function stickyAtc() {
    if (!cfg.stickyAtc) return;
    var bar = doc.getElementById('lumina-sticky-atc');
    var anchor = doc.querySelector('.lumina-pdp-actions');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      // show the bar only once the main ATC button has scrolled out of view
      bar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(anchor);
  })();

  /* ---------------- 5. Free shipping progress ----------------- */
  (function freeShipping() {
    // Supports multiple bars (cart page + mini-cart drawer)
    var boxes = [].slice.call(doc.querySelectorAll('.lumina-free-ship'));
    if (!boxes.length || !window.salla) return;
    function renderAll(total) {
      boxes.forEach(function (box) {
        var threshold = parseFloat(box.dataset.threshold || cfg.freeShippingTarget || 0);
        if (!threshold) return;
        var pct = Math.min(100, (total / threshold) * 100);
        var bar = box.querySelector('.lumina-progress-bar');
        var msg = box.querySelector('[data-free-ship-msg]');
        if (bar) bar.style.width = pct + '%';
        if (msg) {
          var remaining = Math.max(0, threshold - total);
          msg.textContent = remaining <= 0
            ? (window.salla.lang ? salla.lang.get('cart.free_shipping_unlocked') : '🎉 Free shipping unlocked!')
            : ('Add ' + remaining.toFixed(2) + ' more for free shipping');
        }
      });
    }
    salla.cart.event.onUpdated(function (summary) {
      if (summary && typeof summary.total !== 'undefined') renderAll(parseFloat(summary.total));
    });
  })();

  /* ---------------- 5b. Custom mini-cart drawer --------------- */
  (function miniCart() {
    var drawer = doc.getElementById('lumina-mini-cart');
    if (!drawer) return;
    var open = false;

    function setOpen(state) {
      open = state;
      drawer.classList.toggle('is-open', state);
      drawer.setAttribute('aria-hidden', state ? 'false' : 'true');
      doc.body.style.overflow = state ? 'hidden' : '';
      if (state) {
        var btn = drawer.querySelector('[data-cart-close]');
        if (btn) btn.focus();
      }
    }

    // Open via Salla event (header & bottom-nav dispatch cart::open)
    if (window.salla && salla.event) {
      salla.event.on('cart::open', function () { setOpen(true); });
      // Auto-open after add-to-cart for instant feedback (configurable)
      salla.cart.event.onItemAdded(function () { setOpen(true); });
      // Toggle empty state + hide footer/cross-sell when cart is empty
      salla.cart.event.onUpdated(function (summary) {
        var count = summary && (summary.count || summary.items_count || 0);
        var empty = drawer.querySelector('[data-cart-empty]');
        var foot = drawer.querySelector('[data-cart-foot]');
        var cross = drawer.querySelector('[data-cart-crosssell]');
        var isEmpty = !count;
        if (empty) empty.hidden = !isEmpty;
        if (foot) foot.style.display = isEmpty ? 'none' : '';
        if (cross) cross.style.display = isEmpty ? 'none' : '';
      });
    }

    // Close interactions
    drawer.querySelectorAll('[data-cart-close]').forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
  })();

  /* ---------------- 6. Mobile filters drawer ------------------ */
  (function filters() {
    var panel = doc.getElementById('lumina-filters');
    if (!panel) return;
    doc.querySelectorAll('[data-open-filters]').forEach(function (b) {
      b.addEventListener('click', function () { panel.classList.add('is-open'); doc.body.style.overflow = 'hidden'; });
    });
    doc.querySelectorAll('[data-close-filters]').forEach(function (b) {
      b.addEventListener('click', function () { panel.classList.remove('is-open'); doc.body.style.overflow = ''; });
    });
  })();

  /* ---------------- 7. Animated stat counters ----------------- */
  (function counters() {
    if (!cfg.animations || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat((el.dataset.count || '0').replace(/[^\d.]/g, '')) || 0;
        var suffix = (el.dataset.count || '').replace(/[\d.,\s]/g, '');
        var start = 0, t0 = performance.now(), dur = 1400;
        (function step(now) {
          var p = Math.min(1, (now - t0) / dur);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    doc.querySelectorAll('.lumina-stat-num[data-count]').forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- 8. Dark-mode toggle hook ------------------ */
  window.luminaToggleDark = function () {
    var isDark = doc.documentElement.classList.toggle('dark');
    try { localStorage.setItem('lumina-theme', isDark ? 'dark' : 'light'); } catch (e) {}
  };
})();

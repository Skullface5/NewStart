/* ============================================================
   ROSA — admin promo appearance panel (Settings tab)
   Reads/writes settings.promo_* and keeps a live preview in sync.
   Keys: promo_badge_color, promo_price_color, promo_badge_shape,
         buy_cart_icon
   ============================================================ */
(function () {
  'use strict';

  var DEFAULTS = {
    promo_badge_color: 'green',
    promo_price_color: 'red',
    promo_badge_shape: 'pill',
    buy_cart_icon: 'plus-cart'
  };

  var state = Object.assign({}, DEFAULTS);
  var REACTIVE = { promo_badge_color: 'promoBadgeColor', promo_price_color: 'promoPriceColor' };
  var SEGS = { promo_badge_shape: 'promoBadgeShape', buy_cart_icon: 'promoCartIcon' };

  function q(id) { return document.getElementById(id); }

  function msg(text, ok) {
    var el = q('promoMsg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'hero-admin-msg' + (text ? (ok ? ' ok' : ' err') : '');
  }

  function rs() { return window.RosaPromo || null; }

  function paint() {
    var RP = rs();
    if (!RP) return;
    RP.setSettings(state);
    RP.injectCss();

    // swatches
    Object.keys(REACTIVE).forEach(function (key) {
      var box = q(REACTIVE[key]);
      if (!box) return;
      box.querySelectorAll('.promo-sw').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.value === state[key]);
      });
    });
    // segmented controls
    Object.keys(SEGS).forEach(function (key) {
      var box = q(SEGS[key]);
      if (!box) return;
      box.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.value === state[key]);
      });
    });
    // live preview
    var badge = q('promoPreviewBadge');
    if (badge) {
      badge.className = 'rp-badge rp-badge--' + RP.shape();
      badge.style.background = RP.bg();
      badge.textContent = '-40%';
    }
    var price = q('promoPreviewPrice');
    if (price) price.style.color = RP.priceColor();
    var icon = q('promoPreviewIcon');
    if (icon) icon.innerHTML = RP.buyIcon();
    var cartBtn = q('promoPreviewCart');
    if (cartBtn) {
      cartBtn.style.borderColor = RP.bg();
      cartBtn.style.color = RP.bg();
    }
  }

  function bind() {
    Object.keys(REACTIVE).forEach(function (key) {
      var box = q(REACTIVE[key]);
      if (!box || box.__rosaBound) return;
      box.__rosaBound = true;
      box.addEventListener('click', function (e) {
        var b = e.target.closest('.promo-sw');
        if (!b) return;
        state[key] = b.dataset.value;
        paint();
      });
    });
    Object.keys(SEGS).forEach(function (key) {
      var box = q(SEGS[key]);
      if (!box || box.__rosaBound) return;
      box.__rosaBound = true;
      box.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-value]');
        if (!b) return;
        state[key] = b.dataset.value;
        paint();
      });
    });
    var save = q('btnSavePromo');
    if (save && !save.__rosaBound) {
      save.__rosaBound = true;
      save.addEventListener('click', savePromo);
    }
  }

  async function loadPromo() {
    try {
      var sb = window.__rosaSupabase || window.supabase;
      if (!sb) return;
      var res = await sb.from('settings').select('*');
      if (res.error) throw res.error;
      var map = {};
      (res.data || []).forEach(function (r) { map[r.key] = r.value; });
      Object.keys(DEFAULTS).forEach(function (k) {
        var v = map[k];
        if (v && typeof v === 'object' && v.value != null) v = v.value;
        if (typeof v === 'string' && v) state[k] = v;
      });
      paint();
    } catch (e) {
      msg('⚠ ' + (e && e.message ? e.message : String(e)));
    }
  }

  async function savePromo() {
    var btn = q('btnSavePromo');
    if (btn) btn.disabled = true;
    try {
      var sb = window.__rosaSupabase || window.supabase;
      if (!sb) throw new Error('no supabase client');
      var rows = Object.keys(DEFAULTS).map(function (k) {
        return { key: k, value: state[k] };
      });
      var res = await sb.from('settings').upsert(rows, { onConflict: 'key' });
      if (res.error) throw res.error;
      msg('');
      var saved = q('promoSavedBadge');
      if (saved) {
        saved.hidden = false;
        clearTimeout(savePromo._t);
        savePromo._t = setTimeout(function () { saved.hidden = true; }, 3500);
      }
      // let the storefront caches drop the old look immediately
      try { localStorage.removeItem('rosa_cache_all'); } catch (e) {}
    } catch (e) {
      msg('⚠ ' + (e && e.message ? e.message : String(e)));
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function boot() {
    if (!q('promoAdminCard')) return;
    bind();
    paint();
  }

  window.rosaReloadPromo = function () { loadPromo(); };
  document.addEventListener('DOMContentLoaded', function () { boot(); loadPromo(); });
  window.addEventListener('load', function () { boot(); loadPromo(); });
  var t = setInterval(function () { if (q('promoAdminCard')) { boot(); clearInterval(t); } }, 600);
  setTimeout(function () { clearInterval(t); }, 30000);
})();
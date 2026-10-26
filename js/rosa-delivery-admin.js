/* ============================================================
   ROSA — admin delivery price panel (Settings tab + category page)
   Reads/writes settings.delivery_fee (number in TND, 0 = free delivery).
   The storefront reads this same key via window.RosaShop.deliveryFee()
   (js/rosa-shop.js), so saving here applies on the next page load.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'delivery_fee';
  var CACHE_KEY = 'rosa_shop_settings'; // storefront's 10-min cache

  function q(id) { return document.getElementById(id); }

  function msg(text, ok) {
    var el = q('deliveryMsg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'hero-admin-msg' + (text ? (ok ? ' ok' : ' err') : '');
  }

  function client() {
    var sb = window.__rosaSupabase || window.supabase;
    return (sb && typeof sb.from === 'function') ? sb : null;
  }

  function unwrap(v) {
    // the admin may have stored {"value": 7} instead of 7
    if (v && typeof v === 'object' && v.value != null) return v.value;
    return v;
  }

  function num(v) {
    if (typeof v === 'number') return isFinite(v) ? v : NaN;
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }

  // '7', '7,5', '7.5', '' and '0' are valid ('' → 0). Negative / junk → NaN.
  function validate() {
    var input = q('deliveryInput');
    if (!input) return null;
    var raw = input.value.trim();
    if (raw === '') return 0;
    var n = num(raw);
    if (isNaN(n) || n < 0) {
      input.focus();
      msg('⚠ Montant invalide (nombre ≥ 0 requis).', false);
      return null;
    }
    return n;
  }

  async function loadDelivery() {
    try {
      var c = client();
      if (!c) return;
      var res = await c.from('settings').select('*');
      if (res.error) throw res.error;
      var val = 0;
      (res.data || []).forEach(function (r) {
        if (r.key !== KEY) return;
        var n = num(unwrap(r.value));
        if (!isNaN(n)) val = Math.max(0, n);
      });
      var input = q('deliveryInput');
      if (input) input.value = (val > 0 ? String(val).replace('.', ',') : '0');
    } catch (e) {
      msg('⚠ ' + (e && e.message ? e.message : String(e)));
    }
  }

  async function saveDelivery() {
    var btn = q('btnSaveDelivery');
    var n = validate();
    if (n === null) return;
    if (btn) btn.disabled = true;
    try {
      var c = client();
      if (!c) throw new Error('no supabase client');
      // { key, value } with an upsert on the unique `key` column, anon key.
      var res = await c.from('settings').upsert({ key: KEY, value: n }, { onConflict: 'key' });
      if (res.error) throw res.error;
      msg('');
      var saved = q('deliverySavedBadge');
      if (saved) {
        saved.hidden = false;
        clearTimeout(saveDelivery._t);
        saveDelivery._t = setTimeout(function () { saved.hidden = true; }, 3500);
      }
      // drop the storefront's cache so the new fee applies on next load
      try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem('rosa_cache_all'); } catch (e) {}
    } catch (e) {
      msg('⚠ ' + (e && e.message ? e.message : String(e)));
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function bind() {
    var save = q('btnSaveDelivery');
    if (save && !save.__rosaBound) {
      save.__rosaBound = true;
      save.addEventListener('click', saveDelivery);
    }
    var input = q('deliveryInput');
    if (input && !input.__rosaBound) {
      input.__rosaBound = true;
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') saveDelivery(); });
    }
  }

  function boot() {
    if (!q('deliveryAdminCard')) return;
    bind();
  }

  window.rosaReloadDelivery = function () { loadDelivery(); };
  document.addEventListener('DOMContentLoaded', function () { boot(); loadDelivery(); });
  window.addEventListener('load', function () { boot(); loadDelivery(); });
  var t = setInterval(function () { if (q('deliveryAdminCard')) { boot(); clearInterval(t); } }, 600);
  setTimeout(function () { clearInterval(t); }, 30000);
})();

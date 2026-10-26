/* ROSA — shop settings the storefront needs (delivery price).
   ---------------------------------------------------------------------------
   The delivery price is set by the owner in the admin and stored in the
   Supabase `settings` table under the key `delivery_fee` (a number in TND).
   Default is 0 = free delivery.

   Exposes:  window.RosaShop.deliveryFee()  -> number (0 when unknown)
             window.RosaShop.settings        -> raw map

   Never blocks the page and never throws: until the value arrives the fee is
   whatever was cached in localStorage (max 10 minutes old) or 0. When a fresh
   value lands it fires the window event 'rosa-shop-ready' so the cart and the
   checkout summary can redraw.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  var CACHE_KEY = 'rosa_shop_settings';
  var CACHE_MS = 10 * 60 * 1000;

  var state = { delivery_fee: 0 };

  function num(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
    return isFinite(n) && n > 0 ? n : 0;
  }

  function unwrap(v) {
    // the admin may have stored {"value": 7} instead of 7
    if (v && typeof v === 'object' && v.value != null) return v.value;
    return v;
  }

  function anonKey() {
    try {
      var c = window.__rosaSupabase;
      if (c) {
        var h = c.headers || (c.rest && c.rest.headers) || (c.supabase && c.supabase.headers);
        if (h) {
          if (typeof h.get === 'function') { var k = h.get('apikey'); if (k) return k; }
          if (h.apikey) return h.apikey;
          if (h.apiKey) return h.apiKey;
        }
      }
    } catch (e) {}
    try {
      var tags = document.querySelectorAll('script[data-anon-key]');
      for (var i = 0; i < tags.length; i++) {
        var v = tags[i].getAttribute('data-anon-key');
        if (v && v.indexOf('.') > 20) return v;
      }
    } catch (e) {}
    try { return localStorage.getItem('rosa_anon_key') || null; } catch (e) {}
    return null;
  }

  function cached() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o && o.ts && o.data && Date.now() - o.ts < CACHE_MS) return o.data;
    } catch (e) {}
    return null;
  }

  function announce() {
    try { window.dispatchEvent(new Event('rosa-shop-ready')); } catch (e) {}
  }

  function apply(map) {
    if (!map) return false;
    if (Object.prototype.hasOwnProperty.call(map, 'delivery_fee')) {
      state.delivery_fee = num(unwrap(map.delivery_fee));
    }
    return true;
  }

  window.RosaShop = {
    settings: state,
    deliveryFee: function () { return num(state.delivery_fee); },
    /* the admin saves through here so the other tabs/pages pick it up on reload */
    refresh: function () { run(); }
  };

  function run() {
    if (apply(cached())) announce();

    var key = anonKey();
    if (!key || typeof fetch !== 'function') return;

    /* only the row this module needs — the settings table also holds the banner
       slides, which are several KB we have no use for here */
    fetch(URL + '/rest/v1/settings?select=key,value&key=eq.delivery_fee', {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        var map = {};
        rows.forEach(function (row) { map[row.key] = row.value; });
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: map })); } catch (e) {}
        if (apply(map)) announce();
      })
      .catch(function () { /* offline: the cached value stays */ });
  }

  run();
  window.addEventListener('load', run);
})();

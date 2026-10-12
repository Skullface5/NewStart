/* ============================================================
   ROSA — loads the promo appearance settings on the storefront.
   Self-contained: pulls the anon key off window.__rosaSupabase (the
   page scripts create it) or off any script tag that carries
   data-anon-key, so it needs no dependency on load order.
   Degrades silently to the built-in defaults when offline.
   ============================================================ */
(function () {
  'use strict';

  var URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';
  var KEYS = ['promo_badge_color', 'promo_price_color', 'promo_badge_shape', 'buy_cart_icon'];
  var CACHE_KEY = 'rosa_promo_settings';
  var CACHE_MS = 6 * 60 * 60 * 1000;   // 6h

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

  function apply(obj) {
    try { if (window.RosaPromo && obj) window.RosaPromo.setSettings(obj); } catch (e) {}
  }

  function cached() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o && o.ts && Date.now() - o.ts < CACHE_MS) return o.data || null;
    } catch (e) {}
    return null;
  }

  function store(data) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
  }

  function run() {
    var c = cached();
    if (c) apply(c);

    var key = anonKey();
    if (!key || typeof fetch !== 'function') return;

    fetch(URL + '/rest/v1/settings?select=*', {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        var map = {};
        rows.forEach(function (row) {
          if (KEYS.indexOf(row.key) < 0) return;
          var v = row.value;
          if (v && typeof v === 'object' && v.value != null) v = v.value;
          if (typeof v === 'string' && v) map[row.key] = v;
        });
        if (Object.keys(map).length) { apply(map); store(map); }
      })
      .catch(function () { /* offline: defaults stay */ });
  }

  // make sure the module is there first, then go
  if (window.RosaPromo) run();
  else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
})();
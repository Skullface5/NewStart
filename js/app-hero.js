/* Rosa — storefront hero injector (self-contained; one <script defer src="js/app-hero.js?v=1"> per page).
   Reads settings keys hero_images / hero_position (see SPEC-hero-collections.md) and layers a
   position-controlled background photo INSIDE the existing .hero-tt — zero HTML edits needed.
   Supabase key comes from the page's own client (window.__rosaSupabase, exported by app-*.js)
   or from data-anon-key on this script tag. Falls back silently to the current gradient hero. */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';

  function resolveKey() {
    var c = window.__rosaSupabase;
    try {
      // the page exports the real client object directly
      var h = c && (c.headers ? c : (c.supabase || null));
      h = h && h.headers;
      if (h) {
        if (h.apikey || h.apiKey) return h.apikey || h.apiKey;
        if (typeof h.get === 'function') { var k = h.get('apikey'); if (k) return k; }
      }
    } catch (e) {}
    // last resort: the anon key literal is inlined in every page's app-*.js source
    var s = document.querySelector('script[src*="app-hero.js"]');
    if (s && s.getAttribute('data-anon-key')) return s.getAttribute('data-anon-key');
    return null;
  }

  function pct(v, d) {
    v = String(v == null ? '' : v).trim();
    if (!v) return d;
    if (v.indexOf('%') < 0) v += '%';
    return v;
  }

  function applyPos(img, pos) {
    pos = pos && typeof pos === 'object' ? pos : {};
    img.style.setProperty('--hp-tx', pct(pos.tx, '0%'));
    img.style.setProperty('--hp-ty', pct(pos.ty, '-8%'));
    var z = parseFloat(pos.zoom);
    img.style.setProperty('--hp-zoom', isFinite(z) && z >= 1 ? String(Math.min(3, z)) : '1');
  }

  var CSS = [
    '.hero-tt > .hero-bg-ctl { position:absolute; inset:0; z-index:0; overflow:hidden; border-radius:inherit; pointer-events:none; }',
    '.hero-tt > .hero-bg-ctl .hero-bg-img { position:absolute; inset:-12%; width:124%; height:124%; object-fit:cover;',
    '  transform: scale(var(--hp-zoom,1)) translate(var(--hp-tx,0%), var(--hp-ty,-8%)); transform-origin:center;',
    '  opacity:0; transition:opacity 1s ease; will-change:transform,opacity; }',
    '.hero-tt > .hero-bg-ctl .hero-bg-img.on { opacity:1; }',
    '.hero-tt > .hero-bg-ctl::after { content:""; position:absolute; inset:0;',
    '  background: linear-gradient(180deg, rgba(247,240,230,.30) 0%, rgba(247,240,230,.55) 62%, rgba(247,240,230,.80) 100%); }',
    'body.dark .hero-tt > .hero-bg-ctl::after { background: linear-gradient(180deg, rgba(26,24,20,.35) 0%, rgba(26,24,20,.60) 62%, rgba(26,24,20,.85) 100%); }',
    '.hero-tt > :not(.hero-bg-ctl) { position:relative; z-index:1; }',
    '.hero-tt h1, .hero-tt .hero-sub-tt { text-shadow: 0 1px 14px rgba(247,240,230,.55); }',
    'body.dark .hero-tt h1, body.dark .hero-tt .hero-sub-tt { text-shadow: 0 1px 14px rgba(26,24,20,.6); }',
    '.hero-tt::after { content: none; }'

  ].join('\n');

  function start() {
    var hero = document.querySelector('.hero-tt');
    if (!hero) return;
    var key = resolveKey();
    if (!key) { setTimeout(start, 400); return; } // page client not booted yet (defer order)
    if (hero.querySelector('.hero-bg-ctl')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var ctl = document.createElement('div');
    ctl.className = 'hero-bg-ctl';
    ctl.setAttribute('aria-hidden', 'true');
    hero.insertBefore(ctl, hero.firstChild);

    fetch(SUPABASE_URL + '/rest/v1/settings?select=*', {
      headers: { apikey: key, Authorization: '***' + key }
    })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var map = {};
        (rows || []).forEach(function (r) { map[r.key] = r.value; });
        var urls = Array.isArray(map.hero_images) ? map.hero_images.filter(Boolean).slice(0, 6) : [];
        if (!urls.length) return;
        var pos = map.hero_position || {};
        var legacy = (pos && typeof pos.tx === 'string') ? pos : null;
        var imgs = urls.map(function (u) {
          var img = document.createElement('img');
          img.className = 'hero-bg-img';
          img.alt = '';
          img.decoding = 'async';
          applyPos(img, legacy || pos[u] || pos[String(u).split('/').pop()] || {});
          img.src = u;
          ctl.appendChild(img);
          return img;
        });
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        imgs[0].classList.add('on');
        if (imgs.length === 1 || reduce) return;
        var i = 0;
        setInterval(function () {
          imgs[i].classList.remove('on');
          i = (i + 1) % imgs.length;
          imgs[i].classList.add('on');
        }, 6000);
      })
      .catch(function () {});
  }

  window.RosaHero = { boot: start, _css: CSS };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { start(); });
  } else {
    start();
  }
})();

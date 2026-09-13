/* Rosa — storefront hero + promo banner injector (one <script defer src="js/app-hero.js?v=N"> per page).
   Reads settings keys hero_images / hero_position / hero_autoplay (home hero slideshow)
   and banner_images / banner_autoplay (promo-card diaporama) — STE Mondial parity:
   cross-fade every 5s, paused on hidden tabs, per-image drag/zoom framing on the hero.
   Anon key from window.__rosaSupabase (exported by page scripts) or data-anon-key on the tag.
   Falls back silently to the gradient hero / static promo image. */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://dtwciuhwwanwlwpydeko.supabase.co';

  function getClient() {
    var c = window.__rosaSupabase;
    return (c && typeof c.from === 'function') ? c : null;
  }

  function absUrl(u) {
    u = String(u || '').trim();
    if (!u || /^(https?:|data:|blob:|\/)/i.test(u)) return u;
    return SUPABASE_URL + '/storage/v1/object/public/product-images/' + u;
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
    'body.dark .hero-tt h1, body.dark .hero-sub-tt { text-shadow: 0 1px 14px rgba(26,24,20,.6); }',
    '.hero-tt::after { content: none; }',
    '.promo-card-inner img.promo-slide { opacity:0; transition:opacity 1.1s ease; }',
    '.promo-card-inner img.promo-slide.on { opacity:1; }'
  ].join('\n');

  function start() {
    var hero = document.querySelector('.hero-tt');
    var promo = document.querySelector('.promo-card-inner');
    if (!hero && !promo) return;
    var client = getClient();
    if (!client) { setTimeout(start, 400); return; } // page client not booted yet (defer order)
    if (window.__rosaHeroBooted) return;
    window.__rosaHeroBooted = true;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    client.from('settings').select('*').then(function (res) {
      var rows = (!res.error && Array.isArray(res.data)) ? res.data : [];
      var map = {};
      rows.forEach(function (r) { map[r.key] = r.value; });
      if (hero) buildHero(hero, map);
      if (promo) buildBanner(promo, map);
    });

    // Home hero slideshow — position-controlled frames, cross-fade every 5s (STE parity)
    function buildHero(hero, map) {
      if (hero.querySelector('.hero-bg-ctl')) return;
      var urls = (Array.isArray(map.hero_images) ? map.hero_images : [])
        .map(absUrl).filter(Boolean).slice(0, 6);
      if (!urls.length) return;
      var ctl = document.createElement('div');
      ctl.className = 'hero-bg-ctl';
      ctl.setAttribute('aria-hidden', 'true');
      hero.insertBefore(ctl, hero.firstChild);
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
      imgs[0].classList.add('on');
      rotate(ctl, '.hero-bg-img', imgs, map.hero_autoplay, 1000);
    }

    // Promo banner diaporama — port of STE buildBanner: cross-fade slides every 5s
    function buildBanner(host, map) {
      var urls = (Array.isArray(map.banner_images) ? map.banner_images : [])
        .map(absUrl).filter(Boolean);
      if (!urls.length) return;                       // keep the static template image
      var first = host.querySelector('img');
      if (urls.length === 1) {
        if (first) { first.className = 'promo-bg-image'; first.style.display = ''; first.src = urls[0]; }
        else host.insertBefore(mkSlide(urls[0], true), host.firstChild);
        return;
      }
      var mk = function (src, on) {
        var im = document.createElement('img');
        im.src = src;
        im.alt = '';
        im.loading = 'lazy';
        im.decoding = 'async';
        im.className = 'promo-bg-image promo-slide' + (on ? ' on' : '');
        return im;
      };
      function mkSlide(s, on) { return mk(s, on); }
      if (first) {
        first.className = 'promo-bg-image promo-slide on';
        first.style.display = '';
        if (first.getAttribute('src') !== urls[0]) first.src = urls[0];
      } else {
        first = mk(urls[0], true);
        host.insertBefore(first, host.firstChild);
      }
      Array.prototype.slice.call(host.querySelectorAll('img.promo-slide')).forEach(function (im) {
        if (im !== first) im.remove();
      });
      var anchor = host.querySelector('.promo-overlay-gradient');
      for (var s = 1; s < urls.length; s++) host.insertBefore(mk(urls[s], false), anchor || null);
      rotate(host, 'img.promo-slide', null, map.banner_autoplay, 1100);
    }

    // shared rotation clock (STE rules: 5s, skip when tab hidden, respect reduce-motion + toggle)
    function rotate(host, sel, initial, autoplayFlag, fadeMs) {
      if (autoplayFlag === false) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var list = initial || Array.prototype.slice.call(host.querySelectorAll(sel));
      if (list.length < 2) return;
      var i = 0;
      setInterval(function () {
        if (document.hidden) return;
        var all = initial ? list : Array.prototype.slice.call(host.querySelectorAll(sel));
        if (all.length < 2) return;
        all[i].classList.remove('on');
        i = (i + 1) % all.length;
        all[i].classList.add('on');
      }, 5000);
    }
  }

  window.RosaHero = { boot: start, _css: CSS };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { start(); });
  } else {
    start();
  }
})();

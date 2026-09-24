/* Rosa — promo banner diaporama injector (one <script defer src="js/app-hero.js?v=N"> per page).
   Reads settings keys banner_images / banner_autoplay (the index promo-card slideshow) —
   STE Mondial parity: cross-fade every 5s, paused on hidden tabs. The home hero is untouched.
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



  var CSS = [
    '.promo-card-inner img.promo-slide { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 35%; opacity:0; transform:translateX(100%); transition:transform 1.1s ease, opacity 1.1s ease; }',
    '.promo-card-inner img.promo-slide.on { opacity:1; transform:translateX(0); }',
    '.promo-card-inner img.promo-slide.out { opacity:0; transform:translateX(-100%); }'
  ].join('\n');

  function start() {
    var promo = document.querySelector('.promo-card-inner');
    if (!promo) return;
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
      buildBanner(promo, map);
    });


    // Promo banner diaporama — port of STE buildBanner: cross-fade slides every 5s
    function buildBanner(host, map) {
      var urls = (Array.isArray(map.banner_images) ? map.banner_images : [])
        .map(absUrl).filter(Boolean);
      if (!urls.length) return;                       // keep the static template image
      var first = host.querySelector('img');
      if (urls.length === 1) {
        if (first) { first.className = 'promo-slide on'; first.style.display = ''; first.src = urls[0]; }
        else host.insertBefore(mk(urls[0], true), host.firstChild);
        return;
      }
      var mk = function (src, on) {
        var im = document.createElement('img');
        im.src = src;
        im.alt = '';
        im.loading = 'lazy';
        im.decoding = 'async';
        im.className = 'promo-slide' + (on ? ' on' : '');
        return im;
      };
      function mkSlide(s, on) { return mk(s, on); }
      if (first) {
        first.className = 'promo-slide on';
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
        var cur = all[i], nxt = all[(i + 1) % all.length];
        cur.classList.remove('on');
        cur.classList.add('out');
        nxt.classList.add('on');
        setTimeout(function () { cur.classList.remove('out'); }, 1300);
        i = (i + 1) % all.length;
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

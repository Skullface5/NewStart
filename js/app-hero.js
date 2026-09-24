/* Rosa — promo banner diaporama injector (one <script defer src="js/app-hero.js?v=N"> per page).
   Reads settings keys banner_images / banner_autoplay (the index promo-card slideshow).
   banner_images items: {src, type:'image'|'video', link?} — legacy plain URL strings still work.
   STE Mondial parity: slide in/out every 5s, paused on hidden tabs. The home hero is untouched.
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

  function isVid(u) { return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(String(u || '')); }

  var CSS = [
    '.promo-card-inner .promo-slide { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 35%; opacity:0; transform:translateX(100%); transition:transform 1.1s ease, opacity 1.1s ease; pointer-events:none; z-index:0; }',
    '.promo-card-inner .promo-slide.on { opacity:1; transform:translateX(0); pointer-events:auto; }',
    '.promo-card-inner .promo-slide.out { opacity:0; transform:translateX(-100%); }',
    '.promo-card-inner .promo-slide.has-link { cursor:pointer; }'
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
      try { buildBanner(promo, map); } catch (e) { /* keep static template image */ }
    });

    // Promo banner diaporama — slide motion; supports images + videos + optional per-slide links
    function buildBanner(host, map) {
      var raw = Array.isArray(map.banner_images) ? map.banner_images : [];
      if (!raw.length && typeof map.banner_image === 'string' && map.banner_image) raw = [map.banner_image];
      var items = [];
      raw.forEach(function (it) {
        if (!it) return;
        if (typeof it === 'string') { items.push({ src: absUrl(it), type: isVid(it) ? 'video' : 'image', link: '' }); return; }
        var s = absUrl(it.src || '');
        if (!s) return;
        items.push({ src: s, type: (it.type === 'video' || isVid(s)) ? 'video' : 'image', link: String(it.link || '') });
      });
      items = items.filter(function (x) { return x.src; }).slice(0, 6);
      if (!items.length) return;                        // keep the static template image

      var firstImg = host.querySelector('img');

      function mkNode(it, on) {
        var n;
        if (it.type === 'video') {
          n = document.createElement('video');
          n.src = it.src; n.muted = true; n.loop = true; n.playsInline = true;
          n.setAttribute('muted', ''); n.setAttribute('loop', '');
          n.setAttribute('playsinline', ''); n.setAttribute('webkit-playsinline', '');
          n.preload = 'auto'; n.setAttribute('preload', 'auto');
        } else {
          n = document.createElement('img');
          n.src = it.src; n.alt = ''; n.loading = 'lazy'; n.decoding = 'async';
        }
        n.className = 'promo-slide' + (on ? ' on' : '') + (it.link ? ' has-link' : '');
        if (it.link) n.setAttribute('data-blink', it.link);
        return n;
      }

      // single image: reuse the template <img> in place (no clone, no flash)
      if (items.length === 1 && items[0].type === 'image') {
        if (firstImg) {
          firstImg.className = 'promo-slide on' + (items[0].link ? ' has-link' : '');
          firstImg.style.display = '';
          if (firstImg.getAttribute('src') !== items[0].src) firstImg.src = items[0].src;
          if (items[0].link) firstImg.setAttribute('data-blink', items[0].link);
        } else {
          host.insertBefore(mkNode(items[0], true), host.firstChild);
        }
        bindClick(host);
        return;
      }

      // multiple slides (or a single video): rebuild the slide layer
      Array.prototype.slice.call(host.querySelectorAll('.promo-slide')).forEach(function (n) { n.remove(); });
      if (firstImg) firstImg.style.display = 'none';    // keep hidden as ultimate fallback
      var anchor = host.querySelector('.promo-overlay-gradient');
      items.forEach(function (it, i) {
        host.insertBefore(mkNode(it, i === 0), anchor || null);
      });
      bindClick(host);
      if (typeof host.__rotateCleanup === 'function') host.__rotateCleanup();
      host.__rotateCleanup = slideshow(host, map.banner_autoplay, items.length);
    }

    function bindClick(host) {
      if (host.__blinkBound) return;
      host.__blinkBound = true;
      host.addEventListener('click', function (e) {
        // ignore the click that a swipe leaves behind
        if (host.__suppressClick && Date.now() - host.__suppressClick < 700) return;
        var t = e.target;
        var el = (t && t.closest) ? t.closest('[data-blink]') : null;
        if (el) { e.preventDefault(); window.location.href = el.getAttribute('data-blink'); }
      });
    }

    // Slideshow: autoplay clock (STE rules) + finger swipe to browse slides manually
    function slideshow(host, autoplayFlag, count) {
      if (count < 2) return null;
      var i = 0;

      function slides() { return Array.prototype.slice.call(host.querySelectorAll('.promo-slide')); }

      function show(target) {
        var s = slides();
        if (s.length < 2) return;
        target = ((target % s.length) + s.length) % s.length;
        if (target === i) return;
        var cur = s[i], nxt = s[target];
        cur.classList.remove('on');
        cur.classList.add('out');
        nxt.classList.add('on');
        if (cur.tagName === 'VIDEO' && !cur.paused) { try { cur.pause(); } catch (e) {} }
        if (nxt.tagName === 'VIDEO') { try { var pr = nxt.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
        setTimeout(function () { cur.classList.remove('out'); }, 1300);
        i = target;
      }
      host.__goTo = show;   // manual jump (dot nav etc.)

      // ── swipe ──
      if (!host.__swipeBound) {
        host.__swipeBound = true;
        var x0 = 0, y0 = 0, t0 = 0, swiping = false;
        host.style.touchAction = 'pan-y';  // vertical page scroll stays natural; horizontal is ours
        host.addEventListener('touchstart', function (e) {
          if (e.touches.length !== 1) { swiping = false; return; }
          x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); swiping = true;
        }, { passive: true });
        host.addEventListener('touchend', function (e) {
          if (!swiping) return;
          swiping = false;
          var dx = (e.changedTouches[0].clientX - x0);
          var dy = (e.changedTouches[0].clientY - y0);
          if (Date.now() - t0 > 800) return;                       // long press: not a swipe
          if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.4) return; // vertical intent
          host.__suppressClick = Date.now();
          if (host.__goTo) host.__goTo(i - (dx > 0 ? 1 : -1));      // right→prev, left→next
          restart(9000);                                           // give the finger the wheel: longer pause
        }, { passive: true });
      }

      // ── autoplay clock ──
      var timer = null;
      function tick() { if (!document.hidden) show(i + 1); }
      function restart(delayMs) {
        if (timer) { clearInterval(timer); timer = null; }
        if (autoplayFlag === false) return;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;
        timer = setInterval(tick, delayMs || 5000);
      }
      restart();

      var first = host.querySelector('.promo-slide.on');
      if (first && first.tagName === 'VIDEO') {
        try { var p = first.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      }
      return function () { if (timer) clearInterval(timer); };
    }
  }

  window.RosaHero = { boot: start, _css: CSS };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { start(); });
  } else {
    start();
  }
})();

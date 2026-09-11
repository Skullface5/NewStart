/* ============================================================================
   ROSA FRAGRANCE — wishlist / favorites (stolen from STE Mondial, adapted)
   localStorage-only: no schema, no RLS, no backend. Safe to load on any page.
   - heart buttons on every .product-card + product detail page
   - floating "Favoris" pill on catalog pages toggles favorites-only view
   - self-injecting CSS + MutationObserver (works with async product renders)
   ============================================================================ */
(function () {
  'use strict';
  var KEY = 'rosa_favs_v1';

  // rosa stores language per page; support both keys, default fr
  var lang = 'fr';
  try { lang = (localStorage.getItem('language') || localStorage.getItem('lang') || 'fr').slice(0, 2); } catch (e) {}
  var L = (lang === 'en')
    ? { add: 'Add to favorites', rm: 'Remove from favorites', favs: 'Favorites' }
    : { add: 'Ajouter aux favoris', rm: 'Retirer des favoris', favs: 'Favoris' };

  function load() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.map(String) : []; }
    catch (e) { return []; }
  }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function has(id) { return load().indexOf(String(id)) !== -1; }
  function count() { return load().length; }
  function toggle(id) {
    id = String(id);
    var a = load(), i = a.indexOf(id);
    if (i === -1) a.push(id); else a.splice(i, 1);
    save(a);
    return i === -1;
  }

  /* ---- styles, injected once (zero per-page CSS edits) ---- */
  var css =
    '.rosa-fav{position:absolute;top:.6rem;right:.6rem;z-index:6;width:2.4rem;height:2.4rem;border:0;' +
    'border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(0,0,0,.14);' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.05rem;color:#b9a27a;' +
    'transition:transform .15s ease,color .15s ease;line-height:1;padding:0}' +
    '.rosa-fav:hover{transform:scale(1.12)}' +
    '.rosa-fav:active{transform:scale(.94)}' +
    '.rosa-fav.on{color:#c0392b}' +
    '.rosa-fav-anchor{position:relative}' +
    '.rosa-fav-detail{position:static;margin-left:.6rem;vertical-align:middle;width:2.2rem;height:2.2rem}' +
    '.rosa-fav-pill{position:fixed;right:1rem;bottom:1rem;z-index:70;border:0;border-radius:999px;' +
    'padding:.65rem 1.05rem;background:#2d2417;color:#fff;font-weight:600;font-size:.9rem;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.22);cursor:pointer;display:flex;gap:.45rem;align-items:center;font-family:inherit}' +
    '.rosa-fav-pill .n{background:#c0392b;border-radius:999px;min-width:1.35rem;height:1.35rem;' +
    'display:inline-flex;align-items:center;justify-content:center;font-size:.75rem;padding:0 .3rem}' +
    '.rosa-fav-pill.active{outline:2px solid #c0392b;outline-offset:2px}' +
    '.rosa-fav-hidden{display:none !important}';
  var stEl = document.createElement('style');
  stEl.textContent = css;
  document.head.appendChild(stEl);

  function heartBtn(id, extraClass) {
    var on = has(id);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'rosa-fav' + (extraClass ? ' ' + extraClass : '') + (on ? ' on' : '');
    b.setAttribute('data-fav-id', id);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', on ? L.rm : L.add);
    b.innerHTML = '<i class="' + (on ? 'fas' : 'far') + ' fa-heart" aria-hidden="true"></i>';
    return b;
  }

  var favsOnly = false;

  function applyFilter() {
    var favs = load();
    document.querySelectorAll('.product-card[data-product-id]').forEach(function (card) {
      var hide = favsOnly && favs.indexOf(card.getAttribute('data-product-id')) === -1;
      card.classList.toggle('rosa-fav-hidden', hide);
    });
  }

  function updatePill() {
    var p = document.querySelector('.rosa-fav-pill');
    if (!p) return;
    var n = p.querySelector('.n');
    if (n) n.textContent = count();
  }

  function syncHeart(b) {
    var on = has(b.getAttribute('data-fav-id'));
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', on ? L.rm : L.add);
    var i = b.querySelector('i');
    if (i) i.className = (on ? 'fas' : 'far') + ' fa-heart';
  }

  function decorate() {
    // catalog cards
    document.querySelectorAll('.product-card[data-product-id]').forEach(function (card) {
      if (card.querySelector('.rosa-fav')) return;
      var host = card.querySelector('.product-img') || card;
      if (getComputedStyle(host).position === 'static') host.classList.add('rosa-fav-anchor');
      host.appendChild(heartBtn(card.getAttribute('data-product-id')));
    });
    // product detail page: heart beside the price
    var price = document.querySelector('.product-detail .product-price');
    if (price && !price.parentNode.querySelector('.rosa-fav-detail')) {
      var m = (location.search.match(/[?&]id=([^&]+)/) || []);
      if (m[1]) price.parentNode.appendChild(heartBtn(decodeURIComponent(m[1]), 'rosa-fav-detail'));
    }
    applyFilter();
    updatePill();
  }

  function ensurePill() {
    if (document.querySelector('.rosa-fav-pill')) return;
    if (!document.getElementById('productGrid')) return; // catalog pages only
    var p = document.createElement('button');
    p.type = 'button';
    p.className = 'rosa-fav-pill';
    p.setAttribute('aria-label', L.favs);
    p.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>' + L.favs + '<span class="n">' + count() + '</span>';
    p.addEventListener('click', function () {
      favsOnly = !favsOnly;
      p.classList.toggle('active', favsOnly);
      applyFilter();
    });
    document.body.appendChild(p);
  }

  /* toggle via capture-phase delegation: beats card navigation handlers */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.rosa-fav') : null;
    if (!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggle(b.getAttribute('data-fav-id'));
    document.querySelectorAll('.rosa-fav[data-fav-id="' + b.getAttribute('data-fav-id') + '"]')
      .forEach(syncHeart);
    updatePill();
    applyFilter();
  }, true);

  /* re-decorate whenever pages inject rendered cards */
  var t = null;
  new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(decorate, 120);
  }).observe(document.documentElement, { childList: true, subtree: true });

  function init() { ensurePill(); decorate(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

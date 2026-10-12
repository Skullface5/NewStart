/* ============================================================
   ROSA — product variants ("Nos Produits")
   Shared logic injected into the storefront page scripts.
   Each app page script is an isolated IIFE, so this module talks
   to it through window.RosaVariants (data) + a small DOM contract.
   ============================================================ */
(function () {
  'use strict';

  // One CSS block, injected once per page.
  var CSS = [
    '.variant-block{margin:1.1rem 0 0.2rem;}',
    '.variant-title{font-size:.7rem;text-transform:uppercase;letter-spacing:.14em;color:var(--text-mid);margin-bottom:.55rem;font-weight:500;}',
    '.variant-options{display:flex;flex-wrap:wrap;gap:.55rem;}',
    '.variant-opt{display:inline-flex;align-items:center;gap:.5rem;min-width:104px;padding:.6rem .95rem;border:1px solid var(--input-border);border-radius:14px;background:var(--input-bg);color:var(--charcoal);cursor:pointer;text-align:start;font-family:inherit;line-height:1.25;transition:border-color .25s,background-color .25s,box-shadow .25s,transform .25s;}',
    '.variant-opt:hover{border-color:var(--gold-light);}',
    '.variant-opt.is-active{border-color:var(--gold-dark);background:var(--cream-deep);box-shadow:0 0 0 1px var(--gold-dark) inset;}',
    '.variant-radio{width:15px;height:15px;border-radius:50%;border:1.5px solid var(--border-medium);flex:0 0 auto;position:relative;}',
    '.variant-opt.is-active .variant-radio{border-color:var(--gold-dark);}',
    '.variant-opt.is-active .variant-radio:after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--gold-dark);}',
    '.variant-opt-txt{display:flex;flex-direction:column;}',
    '.variant-label{font-size:.82rem;font-weight:500;}',
    '.variant-price{font-size:.7rem;color:var(--gold-dark);}',
    '.variant-opt.is-out{opacity:.45;cursor:not-allowed;text-decoration:line-through;}',
    /* cart line */
    '.cart-item-sub{font-size:.68rem;color:var(--gold-dark);text-transform:uppercase;letter-spacing:.1em;margin-top:.15rem;}',
    /* product card badge */
    '.variant-chip{display:inline-block;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-dark);border:1px solid var(--border-medium);border-radius:20px;padding:.12rem .45rem;margin-top:.35rem;}'
  ].join('');

  function injectCss() {
    if (document.getElementById('rosaVariantCss')) return;
    var s = document.createElement('style');
    s.id = 'rosaVariantCss';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- data helpers (used by every page script) ---------- */

  function esc(str) { return str == null ? '' : String(str).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }

  function parse(v) {
    if (v == null || v === '' || v === 'null') return [];
    var arr = v;
    if (typeof v === 'string') { try { arr = JSON.parse(v); } catch (e) { return []; } }
    if (!Array.isArray(arr)) return [];
    var out = [];
    arr.forEach(function (r) {
      if (!r || typeof r !== 'object') return;
      var label = r.label != null ? String(r.label).trim() : '';
      if (!label) return;
      var price = r.price == null || r.price === '' ? null : parseFloat(r.price);
      if (!isFinite(price)) price = null;
      var qty = r.quantity == null || r.quantity === '' ? null : parseInt(r.quantity, 10);
      if (!isFinite(qty)) qty = null;
      out.push({ label: label, price: price, quantity: qty });
    });
    return out;
  }

  /* Variant price resolved against the product: variant price wins, else product price. */
  function priceFor(product, variant) {
    if (variant && variant.price != null) return variant.price;
    var p = parseFloat(product && product.price);
    return isFinite(p) ? p : 0;
  }

  /* Stock gate: unknown (null) counts as available; 0 = out. */
  function inStock(product, variant) {
    var q = variant && variant.quantity != null ? variant.quantity : (product ? product.quantity : null);
    return q == null ? true : Number(q) > 0;
  }

  function stockOf(product, variant) {
    if (variant && variant.quantity != null) return Number(variant.quantity);
    if (product && product.quantity != null) return Number(product.quantity);
    return null;
  }

  /* Effective price to display when a variant is selected. */
  function displayPrice(product, variant) {
    return priceFor(product, variant);
  }

  injectCss();

  window.RosaVariants = {
    parse: parse,
    priceFor: priceFor,
    inStock: inStock,
    stockOf: stockOf,
    esc: esc,
    injectCss: injectCss
  };
})();
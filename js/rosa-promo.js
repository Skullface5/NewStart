/* ============================================================
   ROSA — promo presentation (badges, promo price, Buy + cart button)
   Shared by every storefront page script through window.RosaPromo.
   Settings-driven: window.RosaPromoSettings = {promo_badge_color,
   promo_price_color, promo_badge_shape, buy_cart_icon}.
   ============================================================ */
(function () {
  'use strict';

  const DEFAULTS = {
    promo_badge_color: 'green',
    promo_price_color: 'red',
    promo_badge_shape: 'pill',
    buy_cart_icon: 'plus-cart'
  };
  /* green + red sampled from the reference screenshot */
  const COLORS = { green: '#03B557', red: '#E0231F', gold: '#B49A6A', black: '#2B2B2B' };
  const ICONS = {
    'plus-cart': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 6h18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    'bag': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 6h18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    'cart': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h2l2 9h9l2-6H7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="18.5" r="1.4"/><circle cx="16" cy="18.5" r="1.4"/></svg>',
    'bolt': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3 6.5 13H11l-1 8 7-10.5H12.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
  };

  let S = Object.assign({}, DEFAULTS);

  const CSS = `
.rp-badge{position:absolute;z-index:4;display:inline-flex;align-items:center;justify-content:center;
  font-family:'Jost',sans-serif;font-weight:600;letter-spacing:.01em;color:#fff;text-align:center;line-height:1;
  background:var(--rp-badge-bg,${COLORS.green});pointer-events:none;border:0;box-shadow:none;}
.rp-badge--pill{top:11px;left:11px;min-width:54px;height:26px;padding:0 11px;border-radius:999px;font-size:15px;}
.rp-badge--corner{top:0;left:0;min-width:54px;height:26px;padding:0 11px;border-radius:0 0 12px 0;font-size:15px;}
.rp-price--promo{color:var(--rp-price-color,${COLORS.red})!important;}
.rp-buy-row{display:flex;gap:.4rem;align-items:center;}
.rp-buy-btn{flex:1 1 auto;min-width:0;}
.rp-buy-row .buy-now-btn{background:#111111;border:none;color:#fff;min-height:49px;border-radius:999px;font-weight:600;font-size:.92rem;box-shadow:none;}
.rp-buy-row .buy-now-btn:hover{background:#000000;transform:none;}
.rp-buy-row .buy-now-btn.disabled,.rp-buy-row .buy-now-btn:disabled{background:#8a8a8a;}
.rp-cart-btn{flex:0 0 auto;width:75px;min-height:49px;display:inline-flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid #111111;color:#111111;border-radius:10px;cursor:pointer;
  transition:background-color .25s,color .25s;padding:0;}
.rp-cart-btn:hover{background:#111111;color:#fff;}
.rp-cart-btn svg{width:21px;height:21px;}
.rp-cart-btn[disabled]{opacity:.5;cursor:not-allowed;}
body.dark .rp-buy-row .buy-now-btn{background:#F5EFE6;border:none;color:#1A1814;}
body.dark .rp-buy-row .buy-now-btn:hover{background:#FFFFFF;}
body.dark .rp-buy-row .buy-now-btn.disabled,body.dark .rp-buy-row .buy-now-btn:disabled{background:#6b675f;}
body.dark .rp-cart-btn{border:1px solid #F5EFE6;color:#F5EFE6;}
body.dark .rp-cart-btn:hover{background:#F5EFE6;color:#1A1814;}
/* Compact phones (Galaxy J6 / A10 / Redmi 7 class, ~360px CSS): cards are
   2-col ~155px wide — full-size 49px pill + 75px square leaves the pill ~45px
   and it wraps into a blob. Shrink the whole row, force nowrap on the label,
   keep the square an exact square so it never stretches. */
@media (max-width:480px){
  .rp-buy-row{gap:.35rem;}
  .rp-buy-row .buy-now-btn{min-height:40px;padding:.35rem .55rem;font-size:.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .rp-cart-btn{width:42px;min-height:40px;border-radius:9px;}
  .rp-cart-btn svg{width:18px;height:18px;}
}
@media (max-width:420px){.rp-badge--pill,.rp-badge--corner{height:24px;min-width:50px;font-size:14px;padding:0 10px;}}
`;

  let cssDone = false;
  function injectCss() {
    if (cssDone || document.getElementById('rosaPromoCss')) { cssDone = true; return; }
    const s = document.createElement('style');
    s.id = 'rosaPromoCss';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
    cssDone = true;
  }

  function setSettings(s) {
    S = Object.assign({}, DEFAULTS, s || {});
    return S;
  }

  function bg() { return COLORS[S.promo_badge_color] || COLORS.green; }
  function priceColor() { return COLORS[S.promo_price_color] || COLORS.red; }
  function shape() { return ['pill', 'corner'].indexOf(S.promo_badge_shape) >= 0 ? S.promo_badge_shape : 'pill'; }
  function buyIcon() { return ICONS[S.buy_cart_icon] || ICONS['plus-cart']; }

  /* percent for a product row, or null when it isn't a promo */
  function percent(p) {
    if (!p) return null;
    let manual = p.promo_percent != null && p.promo_percent !== '' ? parseFloat(p.promo_percent) : NaN;
    const op = p.old_price != null && p.old_price !== '' ? parseFloat(p.old_price) : NaN;
    const cp = parseFloat(p.price);
    if (!isFinite(op) || !isFinite(cp) || op <= cp) {
      if (isFinite(manual) && manual > 0) return Math.round(manual);
      return null;
    }
    if (isFinite(manual) && manual > 0) return Math.round(manual);
    return Math.round(((op - cp) / op) * 100);
  }

  function isPromo(p) { return percent(p) != null; }

  /* inner HTML of the badge (no container) */
  function badgeHtml(p) {
    const pct = percent(p);
    if (pct == null) return '';
    return '<span class="rp-badge rp-badge--' + shape() + '" style="background:' + bg() + '">-' + pct + '%</span>';
  }

  /* badge anchored to a positioned image container */
  function badge(p) {
    if (!isPromo(p)) return '';
    return badgeHtml(p);
  }

  /* price block: struck old + coloured sale price when it's a promo */
  function priceHtml(p, fmt) {
    const f = typeof fmt === 'function' ? fmt : function (v) { return String(v); };
    const pct = percent(p);
    const op = p.old_price != null && p.old_price !== '' ? parseFloat(p.old_price) : NaN;
    const cp = parseFloat(p.price);
    if (pct != null && isFinite(op) && op > cp) {
      return '<s class="rp-old-price" style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + f(op) + '</s>'
        + '<span class="rp-price--promo">' + f(cp) + '</span>';
    }
    if (pct != null && isFinite(cp)) {
      return '<span class="rp-price--promo">' + f(cp) + '</span>';
    }
    return f(p.price);
  }

  window.RosaPromo = {
    DEFAULTS: DEFAULTS,
    COLORS: COLORS,
    ICONS: ICONS,
    setSettings: setSettings,
    settings: function () { return S; },
    percent: percent,
    isPromo: isPromo,
    badge: badge,
    badgeHtml: badgeHtml,
    priceHtml: priceHtml,
    bg: bg,
    priceColor: priceColor,
    shape: shape,
    buyIcon: buyIcon,
    injectCss: injectCss
  };

  injectCss();
})();
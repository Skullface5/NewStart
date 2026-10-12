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
    promo_badge_shape: 'starburst',
    buy_cart_icon: 'plus-cart'
  };
  const COLORS = { green: '#1E9E57', red: '#D62828', gold: '#B49A6A', black: '#2B2B2B' };
  const ICONS = {
    'plus-cart': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7.5h11l-1 11h-9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.2 7.5V6.4a2.8 2.8 0 0 1 5.6 0v1.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 11.2v5M9.5 13.7h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    'bag': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7.5h11l-1 11h-9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.2 7.5V6.4a2.8 2.8 0 0 1 5.6 0v1.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    'cart': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h2l2 9h9l2-6H7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="18.5" r="1.4"/><circle cx="16" cy="18.5" r="1.4"/></svg>',
    'bolt': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3 6.5 13H11l-1 8 7-10.5H12.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
  };

  let S = Object.assign({}, DEFAULTS);

  const CSS = `
.rp-badge{position:absolute;z-index:4;display:inline-flex;align-items:center;justify-content:center;
  font-family:'Jost',sans-serif;font-weight:700;letter-spacing:.03em;color:#fff;text-align:center;line-height:1;
  background:var(--rp-badge-bg,${COLORS.green});box-shadow:0 6px 18px rgba(0,0,0,.22);pointer-events:none;}
.rp-badge--pill{top:10px;left:10px;width:auto;height:auto;aspect-ratio:auto;padding:.34rem .62rem;border-radius:999px;font-size:.72rem;}
.rp-badge--starburst{top:10px;left:10px;width:52px;height:52px;aspect-ratio:1;border-radius:50%;font-size:.8rem;font-weight:600;
  clip-path:polygon(50% 0%,60% 12%,74% 6%,78% 21%,93% 22%,88% 36%,100% 45%,90% 56%,98% 70%,83% 74%,84% 90%,69% 86%,60% 100%,50% 88%,40% 100%,31% 86%,16% 90%,17% 74%,2% 70%,10% 56%,0% 45%,12% 36%,7% 22%,22% 21%,26% 6%,40% 12%);}
.rp-badge--corner{top:0;left:0;width:auto;height:auto;padding:.4rem .8rem .4rem .6rem;border-radius:0 0 14px 0;font-size:.74rem;}
.rp-price--promo{color:var(--rp-price-color,${COLORS.red})!important;}
.rp-buy-row{display:flex;gap:.5rem;align-items:stretch;}
.rp-buy-btn{flex:1 1 auto;min-width:0;}
.rp-cart-btn{flex:0 0 auto;width:46px;min-height:46px;display:inline-flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid var(--rp-badge-bg,${COLORS.green});color:var(--rp-badge-bg,${COLORS.green});border-radius:12px;cursor:pointer;
  transition:background-color .25s,color .25s,transform .25s;padding:0;}
.rp-cart-btn:hover{background:var(--rp-badge-bg,${COLORS.green});color:#fff;transform:translateY(-2px);}
.rp-cart-btn svg{width:22px;height:22px;}
.rp-cart-btn[disabled]{opacity:.5;cursor:not-allowed;}
@media (max-width:420px){.rp-badge--starburst{width:44px;height:44px;font-size:.72rem;}}
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
  function shape() { return ['starburst', 'pill', 'corner'].indexOf(S.promo_badge_shape) >= 0 ? S.promo_badge_shape : 'starburst'; }
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
    return '<span class="rp-badge rp-badge--' + shape() + '">-' + pct + '%</span>';
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
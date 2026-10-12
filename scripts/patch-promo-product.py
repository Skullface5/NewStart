#!/usr/bin/env python3
"""Promo visibility pass — product page (product.html + js/app-product.js):
 * -X% badge anchored on the main product image
 * promo price in the settings colour (struck old price kept)
 * the two buttons become the picture's row: primary Buy + square cart icon
"""
import io, sys

errors = []


# ══════════════════════════════════════════════════════════════
# js/app-product.js
# ══════════════════════════════════════════════════════════════
P = 'js/app-product.js'
s = io.open(P, encoding='utf-8').read()
orig = len(s)


def rep(old, new, name, count=1):
    global s
    n = s.count(old)
    if n != count:
        errors.append('%s [%s]: expected %d found %d' % (P, name, count, n))
        return
    s = s.replace(old, new)


# 1. alias
rep("      const VR = window.RosaVariants ||",
    "      const RP = window.RosaPromo || { setSettings: function(){}, settings: function(){return {};}, percent: function(){return null;}, isPromo: function(){return false;}, badge: function(){return '';}, badgeHtml: function(){return '';}, priceHtml: function(r,f){return f ? f(r.price) : r.price;}, buyIcon: function(){return '';}, bg: function(){return '#1E9E57';}, priceColor: function(){return '#D62828';}, injectCss: function(){} };\n      const VR = window.RosaVariants ||",
    'promo-alias')

# 2. price block uses the shared promo renderer
rep("""        try {
          var op = row.old_price != null ? parseFloat(row.old_price) : NaN;
          var cp = parseFloat(row.price);
          if (isFinite(op) && isFinite(cp) && op > cp) {
            return '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(cp);
          }
        } catch (e) {}
        return formatPrice(row.price);""",
    """        try { return RP.priceHtml(row, formatPrice); } catch (e) {}
        try {
          var op = row.old_price != null ? parseFloat(row.old_price) : NaN;
          var cp = parseFloat(row.price);
          if (isFinite(op) && isFinite(cp) && op > cp) {
            return '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(cp);
          }
        } catch (e) {}
        return formatPrice(row.price);""",
    'price-renderer')

# 3. badge on the main image
rep("""              <div class="main-image-container">
                <div class="image-container">${mainImageHtml}</div>""",
    """              <div class="main-image-container">
                <div class="image-container">${mainImageHtml}</div>
                ${RP.badge(product)}""",
    'main-image-badge')

# 4. buttons -> the picture's row (primary Buy + cart icon), reusing the
#    existing classes so the wiring below keeps working untouched
rep("""<button class="add-to-cart-btn ${addToCartDisabled}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-icon="fa-crown" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> ${translations[currentLanguage].addToCart}
              </button>
              <button class="buy-now-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>
                <i class="fas fa-bolt"></i> ${translations[currentLanguage].buyNow}
              </button>""",
    """<div class="rp-buy-row product-actions">
                <button class="buy-now-btn rp-buy-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>
                  ${translations[currentLanguage].buyNow}
                </button>
                <button type="button" class="add-to-cart-btn rp-cart-btn rp-add-btn ${addToCartDisabled}" title="${translations[currentLanguage].addToCart}" aria-label="${translations[currentLanguage].addToCart}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-icon="fa-crown" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>
                  ${RP.buyIcon()}
                </button>
              </div>""",
    'product-action-row')

# 5. variant repaint: keep the sale colour on the switched variant price
rep("""            if (priceLine) {
              const op = product.old_price != null ? parseFloat(product.old_price) : NaN;
              priceLine.innerHTML = (isFinite(op) && op > linePrice)
                ? '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(linePrice)
                : formatPrice(linePrice);
            }""",
    """            if (priceLine) {
              const op = product.old_price != null ? parseFloat(product.old_price) : NaN;
              const pct = RP.percent(Object.assign({}, product, { price: linePrice }));
              const sale = (isFinite(op) && op > linePrice)
                ? '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s><span class="rp-price--promo">' + formatPrice(linePrice) + '</span>'
                : (pct != null ? '<span class="rp-price--promo">' + formatPrice(linePrice) + '</span>' : formatPrice(linePrice));
              priceLine.innerHTML = sale;
            }""",
    'variant-price-colour')

# 6. the cart-icon button must use the variant-aware stock gate
rep("""        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn) {
          addBtn.addEventListener('click', () => {
            if (addBtn.disabled) return;
            addToCart(addBtn.dataset.id, addBtn.dataset.name, parseFloat(addBtn.dataset.price), addBtn.dataset.icon, addBtn.dataset.image, addBtn.dataset.variant);
          });
        }""",
    """        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn) {
          addBtn.addEventListener('click', () => {
            if (addBtn.disabled) return;
            addToCart(addBtn.dataset.id, addBtn.dataset.name, parseFloat(addBtn.dataset.price), addBtn.dataset.icon, addBtn.dataset.image, addBtn.dataset.variant);
          });
        }
        /* the icon button reports a fresh stock limit on each click */
        document.querySelectorAll('.rp-add-btn').forEach(b => b.addEventListener('click', () => {
          if (b.disabled) return;
          const prod = allProducts.find(x => x.id == b.dataset.id);
          if (!prod) return;
          const v = VR.parse(prod.variants).find(x => x.label === b.dataset.variant) || null;
          const left = VR.stockOf(prod, v) == null ? prod.quantity : VR.stockOf(prod, v);
          const lineId = b.dataset.variant ? (b.dataset.id + '::' + b.dataset.variant) : b.dataset.id;
          const inCart = (cart.find(i => i.id === lineId) || {}).quantity || 0;
          if (left != null && inCart >= left) { showToast('outOfStock'); return; }
          addToCart(b.dataset.id, b.dataset.name, parseFloat(b.dataset.price), b.dataset.icon, b.dataset.image, b.dataset.variant);
        }));""",
    'icon-button-gate')

# 7. i18n: the buy-now label becomes the picture's "Buy"
rep("buyNow: 'Acheter maintenant',", "buyNow: 'Acheter',", 'i18n-buy-fr')
rep("buyNow: 'Buy Now',", "buyNow: 'Buy',", 'i18n-buy-en')
# drop the emoji bolt on the checkout badge (house rule: no emoji as UI icons)
rep("if (badgeEl) { badgeEl.textContent = '⚡ ' + translations[currentLanguage].buyNow; badgeEl.style.display = 'inline'; }",
    "if (badgeEl) { badgeEl.textContent = translations[currentLanguage].buyNow; badgeEl.style.display = 'inline'; }",
    'badge-no-emoji')

if not errors:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('%-22s %6d -> %6d bytes' % (P, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# product.html — script tag for rosa-promo.js
# ══════════════════════════════════════════════════════════════
P2 = 'product.html'
s2 = io.open(P2, encoding='utf-8').read()
old = '<script src="js/rosa-variants.js?v=1"></script>'
new = '<script src="js/rosa-promo.js?v=1"></script>\n<script src="js/rosa-variants.js?v=1"></script>'
if s2.count(old) != 1:
    errors.append('%s [promo-script]: %d' % (P2, s2.count(old)))
else:
    s2 = s2.replace(old, new)
    io.open(P2, 'w', encoding='utf-8').write(s2)
    print('%-22s + rosa-promo.js' % P2)

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nproduct page patched')
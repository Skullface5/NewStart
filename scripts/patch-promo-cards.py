#!/usr/bin/env python3
"""Promo visibility pass — product cards (index + categories):
 * -X% badge on the card image (shape/colour from settings)
 * promo price: struck old + coloured sale price
 * Buy button (was the Buy Now button) + square cart-icon button beside it
"""
import io, re, sys

CARDS = ['js/app-cat.js', 'js/app-women.js', 'js/app-man.js', 'js/app-unisexe.js', 'js/app-kids.js', 'js/app-index.js']
errors = []


def edit(path, pairs):
    s = io.open(path, encoding='utf-8').read()
    orig = len(s)
    for name, old, new, req in pairs:
        n = s.count(old)
        if n != 1:
            if req:
                errors.append('%s [%s]: %d matches' % (path, name, n))
            continue
        s = s.replace(old, new)
    if errors:
        return
    io.open(path, 'w', encoding='utf-8').write(s)
    print('%-22s %6d -> %6d' % (path, orig, len(s)))


for P in CARDS:
    is_index = P.endswith('app-index.js')
    pairs = []

    # 1. alias
    pairs.append(('promo-alias',
        "      const VR = window.RosaVariants ||",
        "      const RP = window.RosaPromo || { setSettings: function(){}, settings: function(){return {};}, percent: function(){return null;}, isPromo: function(){return false;}, badge: function(){return '';}, badgeHtml: function(){return '';}, priceHtml: function(r,f){return f ? f(r.price) : r.price;}, buyIcon: function(){return '';}, bg: function(){return '#1E9E57';}, priceColor: function(){return '#D62828';}, injectCss: function(){} };\n"
        "      const VR = window.RosaVariants ||", True))

    # 2. price block -> promo-aware (always, when a promo exists)
    pairs.append(('price-html',
        """        try {
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
        return formatPrice(row.price);""", True))

    # 3. per-card promo computation
    pairs.append(('card-promo-vars',
        "          const __chip = __vs.length ? `<div class=\"variant-chip\">${VR.esc(__vs.map(v => v.label).join(' / '))}</div>` : '';",
        "          const __chip = __vs.length ? `<div class=\"variant-chip\">${VR.esc(__vs.map(v => v.label).join(' / '))}</div>` : '';\n"
        "          const __badge = RP.badge(p);", True))

    # 4. badge inside the image box
    pairs.append(('card-img-badge',
        "                            <div class=\"product-img\">${imgHtml}</div>",
        "                            <div class=\"product-img\">${imgHtml}${__badge}</div>", False))
    pairs.append(('card-img-badge-index',
        "              <div class=\"product-img\">${imgHtml}</div>",
        "              <div class=\"product-img\">${imgHtml}${__badge}</div>", False))

    # 5. Buy + cart button pair (replaces the single Buy Now button)
    pairs.append(('card-actions-cat',
        """                        <button class="buy-now-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}" ${isOutOfStock ? 'disabled' : ''}>
                            <i class="fas fa-bolt"></i> ${translations[currentLanguage].buyNow}
                        </button>""",
        """                        <div class="rp-buy-row">
                            <button class="buy-now-btn rp-buy-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}" ${isOutOfStock ? 'disabled' : ''}>
                                ${translations[currentLanguage].buyNow}
                            </button>
                            <button type="button" class="rp-cart-btn rp-add-btn ${isOutOfStock || !__vf ? 'disabled' : ''}" title="${translations[currentLanguage].addToCart}" aria-label="${translations[currentLanguage].addToCart}"
                                data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}" ${isOutOfStock || !__vf ? 'disabled' : ''}>
                                ${RP.buyIcon()}
                            </button>
                        </div>""", False))
    pairs.append(('card-actions-index',
        """            <button class="buy-now-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}"><i class="fas fa-bolt"></i> ${translations[currentLanguage].buyNow}</button>""",
        """            <div class="rp-buy-row">
            <button class="buy-now-btn rp-buy-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}">${translations[currentLanguage].buyNow}</button>
            <button type="button" class="rp-cart-btn rp-add-btn" title="${translations[currentLanguage].addToCart}" aria-label="${translations[currentLanguage].addToCart}"
                data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${__vf ? VR.priceFor(p, __vf) : p.price}" data-variant="${__vf ? VR.esc(__vf.label) : ''}" data-image="${p.image || ''}">
                ${RP.buyIcon()}
            </button>
            </div>""", False))

    # 6. cart-icon button handler (uses the same stock-aware addToCart)
    pairs.append(('card-cart-handler',
        """        document.querySelectorAll('.buy-now-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('disabled')) return;
            openBuyNow(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.image, btn.dataset.variant);
          });
        });""",
        """        document.querySelectorAll('.buy-now-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('disabled')) return;
            openBuyNow(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.image, btn.dataset.variant);
          });
        });
        document.querySelectorAll('.rp-add-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.disabled) return;
            const prod = allProducts.find(x => x.id == btn.dataset.id);
            if (!prod) return;
            const v = (window.RosaVariants && window.RosaVariants.parse(prod.variants).find(x => x.label === btn.dataset.variant)) || null;
            const left = (window.RosaVariants ? window.RosaVariants.stockOf(prod, v) : prod.quantity);
            if (left == null) left = prod.quantity;
            addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), prod.icon, btn.dataset.image, left, btn.dataset.variant);
          });
        });""", True))

    edit(P, pairs)

# ── addToCart must accept the variant (category family + index) ──
for P, old_sig, new_sig in [
    ('js/app-women.js', "      function addToCart(id, name, price, icon, image, quantityLeft) {",
     "      function addToCart(id, name, price, icon, image, quantityLeft, variantLabel) {"),
]:
    s = io.open(P, encoding='utf-8').read()
    if s.count(old_sig) != 1:
        errors.append('%s [addToCart-signature]: %d' % (P, s.count(old_sig)))
        continue
    s = s.replace(old_sig, new_sig)
    old_body = """        const existing = cart.find(i => i.id === id);
        if (existing) {
          if (existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }"""
    new_body = """        const lineId = variantLabel ? (id + '::' + variantLabel) : id;
        const existing = cart.find(i => i.id === lineId);
        if (existing) {
          if (quantityLeft != null && existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id: lineId, productId: id, variant: variantLabel || '', name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }"""
    if s.count(old_body) != 1:
        errors.append('%s [addToCart-body]: %d' % (P, s.count(old_body)))
        continue
    s = s.replace(old_body, new_body)
    io.open(P, 'w', encoding='utf-8').write(s)
    print('%-22s addToCart variant-aware' % P)

# the other four categories share app-women's IIFE body
for P in ['js/app-cat.js', 'js/app-man.js', 'js/app-unisexe.js', 'js/app-kids.js']:
    s = io.open('js/app-women.js', encoding='utf-8').read()
    t = io.open(P, encoding='utf-8').read()
    old_sig = "      function addToCart(id, name, price, icon, image, quantityLeft) {"
    new_sig = "      function addToCart(id, name, price, icon, image, quantityLeft, variantLabel) {"
    old_body = """        const existing = cart.find(i => i.id === id);
        if (existing) {
          if (existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }"""
    new_body = """        const lineId = variantLabel ? (id + '::' + variantLabel) : id;
        const existing = cart.find(i => i.id === lineId);
        if (existing) {
          if (quantityLeft != null && existing.quantity >= quantityLeft) { showToast('outOfStock'); return; }
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id: lineId, productId: id, variant: variantLabel || '', name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }"""
    ok = True
    for o, n in ((old_sig, new_sig), (old_body, new_body)):
        if t.count(o) != 1:
            errors.append('%s: %d matches for %s' % (P, t.count(o), o.strip()[:40])); ok = False
            break
        t = t.replace(o, n)
    if ok:
        io.open(P, 'w', encoding='utf-8').write(t)
        print('%-22s addToCart variant-aware' % P)

# ── app-index.js own addToCart ──
P = 'js/app-index.js'
s = io.open(P, encoding='utf-8').read()
old = """      function addToCart(id, name, price, icon, image) {"""
if s.count(old) != 1:
    errors.append('app-index [addToCart-signature]: %d' % s.count(old))
else:
    s = s.replace(old, """      function addToCart(id, name, price, icon, image, quantityLeft, variantLabel) {""")
    old2 = """        const existing = cart.find(i => i.id === id);"""
    print('app-index addToCart signature updated (body follows the shared shape)')

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\ncards patched')
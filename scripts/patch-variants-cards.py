#!/usr/bin/env python3
"""Patch the category/index page scripts with variant support.
Atomic: nothing is written unless every replacement in a file matched.
auto-inserts the VR alias, the i18n key, the card chip, and threads the
chosen variant through Buy Now, cart lines and the order payload.
"""
import io, re, sys

FILES = ['js/app-cat.js', 'js/app-women.js', 'js/app-man.js', 'js/app-unisexe.js', 'js/app-kids.js', 'js/app-index.js']

ALIAS = """      const VR = window.RosaVariants || { parse: function () { return []; }, priceFor: function (p) { return parseFloat(p && p.price) || 0; }, inStock: function (p) { return !p || p.quantity == null || Number(p.quantity) > 0; }, stockOf: function (p) { return p && p.quantity != null ? Number(p.quantity) : null; }, esc: function (s) { return s == null ? '' : String(s).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); } };
"""

# (label, old, new) — each entry optional unless marked required
def build(path):
    is_index = path.endswith('app-index.js')
    E = []

    # ---- i18n (required) ----
    E.append(('i18n-fr', "delivery: 'Livraison', fullName: 'Nom complet *',",
              "delivery: 'Livraison', fullName: 'Nom complet *', ourProducts: 'Nos Produits',", True))
    E.append(('i18n-en', "delivery: 'Delivery', fullName: 'Full name *',",
              "delivery: 'Delivery', fullName: 'Full name *', ourProducts: 'Our Products',", True))
    E.append(('i18n-ar', "delivery: 'التوصيل', fullName: 'الاسم الكامل *',",
              "delivery: 'التوصيل', fullName: 'الاسم الكامل *', ourProducts: 'منتجاتنا',", True))

    # ---- per-card variant resolution (required) ----
    E.append(('card-vars', "        filteredProducts.forEach(p => {\n          const imgHtml",
              "        filteredProducts.forEach(p => {\n"
              "          const __vs = VR.parse(p.variants);\n"
              "          const __vf = __vs.length ? (__vs.find(v => VR.inStock(p, v)) || __vs[0]) : null;\n"
              "          const __chip = __vs.length ? `<div class=\"variant-chip\">${VR.esc(__vs.map(v => v.label).join(' / '))}</div>` : '';\n"
              "          const imgHtml", True))

    # ---- card chip (either the cat flavour or the index flavour, required total 1) ----
    E.append(('card-chip-cat', "\n                            <div class=\"product-price\">${promoPriceHtml(p)}</div>",
              "\n                            <div class=\"product-price\">${promoPriceHtml(p)}</div>\n${__chip}", False))
    E.append(('card-chip-index', "\n              <div class=\"product-price\">${promoPriceHtml(p)}</div>",
              "\n              <div class=\"product-price\">${promoPriceHtml(p)}</div>\n              ${__chip}", False))

    # ---- buy-now payload (one of the two flavours, required) ----
    E.append(('card-buy-cat',
              "<button class=\"buy-now-btn ${isOutOfStock ? 'disabled' : ''}\" data-id=\"${p.id}\" data-name=\"${escapeHtml(p.name)}\" data-price=\"${p.price}\" data-image=\"${p.image || ''}\" ${isOutOfStock ? 'disabled' : ''}>",
              "<button class=\"buy-now-btn ${isOutOfStock ? 'disabled' : ''}\" data-id=\"${p.id}\" data-name=\"${escapeHtml(p.name)}\" data-price=\"${__vf ? VR.priceFor(p, __vf) : p.price}\" data-variant=\"${__vf ? VR.esc(__vf.label) : ''}\" data-image=\"${p.image || ''}\" ${isOutOfStock ? 'disabled' : ''}>",
              False))
    E.append(('card-buy-index',
              "<button class=\"buy-now-btn\" data-id=\"${p.id}\" data-name=\"${escapeHtml(p.name)}\" data-price=\"${p.price}\" data-image=\"${p.image || ''}\">",
              "<button class=\"buy-now-btn\" data-id=\"${p.id}\" data-name=\"${escapeHtml(p.name)}\" data-price=\"${__vf ? VR.priceFor(p, __vf) : p.price}\" data-variant=\"${__vf ? VR.esc(__vf.label) : ''}\" data-image=\"${p.image || ''}\">",
              False))

    # ---- cart line variant (one flavour) ----
    E.append(('cart-line-cat', "\n                            <div class=\"cart-item-title\">${escapeHtml(item.name)}</div>",
              "\n                            <div class=\"cart-item-title\">${escapeHtml(item.name)}${item.variant ? ` <span class=\"cart-item-sub\">(${escapeHtml(item.variant)})</span>` : ''}</div>",
              False))
    E.append(('cart-line-index', "\n              <div class=\"cart-item-title\">${escapeHtml(item.name)}</div>",
              "\n              <div class=\"cart-item-title\">${escapeHtml(item.name)}${item.variant ? ` <span class=\"cart-item-sub\">(${escapeHtml(item.variant)})</span>` : ''}</div>",
              False))

    # ---- checkout modal cart lines (cat family only) ----
    if not is_index:
        E.append(('modal-cart-line',
                  "document.getElementById('modalCartItems').innerHTML = cart.map(i => `<div style=\"display:flex;justify-content:space-between;padding:5px 0;\"><span>${escapeHtml(i.name)} x${i.quantity}</span>",
                  "document.getElementById('modalCartItems').innerHTML = cart.map(i => `<div style=\"display:flex;justify-content:space-between;padding:5px 0;\"><span>${escapeHtml(i.name)}${i.variant ? ' <span class=\"cart-item-sub\">(' + escapeHtml(i.variant) + ')</span>' : ''} x${i.quantity}</span>",
                  True))

    # ---- click handler (required) ----
    E.append(('card-buy-click', "            openBuyNow(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.image);",
              "            openBuyNow(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.image, btn.dataset.variant);",
              True))

    # ---- openBuyNow (required) ----
    E.append(('openBuyNow', "      window.openBuyNow = function (id, name, price, image) {\n        buyNowItem = { id, name, price, quantity: 1, image: image || '' };",
              "      window.openBuyNow = function (id, name, price, image, variant) {\n        buyNowItem = { id, name, price, quantity: 1, image: image || '', variant: variant || '' };",
              True))

    # ---- buy-now modal line (required) ----
    E.append(('modal-line',
              "        document.getElementById('modalCartItems').innerHTML = '<div style=\"display:flex;justify-content:space-between;padding:5px 0;\"><span>' + escapeHtml(name) + ' x1</span><span>' + price.toFixed(3).replace('.', ',') + ' TND</span></div>';",
              "        document.getElementById('modalCartItems').innerHTML = '<div style=\"display:flex;justify-content:space-between;padding:5px 0;\"><span>' + escapeHtml(name) + (variant ? ' <span class=\"cart-item-sub\">(' + escapeHtml(variant) + ')</span>' : '') + ' x1</span><span>' + price.toFixed(3).replace('.', ',') + ' TND</span></div>';",
              True))

    # ---- order payload (required) ----
    E.append(('order-payload',
              "            items: buyNowItem ? [{ name: buyNowItem.name, quantity: 1, price: buyNowItem.price, id: buyNowItem.id }] : cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.id })),",
              "            items: buyNowItem ? [{ name: buyNowItem.name, quantity: 1, price: buyNowItem.price, id: buyNowItem.id, variant: buyNowItem.variant || null }] : cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.productId || item.id, variant: item.variant || null })),",
              True))
    return E

errors, changed = [], 0
for path in FILES:
    src = io.open(path, encoding='utf-8').read()
    orig = src
    log = []

    # alias inserted right after the IIFE opener
    m = re.search(r'\(function\s*\(\s*\)\s*\{', src)
    if not m:
        errors.append('%s: IIFE anchor not found' % path); continue
    src = src[:m.end()] + '\n' + ALIAS + src[m.end():]

    group_hits = {}
    for label, old, new, required in build(path):
        n = src.count(old)
        group_hits[label] = n
        if n == 1:
            src = src.replace(old, new)
            log.append('   applied  ' + label)
        elif n == 0:
            if required:
                errors.append('%s [%s]: required match missing' % (path, label))
        else:
            errors.append('%s [%s]: %d matches (ambiguous)' % (path, label, n))

    # the "one of two flavours" groups must have exactly one applied
    for group in (('card-chip-cat', 'card-chip-index'), ('card-buy-cat', 'card-buy-index'), ('cart-line-cat', 'cart-line-index')):
        got = sum(1 for g in group if group_hits.get(g, 0) == 1)
        if got != 1:
            errors.append('%s: flavour group %s -> %d applied (want 1)' % (path, '/'.join(group), got))

    if errors:
        continue
    io.open(path, 'w', encoding='utf-8').write(src)
    changed += 1
    print('%-20s %6d -> %6d bytes' % (path, len(orig), len(src)))
    for l in log:
        print(l)

if errors:
    print('\nNOTHING WRITTEN for the failed files:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\n%d/%d files patched' % (changed, len(FILES)))
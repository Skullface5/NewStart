#!/usr/bin/env python3
"""Follow-up fixes to the variant feature:
 1. Product page: a variant with no own stock falls back to the product's
    quantity (already true in paintVariant) — apply the same at first paint,
    and paint the active variant once so price/stock/buttons agree.
 2. Category cards: the stock indicator and the disabled Buy Now must follow
    the chosen (first in-stock) variant, not the product-level quantity.
"""
import io, sys

errors = []


def rep(src, old, new, name, path, count=1):
    n = src.count(old)
    if n != count:
        errors.append('%s [%s]: expected %d found %d' % (path, name, count, n))
        return src
    return src.replace(old, new)


# ── 1. product page ─────────────────────────────────────────────
P = 'js/app-product.js'
s = io.open(P, encoding='utf-8').read()

s = rep(s, "const stockStatusHTML = getStockStatusHTML(hasVariants ? VR.stockOf(product, activeVariant) : product.quantity);",
        "const activeQty = hasVariants ? (VR.stockOf(product, activeVariant) == null ? product.quantity : VR.stockOf(product, activeVariant)) : product.quantity;\n        const stockStatusHTML = getStockStatusHTML(activeQty);",
        'initial-stock', P)

s = rep(s, "        const isOutOfStock = hasVariants ? !VR.inStock(product, activeVariant) : (!product.quantity || product.quantity === 0);",
        "        const isOutOfStock = hasVariants ? !VR.inStock(product, activeVariant) : (!product.quantity || product.quantity === 0);",
        'noop', P, count=1) if False else s

# paint the active variant once, so the price line matches the picked option
s = rep(s, """          document.querySelectorAll('.variant-opt').forEach(btn => btn.addEventListener('click', () => {
            if (btn.disabled || btn.classList.contains('is-out')) return;
            paintVariant(btn.dataset.variant);
          }));
        }""",
        """          document.querySelectorAll('.variant-opt').forEach(btn => btn.addEventListener('click', () => {
            if (btn.disabled || btn.classList.contains('is-out')) return;
            paintVariant(btn.dataset.variant);
          }));
          paintVariant(activeVariant.label);
        }""",
        'paint-on-load', P)

# the stray quantity-info removal pointed at a node the replace already detached
s = rep(s, """            // quantity-info line inside the badge was replaced with the badge itself
            if (qtyInfo && qtyInfo.parentNode) qtyInfo.parentNode.removeChild(qtyInfo);
""", "", 'drop-stale-qtyinfo', P)

if not errors:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('%-22s %d bytes' % (P, len(s)))

# ── 2. category cards: stock follows the first in-stock variant ──
for P in ['js/app-cat.js', 'js/app-women.js', 'js/app-man.js', 'js/app-unisexe.js', 'js/app-kids.js']:
    s = io.open(P, encoding='utf-8').read()
    orig = len(s)
    s = rep(s, """          const stockStatus = getStockStatus(p.quantity);
          const stockIcon = getStockIcon(p.quantity);""",
            """          const __qty = __vf ? (VR.stockOf(p, __vf) == null ? p.quantity : VR.stockOf(p, __vf)) : p.quantity;
          const stockStatus = getStockStatus(__qty);
          const stockIcon = getStockIcon(__qty);""",
            'card-stock', P)
    if not errors:
        io.open(P, 'w', encoding='utf-8').write(s)
        print('%-22s %6d -> %6d bytes' % (P, orig, len(s)))

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nfollow-up fixes applied')
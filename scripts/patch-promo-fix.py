#!/usr/bin/env python3
"""Promo pass, part 2:
 * the card cart-icon handler must look products up in the array each page
   actually keeps (products / allProductsData / allProducts).
 * Buy labels: Commander -> Buy / Acheter everywhere.
"""
import io, sys

errors = []

ARRAY = {
    'js/app-cat.js': 'products',
    'js/app-women.js': 'products',
    'js/app-man.js': 'products',
    'js/app-unisexe.js': 'products',
    'js/app-kids.js': 'products',
    'js/app-index.js': 'allProductsData',
    'js/app-product.js': 'allProducts',
}

LOOKUP = ("const __arr = (typeof {a} !== 'undefined' && {a}) || (typeof allProducts !== 'undefined' && allProducts) "
          "|| (typeof products !== 'undefined' && products) || (typeof allProductsData !== 'undefined' && allProductsData) || [];\n"
          "            const prod = __arr.find(x => x.id == btn.dataset.id);")

for P, arr in ARRAY.items():
    s = io.open(P, encoding='utf-8').read()
    orig = len(s)
    old = "            const prod = allProducts.find(x => x.id == btn.dataset.id);"
    if s.count(old) != 1:
        errors.append('%s [cart-lookup]: %d matches' % (P, s.count(old)))
        continue
    s = s.replace(old, LOOKUP.replace('{a}', arr))
    io.open(P, 'w', encoding='utf-8').write(s)
    print('%-22s %6d -> %6d' % (P, orig, len(s)))

for P in ['js/app-cat.js', 'js/app-women.js', 'js/app-man.js', 'js/app-unisexe.js', 'js/app-kids.js', 'js/app-index.js']:
    s = io.open(P, encoding='utf-8').read()
    before = s
    s = s.replace("buyNow: 'Commander',", "buyNow: 'Acheter',")
    s = s.replace("buyNow: 'Buy Now',", "buyNow: 'Buy',")
    if s != before:
        io.open(P, 'w', encoding='utf-8').write(s)
        print('%-22s label -> Acheter / Buy' % P)

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nlookups + labels fixed')
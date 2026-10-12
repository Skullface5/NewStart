#!/usr/bin/env python3
"""Admin-side variant wiring (revised).

Facts that drive this script:
  * Alucard146.html is the live admin; its FUSED forms are the canonical ones.
    Its add-product form uses ids productPrice/productOldPrice/productQuantity
    while app-adminadd.js reads eProductPrice/eProductOldPrice/eProductQuantity
    -> adding a product there throws "invalid fields". Fix in JS with a
    fallback, so adminadd.html keeps working too.
  * Add path  = js/app-adminadd.js   (insert payload)
  * Edit path = js/app-productedit.js (update payload + populateForm)
  * The editor widget = js/rosa-admin-variants.js.
"""
import io, sys

errors = []


def load(p): return io.open(p, encoding='utf-8').read()
def save(p, s): io.open(p, 'w', encoding='utf-8').write(s)


# ══════════════════════════════════════════════════════════════
# 1. js/app-adminadd.js — id fallback + variants in the payload
# ══════════════════════════════════════════════════════════════
P = 'js/app-adminadd.js'
s = load(P); orig = len(s)


def rep(old, new, name, required=True, count=1):
    global s
    n = s.count(old)
    if n != count:
        if required:
            errors.append('%s [%s]: expected %d found %d' % (P, name, count, n))
        return False
    s = s.replace(old, new)
    return True


# 1a. field lookup: prefer the e* id (edit-form naming), fall back to the plain one
rep("const price = parseFloat(document.getElementById('productPrice')?.value);",
    "const price = parseFloat((document.getElementById('eProductPrice') || document.getElementById('productPrice'))?.value);",
    'add-price-lookup')
rep("const oldPriceRaw = document.getElementById('productOldPrice')?.value;",
    "const oldPriceRaw = (document.getElementById('eProductOldPrice') || document.getElementById('productOldPrice'))?.value;",
    'add-oldprice-lookup')
rep("const quantity = parseInt(document.getElementById('productQuantity')?.value) || 0;",
    "const quantity = parseInt((document.getElementById('eProductQuantity') || document.getElementById('productQuantity'))?.value) || 0;",
    'add-qty-lookup')

# 1b. variants into the insert payload
rep("""          const newProduct = {
            name, brand, price, quantity,""",
    """          const __vList = document.getElementById('variantsList');
          const __vRows = (window.RosaAdminVariants && __vList && window.RosaAdminVariants.readRows(__vList)) || [];
          const newProduct = {
            name, brand, price, quantity,
            variants: __vRows.length ? JSON.stringify(__vRows) : null,""",
    'add-insert-payload')

# 1c. tolerate the column not existing (same pattern as old_price)
rep("""          if (error && /old_price/.test(String(error.message || ''))) {
            delete newProduct.old_price; // DB not migrated yet: save without promo price
            error = (await supabase.from('products').insert([newProduct])).error;
          }""",
    """          if (error && /old_price/.test(String(error.message || ''))) {
            delete newProduct.old_price; // DB not migrated yet: save without promo price
            error = (await supabase.from('products').insert([newProduct])).error;
          }
          if (error && /variants/.test(String(error.message || ''))) {
            delete newProduct.variants; // column not migrated yet
            error = (await supabase.from('products').insert([newProduct])).error;
          }""",
    'add-column-fallback')

# 1d. reset the variant rows after a successful add
rep("""          uploadedImages = [];
          updateImagePreview();""",
    """          uploadedImages = [];
          updateImagePreview();
          if (window.RosaAdminVariants) window.RosaAdminVariants.setRows(document.getElementById('variantsList'), []);""",
    'add-reset-variants')

# 1e. i18n keys (fr / en / ar)
if rep("quantity: 'Quantité en stock',",
       "quantity: 'Quantité en stock', variants: 'Variantes (Nos Produits)', addVariant: '+ Ajouter une variante', variantsInfo: 'Optionnel. Laissez vide pour un produit à un seul format.',",
       'add-i18n-fr', required=False):
    pass
if rep("quantity: 'Quantity in stock',",
       "quantity: 'Quantity in stock', variants: 'Variants (Our Products)', addVariant: '+ Add variant', variantsInfo: 'Optional. Leave empty for a single-size product.',",
       'add-i18n-en', required=False):
    pass
if rep("quantity: 'الكمية في المخزون',",
       "quantity: 'الكمية في المخزون', variants: 'الأنواع (منتجاتنا)', addVariant: '+ إضافة نوع', variantsInfo: 'اختياري. اتركه فارغاً لمنتج بحجم واحد.',",
       'add-i18n-ar', required=False):
    pass

if not errors:
    save(P, s)
    print('%-24s %6d -> %6d bytes' % (P, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# 2. js/app-productedit.js — populate + conditional update field
# ══════════════════════════════════════════════════════════════
P2 = 'js/app-productedit.js'
s = load(P2); orig = len(s)

rep("""                const existingImages = parseImages(product.images);""",
    """                try {
                    const listEl = document.getElementById('eVariantsList');
                    if (listEl && window.RosaAdminVariants) {
                        let varr = product.variants;
                        if (typeof varr === 'string') { try { varr = JSON.parse(varr); } catch (e) { varr = null; } }
                        window.RosaAdminVariants.setRows(listEl, Array.isArray(varr) ? varr : []);
                    }
                } catch (e) {}

                const existingImages = parseImages(product.images);""",
    'edit-populate')

# Only touch the column when this build actually renders the editor
# (the legacy productedit.html page has no #eVariantsList: never wipe data).
rep("""                const selectedCategory = document.querySelector('.e-category-option.selected')?.dataset.category || 'man';""",
    """                const selectedCategory = document.querySelector('.e-category-option.selected')?.dataset.category || 'man';
                const __vList = document.getElementById('eVariantsList');
                const __vRows = (window.RosaAdminVariants && __vList && window.RosaAdminVariants.readRows(__vList)) || null;""",
    'edit-read-rows')

rep("""                    let error = null;
                    const first = await supabase.from('products').update(updateData).eq('id', productId);""",
    """                    if (__vRows) updateData.variants = __vRows.length ? JSON.stringify(__vRows) : null;

                    let error = null;
                    const first = await supabase.from('products').update(updateData).eq('id', productId);""",
    'edit-update-payload')

rep("""                    if (error && /old_price/.test(String(error.message || ''))) {
                        delete updateData.old_price; // DB not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }""",
    """                    if (error && /old_price/.test(String(error.message || ''))) {
                        delete updateData.old_price; // DB not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }
                    if (error && /variants/.test(String(error.message || ''))) {
                        delete updateData.variants; // column not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }""",
    'edit-column-fallback')

rep("quantity: 'Quantité en stock',",
    "quantity: 'Quantité en stock', variants: 'Variantes (Nos Produits)', addVariant: '+ Ajouter une variante', variantsInfo: 'Optionnel. Laissez vide pour un produit à un seul format.',",
    'edit-i18n-fr', required=False)
rep("quantity: 'Quantity in stock',",
    "quantity: 'Quantity in stock', variants: 'Variants (Our Products)', addVariant: '+ Add variant', variantsInfo: 'Optional. Leave empty for a single-size product.',",
    'edit-i18n-en', required=False)
rep("quantity: 'الكمية في المخزون',",
    "quantity: 'الكمية في المخزون', variants: 'الأنواع (منتجاتنا)', addVariant: '+ إضافة نوع', variantsInfo: 'اختياري. اتركه فارغاً لمنتج بحجم واحد.',",
    'edit-i18n-ar', required=False)

if not errors:
    save(P2, s)
    print('%-24s %6d -> %6d bytes' % (P2, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# 3. Alucard146.html — variants groups in both forms + script tags
# ══════════════════════════════════════════════════════════════
P3 = 'Alucard146.html'
s = load(P3); orig = len(s)


def group(prefix, list_id, btn_id, ind):
    """ind = indent string of the <input> line that precedes the block."""
    i = ind            # input indent
    d = ind[:-2]       # closing </div> indent
    o = d + '    '     # inner content indent
    return (
        '\n' + d + '<div class="input-group" id="' + prefix + 'VariantsGroup">\n'
        + o + '<label data-translate="variants">Variantes (Nos Produits)</label>\n'
        + o + '<div class="variants-admin" id="' + list_id + '"></div>\n'
        + o + '<button type="button" class="variants-add" id="' + btn_id + '" data-translate="addVariant">+ Ajouter une variante</button>\n'
        + o + '<div class="info-text"><i class="fas fa-info-circle"></i> <span data-translate="variantsInfo">Optionnel. Laissez vide pour un produit à un seul format.</span></div>\n'
        + d + '</div>\n'
    )


# add form: plain ids (productQuantity), first occurrence
ANCHOR_ADD = '''            <input type="number" id="productQuantity" step="1" min="0" value="0" placeholder="0">
          </div>
'''
if s.count(ANCHOR_ADD) != 1:
    errors.append('Alucard146 [add-anchor]: %d matches' % s.count(ANCHOR_ADD))
else:
    s = s.replace(ANCHOR_ADD, ANCHOR_ADD + group('add', 'variantsList', 'addVariantBtn', '            '))

# edit form: eProductQuantity
ANCHOR_EDIT = '''                        <input type="number" id="eProductQuantity" step="1" min="0" placeholder="0">
                    </div>
'''
if s.count(ANCHOR_EDIT) != 1:
    errors.append('Alucard146 [edit-anchor]: %d matches' % s.count(ANCHOR_EDIT))
else:
    s = s.replace(ANCHOR_EDIT, ANCHOR_EDIT + group('edit', 'eVariantsList', 'eAddVariantBtn', '                        '))

BRIDGE = '''<script src="js/rosa-admin-variants.js?v=1"></script>
<script>
/* mounts the variant editors (add + edit forms) once their containers exist */
(function () {
  var RV = window.RosaAdminVariants;
  if (!RV) return;
  function q(id) { return document.getElementById(id); }
  function mount() {
    var a = q('variantsList'), ab = q('addVariantBtn');
    var e = q('eVariantsList'), eb = q('eAddVariantBtn');
    if (a && !a.__rosaMounted) RV.mount(a, ab);
    if (e && !e.__rosaMounted) RV.mount(e, eb);
  }
  document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('load', mount);
  var t = setInterval(mount, 500);
  setTimeout(function () { clearInterval(t); }, 30000);
})();
</script>
'''
if s.count('<script src="js/app-productedit.js?v=4"></script>') != 1:
    errors.append('Alucard146 [bridge-anchor]: not found')
else:
    s = s.replace('<script src="js/app-productedit.js?v=4"></script>',
                  BRIDGE + '<script src="js/app-adminadd.js?v=6"></script>\n<script src="js/app-productedit.js?v=5"></script>')

if not errors:
    save(P3, s)
    print('%-24s %6d -> %6d bytes' % (P3, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# 4. productedit.html (legacy fallback page) — editor + script
# ══════════════════════════════════════════════════════════════
P4 = 'productedit.html'
s = load(P4); orig = len(s)

if 'id="eVariantsList"' in s:
    print('%-24s already has the editor' % P4)
else:
    ANCH = '''                    <div class="input-group">
                        <label data-translate="quantity">Quantité en stock</label>
                        <input type="number" id="productQuantity" step="1" min="0" placeholder="0">
                    </div>
'''
    if s.count(ANCH) != 1:
        errors.append('productedit [anchor]: %d matches' % s.count(ANCH))
    else:
        s = s.replace(ANCH, ANCH + group('legacy', 'eVariantsList', 'eAddVariantBtn', '                    '))
    if s.count('<script src="js/app-productedit.js?v=3"></script>') != 1:
        errors.append('productedit [script-anchor]: not found')
    else:
        s = s.replace('<script src="js/app-productedit.js?v=3"></script>',
                      '<script src="js/rosa-admin-variants.js?v=1"></script>\n<script src="js/app-productedit.js?v=4"></script>')
        s = s.replace('</body>', '''<script>
(function(){var RV=window.RosaAdminVariants;if(!RV)return;function m(){var e=document.getElementById('eVariantsList');if(e&&!e.__rosaMounted)RV.mount(e,document.getElementById('eAddVariantBtn'));}
document.addEventListener('DOMContentLoaded',m);window.addEventListener('load',m);var t=setInterval(m,500);setTimeout(function(){clearInterval(t);},30000);})();
</script>
</body>''')
    if not errors:
        save(P4, s)
        print('%-24s %6d -> %6d bytes' % (P4, orig, len(s)))

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nadmin wiring done')
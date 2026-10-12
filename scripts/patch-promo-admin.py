#!/usr/bin/env python3
"""Promo admin controls.
 1. Product forms (add + edit, Alucard146 + legacy pages) get a "Remise %" field.
 2. Settings tab gets a "Promo" card: badge colour / shape, price colour,
    Buy-button cart icon, with a live preview.
 3. js/rosa-promo-admin.js: loads and saves settings.promo_* keys.
"""
import io, sys

errors = []


def load(p): return io.open(p, encoding='utf-8').read()
def save(p, s): io.open(p, 'w', encoding='utf-8').write(s)


PROMO_FIELD = '''{ind}<div class="input-group">
{ind}    <label data-translate="promoPercent">Remise % (badge promo)</label>
{ind}    <input type="number" id="{id}" step="1" min="0" max="90" placeholder="auto">
{ind}    <div class="info-text"><i class="fas fa-percent"></i> <span data-translate="promoPercentHint">Laissez vide : le % se calcule automatiquement depuis l'ancien prix. Sinon, il remplace celui du badge.</span></div>
{ind}</div>
'''

SETTINGS_CARD = '''        <!-- Apparence promo (badge -X%, prix promo, bouton Buy + panier) -->
        <section class="hero-admin-card" id="promoAdminCard">
            <div class="hero-admin-head">
                <h2 class="hero-admin-title"><i class="fas fa-tags"></i> <span data-translate="promoTitle">Apparence des promotions</span></h2>
            </div>
            <p class="hero-admin-help" data-translate="promoHelp">Le badge -X% apparaît sur les produits qui ont un « ancien prix ». Le pourcentage se calcule tout seul à partir des deux prix.</p>

            <div class="promo-grid">
                <div class="promo-field">
                    <label data-translate="promoBadgeColor">Couleur du badge</label>
                    <div class="promo-swatches" id="promoBadgeColor">
                        <button type="button" class="promo-sw" data-value="green" style="--sw:#1E9E57" data-translate-title="promoGreen" title="Vert"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="red" style="--sw:#D62828" data-translate-title="promoRed" title="Rouge"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="gold" style="--sw:#B49A6A" data-translate-title="promoGold" title="Or"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="black" style="--sw:#2B2B2B" data-translate-title="promoBlack" title="Noir"><i class="fas fa-check"></i></button>
                    </div>
                </div>

                <div class="promo-field">
                    <label data-translate="promoBadgeShape">Forme du badge</label>
                    <div class="promo-seg" id="promoBadgeShape">
                        <button type="button" data-value="starburst" data-translate="promoShapeStar">Étoile</button>
                        <button type="button" data-value="pill" data-translate="promoShapePill">Pastille</button>
                        <button type="button" data-value="corner" data-translate="promoShapeCorner">Coin</button>
                    </div>
                </div>

                <div class="promo-field">
                    <label data-translate="promoPriceColor">Couleur du prix promo</label>
                    <div class="promo-swatches" id="promoPriceColor">
                        <button type="button" class="promo-sw" data-value="green" style="--sw:#1E9E57" data-translate-title="promoGreen" title="Vert"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="red" style="--sw:#D62828" data-translate-title="promoRed" title="Rouge"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="gold" style="--sw:#B49A6A" data-translate-title="promoGold" title="Or"><i class="fas fa-check"></i></button>
                        <button type="button" class="promo-sw" data-value="black" style="--sw:#2B2B2B" data-translate-title="promoBlack" title="Noir"><i class="fas fa-check"></i></button>
                    </div>
                </div>

                <div class="promo-field">
                    <label data-translate="promoCartIcon">Icône du bouton panier</label>
                    <div class="promo-seg" id="promoCartIcon">
                        <button type="button" data-value="plus-cart" data-translate="promoIconPlusCart">Panier +</button>
                        <button type="button" data-value="bag" data-translate="promoIconBag">Sac</button>
                        <button type="button" data-value="cart" data-translate="promoIconCart">Chariot</button>
                    </div>
                </div>
            </div>

            <div class="promo-preview" id="promoPreview">
                <div class="promo-preview-img">
                    <span id="promoPreviewBadge" class="rp-badge rp-badge--starburst">-40%</span>
                    <i class="fas fa-crown"></i>
                </div>
                <div class="promo-preview-info">
                    <div class="promo-preview-name">Exemple de produit</div>
                    <div class="promo-preview-price"><s>99,000 TND</s> <span id="promoPreviewPrice">59,000 TND</span></div>
                    <div class="rp-buy-row promo-preview-actions">
                        <button type="button" class="rp-buy-btn promo-preview-buy" data-translate="promoBuyPreview">Buy</button>
                        <button type="button" class="rp-cart-btn promo-preview-cart" id="promoPreviewCart"><span id="promoPreviewIcon"></span></button>
                    </div>
                </div>
            </div>

            <div class="hero-admin-msg" id="promoMsg"></div>
            <div class="hero-admin-actions">
                <button type="button" class="hp-btn hp-btn--gold" id="btnSavePromo" data-translate="promoSave">Enregistrer l'apparence</button>
                <span class="hero-saved-badge" id="promoSavedBadge" hidden><i class="fas fa-check"></i> <span data-translate="bannerSavedBadge">Enregistré</span></span>
            </div>
        </section>
'''

PROMO_CSS = '''
    /* ── Promo appearance card (settings tab) ── */
    .promo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .promo-field label { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-mid); margin-bottom: 0.45rem; }
    .promo-swatches { display: flex; gap: 0.45rem; }
    .promo-sw { width: 34px; height: 34px; border-radius: 12px; border: 2px solid transparent; background: var(--sw); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; opacity: 0.85; transition: opacity 0.2s, border-color 0.2s, transform 0.2s; }
    .promo-sw i { opacity: 0; transition: opacity 0.2s; }
    .promo-sw:hover { transform: translateY(-2px); }
    .promo-sw.is-active { opacity: 1; border-color: var(--charcoal); }
    .promo-sw.is-active i { opacity: 1; }
    .promo-seg { display: inline-flex; border: 1px solid var(--border-medium); border-radius: 12px; overflow: hidden; }
    .promo-seg button { background: none; border: none; padding: 0.5rem 0.8rem; font-family: inherit; font-size: 0.74rem; color: var(--text-mid); cursor: pointer; border-inline-end: 1px solid var(--border-light); }
    .promo-seg button:last-child { border-inline-end: none; }
    .promo-seg button.is-active { background: var(--gold-dark); color: #fff; }
    .promo-preview { display: flex; gap: 1rem; align-items: center; background: var(--card-warm); border: 1px solid var(--border-light); border-radius: 18px; padding: 1rem; }
    .promo-preview-img { position: relative; width: 96px; height: 96px; flex: 0 0 auto; border-radius: 14px; background: var(--cream-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .promo-preview-img i { font-size: 2rem; color: var(--gold); }
    .promo-preview-info { min-width: 0; flex: 1; }
    .promo-preview-name { font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem; }
    .promo-preview-price { font-size: 0.9rem; margin-bottom: 0.6rem; }
    .promo-preview-price s { opacity: 0.5; font-weight: 300; font-size: 0.85em; margin-inline-end: 7px; }
    .promo-preview-actions { max-width: 260px; }
    .promo-preview-buy { background: var(--gold-dark); color: #fff; border: none; border-radius: 12px; padding: 0.6rem 1rem; font-family: inherit; font-size: 0.82rem; font-weight: 600; cursor: default; min-height: 46px; }
    .promo-preview-cart { cursor: default; }
    .promo-preview .rp-badge--starburst { top: 6px; left: 6px; width: 42px; height: 42px; font-size: 0.68rem; }
    .promo-preview .rp-badge--pill { top: 6px; left: 6px; font-size: 0.66rem; padding: 0.28rem 0.5rem; }
    .promo-preview .rp-badge--corner { top: 0; left: 0; padding: 0.32rem 0.6rem 0.32rem 0.45rem; font-size: 0.66rem; }
'''


# ══════════════════════════════════════════════════════════════
# 1. Alucard146.html — promo field in both forms + settings card + hooks
# ══════════════════════════════════════════════════════════════
P = 'Alucard146.html'
s = load(P); orig = len(s)

# add form: after the old-price field of the ADD form (12-space indent)
ANCH = '''            <input type="number" id="productOldPrice" step="0.001" min="0" placeholder="ex. 149.000">
'''
if s.count(ANCH) != 1:
    errors.append('Alucard146 [add-promo-anchor]: %d' % s.count(ANCH))
else:
    s = s.replace(ANCH, ANCH + PROMO_FIELD.format(ind='            ', id='productPromoPercent'))

# edit form: after eProductOldPrice
ANCH2 = '''                        <input type="number" id="eProductOldPrice" step="0.001" min="0" placeholder="ex. 149.000">
'''
if s.count(ANCH2) != 1:
    errors.append('Alucard146 [edit-promo-anchor]: %d' % s.count(ANCH2))
else:
    s = s.replace(ANCH2, ANCH2 + PROMO_FIELD.format(ind='                        ', id='eProductPromoPercent'))

# settings card, right before the logout footer of the settings tab
ANCH3 = '        <div class="settings-foot"><a href="#" id="btnLogoutSettings">'
if s.count(ANCH3) != 1:
    errors.append('Alucard146 [settings-card-anchor]: %d' % s.count(ANCH3))
else:
    s = s.replace(ANCH3, SETTINGS_CARD + ANCH3)

# promo css next to the banner css (before </style> of the head)
if s.count('</style>') < 1:
    errors.append('Alucard146 [style-anchor]: no </style>')
else:
    s = s.replace('</style>', PROMO_CSS + '  </style>', 1)

# script tag for the promo settings panel + reload hook
ANCH4 = '  <script src="js/rosa-admin-variants.js?v=1"></script>'
if s.count(ANCH4) != 1:
    errors.append('Alucard146 [promo-admin-script]: %d' % s.count(ANCH4))
else:
    s = s.replace(ANCH4, ANCH4 + '\n  <script src="js/rosa-promo-admin.js?v=1"></script>')

if not errors:
    save(P, s)
    print('%-22s %6d -> %6d bytes' % (P, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# 2. js/app-adminadd.js + js/app-productedit.js — promo_percent in payloads
# ══════════════════════════════════════════════════════════════
P = 'js/app-adminadd.js'
s = load(P); orig = len(s)


def rep(old, new, name, count=1):
    global s
    n = s.count(old)
    if n != count:
        errors.append('%s [%s]: %d' % (P, name, n)); return
    s = s.replace(old, new)


rep("const quantity = parseInt((document.getElementById('eProductQuantity') || document.getElementById('productQuantity'))?.value) || 0;",
    "const quantity = parseInt((document.getElementById('eProductQuantity') || document.getElementById('productQuantity'))?.value) || 0;\n"
    "        const promoRaw = (document.getElementById('eProductPromoPercent') || document.getElementById('productPromoPercent'))?.value;\n"
    "        const promoPercent = (promoRaw === '' || promoRaw == null) ? null : parseFloat(promoRaw);",
    'promo-read')

rep("""          const newProduct = {
            name, brand, price, quantity,
            variants: __vRows.length ? JSON.stringify(__vRows) : null,""",
    """          const newProduct = {
            name, brand, price, quantity,
            promo_percent: (promoPercent != null && isFinite(promoPercent) && promoPercent > 0) ? promoPercent : null,
            variants: __vRows.length ? JSON.stringify(__vRows) : null,""",
    'promo-payload')

rep("""          if (error && /variants/.test(String(error.message || ''))) {
            delete newProduct.variants; // column not migrated yet
            error = (await supabase.from('products').insert([newProduct])).error;
          }""",
    """          if (error && /variants/.test(String(error.message || ''))) {
            delete newProduct.variants; // column not migrated yet
            error = (await supabase.from('products').insert([newProduct])).error;
          }
          if (error && /promo_percent/.test(String(error.message || ''))) {
            delete newProduct.promo_percent; // column not migrated yet
            error = (await supabase.from('products').insert([newProduct])).error;
          }""",
    'promo-fallback')

# reset the field after a successful add
rep("""          document.getElementById('productQuantity').value = '0';""",
    """          document.getElementById('productQuantity').value = '0';
          const pp = document.getElementById('eProductPromoPercent') || document.getElementById('productPromoPercent');
          if (pp) pp.value = '';""",
    'promo-reset')

if not errors:
    save(P, s)
    print('%-22s %6d -> %6d bytes' % (P, orig, len(s)))

P = 'js/app-productedit.js'
s = load(P); orig = len(s)
rep("""                const quantity = parseInt(document.getElementById('eProductQuantity').value) || 0;""",
    """                const quantity = parseInt(document.getElementById('eProductQuantity').value) || 0;
                const promoPercentRaw = document.getElementById('eProductPromoPercent')?.value;
                const promoPercent = (promoPercentRaw === '' || promoPercentRaw == null) ? null : parseFloat(promoPercentRaw);""",
    'promo-read')
rep("""                price,
                        old_price: (oldPrice != null && isFinite(oldPrice) && oldPrice > price) ? oldPrice : null,""",
    """                price,
                        old_price: (oldPrice != null && isFinite(oldPrice) && oldPrice > price) ? oldPrice : null,
                        promo_percent: (promoPercent != null && isFinite(promoPercent) && promoPercent > 0) ? promoPercent : null,""",
    'promo-payload')
rep("""                    if (error && /variants/.test(String(error.message || ''))) {
                        delete updateData.variants; // column not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }""",
    """                    if (error && /variants/.test(String(error.message || ''))) {
                        delete updateData.variants; // column not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }
                    if (error && /promo_percent/.test(String(error.message || ''))) {
                        delete updateData.promo_percent; // column not migrated yet
                        error = (await supabase.from('products').update(updateData).eq('id', productId)).error;
                    }""",
    'promo-fallback')
rep("""                document.getElementById('eProductOldPrice') && (document.getElementById('eProductOldPrice').value = (product.old_price != null ? product.old_price : ''));""",
    """                document.getElementById('eProductOldPrice') && (document.getElementById('eProductOldPrice').value = (product.old_price != null ? product.old_price : ''));
                document.getElementById('eProductPromoPercent') && (document.getElementById('eProductPromoPercent').value = (product.promo_percent != null ? product.promo_percent : ''));""",
    'promo-populate')

if not errors:
    save(P, s)
    print('%-22s %6d -> %6d bytes' % (P, orig, len(s)))

# ══════════════════════════════════════════════════════════════
# 3. i18n for the two admin scripts
# ══════════════════════════════════════════════════════════════
KEY_FR = "promoPercent: 'Remise % (badge promo)', promoPercentHint: \"Laissez vide : le % se calcule depuis l'ancien prix.\", "
KEY_EN = "promoPercent: 'Discount % (promo badge)', promoPercentHint: 'Leave empty: the % is computed from the old price.', "
KEY_AR = "promoPercent: 'نسبة الخصم %', promoPercentHint: 'اتركه فارغاً ليُحسب من السعر القديم.', "
for P in ('js/app-adminadd.js', 'js/app-productedit.js'):
    s = load(P)
    done = True
    for anchor, key in (("quantity: 'Quantité en stock',", KEY_FR),
                        ("quantity: 'Quantity in stock',", KEY_EN),
                        ("quantity: 'الكمية في المخزون',", KEY_AR)):
        if s.count(anchor) == 1:
            s = s.replace(anchor, key + anchor)
        else:
            done = False
    if done:
        save(P, s)
        print('%-22s i18n keys' % P)

if errors:
    print('\nFAILURES:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nadmin promo wiring done')
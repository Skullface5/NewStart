#!/usr/bin/env python3
"""Patch app-product.js with variant ("Nos Produits") support."""
import io, re, sys

P = 'js/app-product.js'
src = io.open(P, encoding='utf-8').read()
orig = src

def rep(old, new, count=1, name=''):
    global src
    n = src.count(old)
    if n != count:
        print('FAIL [%s]: expected %d occurrence(s), found %d' % (name, count, n))
        print(repr(old[:160]))
        sys.exit(1)
    src = src.replace(old, new)
    print('ok  [%s]' % name)

# ── 1. alias for the shared module ───────────────────────────────
rep("      let currentLanguage = localStorage.getItem('language') || 'fr';",
    "      const VR = window.RosaVariants || { parse: function () { return []; }, priceFor: function (p) { return parseFloat(p && p.price) || 0; }, inStock: function (p) { return !p || p.quantity == null || Number(p.quantity) > 0; }, stockOf: function (p) { return p && p.quantity != null ? Number(p.quantity) : null; }, esc: escapeHtmlRaw };\n      function escapeHtmlRaw(s) { return s == null ? '' : String(s).replace(/[&<>\"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' })[m]; }); }\n      let currentLanguage = localStorage.getItem('language') || 'fr';",
    name='module-alias')

# ── 2. i18n keys ─────────────────────────────────────────────────
rep("          address: 'Adresse *', delivery: 'Livraison'",
    "          address: 'Adresse *', delivery: 'Livraison',\n          ourProducts: 'Nos Produits'",
    name='i18n-fr')
rep("          address: 'Address *', delivery: 'Delivery'",
    "          address: 'Address *', delivery: 'Delivery',\n          ourProducts: 'Our Products'",
    name='i18n-en')
rep("          address: 'العنوان *', delivery: 'التوصيل'",
    "          address: 'العنوان *', delivery: 'التوصيل',\n          ourProducts: 'منتجاتنا'",
    name='i18n-ar')

# ── 3. cart line shows the chosen variant ────────────────────────
rep("""              <div class="cart-item-title">${escapeHtml(item.name)}</div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>""",
    """              <div class="cart-item-title">${escapeHtml(item.name)}</div>
              ${item.variant ? `<div class="cart-item-sub">${escapeHtml(item.variant)}</div>` : ''}
              <div class="cart-item-price">${formatPrice(item.price)}</div>""",
    name='cart-variant-line')

# ── 4. addToCart: variant-aware stock + composite line id ────────
rep("""      function addToCart(id, name, price, icon, image) {
        const product = allProducts.find(p => p.id == id);
        if (!product) return;
        const stock = product.quantity || 0;
        const existing = cart.find(i => i.id === id);
        const currentQty = existing ? existing.quantity : 0;
        if (currentQty >= stock) {
          showToast('outOfStock');
          return;
        }
        if (existing) {
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({ id, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }
        saveCart();
        showToast('addedToCart', name);
      }""",
    """      function addToCart(id, name, price, icon, image, variantLabel) {
        const product = allProducts.find(p => p.id == id);
        if (!product) return;
        const variantLabelStr = variantLabel || '';
        const variant = variantLabelStr ? (VR.parse(product.variants).find(v => v.label === variantLabelStr) || null) : null;
        const stock = VR.stockOf(product, variant);
        const lineId = variantLabelStr ? (id + '::' + variantLabelStr) : id;
        const existing = cart.find(i => i.id === lineId);
        const currentQty = existing ? (existing.quantity || 1) : 0;
        if (stock != null && currentQty >= stock) {
          showToast('outOfStock');
          return;
        }
        if (existing) {
          existing.quantity = currentQty + 1;
        } else {
          cart.push({ id: lineId, productId: id, variant: variantLabelStr, name, price, icon: icon || 'fa-crown', image, quantity: 1 });
        }
        saveCart();
        showToast('addedToCart', name);
      }""",
    name='addToCart')

# ── 5. updateQuantity: resolve product + variant from line id ────
rep("""      function updateQuantity(id, action) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const product = allProducts.find(p => p.id == id);
        const stock = product ? (product.quantity || 0) : 0;
        if (action === 'increase') {
          if ((item.quantity || 1) + 1 > stock) { showToast('outOfStock'); return; }""",
    """      function updateQuantity(id, action) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const pid = item.productId || String(id).split('::')[0];
        const product = allProducts.find(p => p.id == pid);
        const variant = (item.variant && product) ? (VR.parse(product.variants).find(v => v.label === item.variant) || null) : null;
        const stock = product ? VR.stockOf(product, variant) : 0;
        if (action === 'increase') {
          if (stock != null && (item.quantity || 1) + 1 > stock) { showToast('outOfStock'); return; }""",
    name='updateQuantity')

# ── 6. displayProduct: variant-aware stock + selector markup ─────
rep("""        const stockStatusHTML = getStockStatusHTML(product.quantity);
        const isOutOfStock = !product.quantity || product.quantity === 0;
        const addToCartDisabled = isOutOfStock ? 'disabled' : '';""",
    """        // ── Variants ("Nos Produits") ─────────────────────────────
        const variants = VR.parse(product.variants);
        const hasVariants = variants.length > 0;
        const activeVariant = hasVariants ? (variants.find(v => VR.inStock(product, v)) || variants[0]) : null;
        const showOptPrices = hasVariants && variants.some(v => VR.priceFor(product, v) !== VR.priceFor(product, variants[0]));
        const stockStatusHTML = getStockStatusHTML(hasVariants ? VR.stockOf(product, activeVariant) : product.quantity);
        const isOutOfStock = hasVariants ? !VR.inStock(product, activeVariant) : (!product.quantity || product.quantity === 0);
        const addToCartDisabled = isOutOfStock ? 'disabled' : '';
        const variantsHtml = hasVariants ? `
              <div class="variant-block">
                <div class="variant-title"><i class="fas fa-layer-group" style="margin-inline-end:5px;"></i>${translations[currentLanguage].ourProducts}</div>
                <div class="variant-options" id="variantOptions">${variants.map(v => {
                  const out = !VR.inStock(product, v);
                  return `<button type="button" class="variant-opt${v.label === activeVariant.label ? ' is-active' : ''}${out ? ' is-out' : ''}" data-variant="${VR.esc(v.label)}"${out ? ' disabled' : ''}>
                    <span class="variant-radio"></span>
                    <span class="variant-opt-txt"><span class="variant-label">${VR.esc(v.label)}</span>${showOptPrices && v.price != null ? `<span class="variant-price">${formatPrice(v.price)}</span>` : ''}</span>
                  </button>`;
                }).join('')}</div>
              </div>` : '';""",
    name='display-stock-block')

rep("""              <div class="product-price">${promoPriceHtml(product)}</div>
              <div class="product-description">""",
    """              <div class="product-price" id="productPriceLine">${promoPriceHtml(product)}</div>
              <div class="product-description">""",
    name='price-line-id')

# insert variants block right after the price line
rep("""              <div class="product-description">${escapeHtml(product.description || translations[currentLanguage].discover)}</div>""",
    """              ${variantsHtml}
              <div class="product-description">${escapeHtml(product.description || translations[currentLanguage].discover)}</div>""",
    name='insert-variants-html')

# buttons carry the active variant + its price
rep("""<button class="add-to-cart-btn ${addToCartDisabled}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}" data-icon="fa-crown" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>""",
    """<button class="add-to-cart-btn ${addToCartDisabled}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-icon="fa-crown" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>""",
    name='add-btn-dataset')

rep("""              <button class="buy-now-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>""",
    """              <button class="buy-now-btn ${isOutOfStock ? 'disabled' : ''}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${hasVariants ? VR.priceFor(product, activeVariant) : product.price}" data-variant="${activeVariant ? VR.esc(activeVariant.label) : ''}" data-stock="${hasVariants ? (VR.stockOf(product, activeVariant) == null ? '' : VR.stockOf(product, activeVariant)) : ''}" data-image="${productImages[0] || ''}" ${isOutOfStock ? 'disabled' : ''}>""",
    name='buy-btn-dataset')

# ── 7. wire the selector + pass the variant through ─────────────
rep("""        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn && !isOutOfStock) {
          addBtn.addEventListener('click', () => { addToCart(addBtn.dataset.id, addBtn.dataset.name, parseFloat(addBtn.dataset.price), addBtn.dataset.icon, addBtn.dataset.image); });
        }
        const buyBtn = document.querySelector('.buy-now-btn');
        if (buyBtn && !isOutOfStock) {
          buyBtn.addEventListener('click', () => { openBuyNow(buyBtn.dataset.id, buyBtn.dataset.name, parseFloat(buyBtn.dataset.price), buyBtn.dataset.image); });
        }""",
    """        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn) {
          addBtn.addEventListener('click', () => {
            if (addBtn.disabled) return;
            addToCart(addBtn.dataset.id, addBtn.dataset.name, parseFloat(addBtn.dataset.price), addBtn.dataset.icon, addBtn.dataset.image, addBtn.dataset.variant);
          });
        }
        const buyBtn = document.querySelector('.buy-now-btn');
        if (buyBtn) {
          buyBtn.addEventListener('click', () => {
            if (buyBtn.disabled) return;
            openBuyNow(buyBtn.dataset.id, buyBtn.dataset.name, parseFloat(buyBtn.dataset.price), buyBtn.dataset.image, buyBtn.dataset.variant);
          });
        }
        // Variant picker: swap price line, stock badge and button payloads.
        if (hasVariants) {
          const priceLine = document.getElementById('productPriceLine');
          const stockSlot = document.querySelector('.product-info .stock-status');
          const qtyInfo = document.querySelector('.product-info .quantity-info');
          function paintVariant(label) {
            const v = variants.find(x => x.label === label);
            if (!v) return;
            document.querySelectorAll('.variant-opt').forEach(b => b.classList.toggle('is-active', b.dataset.variant === label));
            const out = !VR.inStock(product, v);
            const linePrice = VR.priceFor(product, v);
            if (priceLine) {
              const op = product.old_price != null ? parseFloat(product.old_price) : NaN;
              priceLine.innerHTML = (isFinite(op) && op > linePrice)
                ? '<s style="opacity:.5;font-weight:300;font-size:.8em;margin-inline-end:7px;">' + formatPrice(op) + '</s>' + formatPrice(linePrice)
                : formatPrice(linePrice);
            }
            const qty = VR.stockOf(product, v);
            const fresh = getStockStatusHTML(qty);
            const holder = stockSlot ? stockSlot.parentNode : document.querySelector('.product-info');
            if (stockSlot && holder) {
              const tmp = document.createElement('div');
              tmp.innerHTML = fresh;
              holder.replaceChild(tmp.firstElementChild, stockSlot);
            }
            // quantity-info line inside the badge was replaced with the badge itself
            if (qtyInfo && qtyInfo.parentNode) qtyInfo.parentNode.removeChild(qtyInfo);
            if (addBtn) {
              addBtn.dataset.price = linePrice;
              addBtn.dataset.variant = label;
              addBtn.dataset.stock = qty == null ? '' : qty;
              addBtn.disabled = out;
              addBtn.classList.toggle('disabled', out);
            }
            if (buyBtn) {
              buyBtn.dataset.price = linePrice;
              buyBtn.dataset.variant = label;
              buyBtn.dataset.stock = qty == null ? '' : qty;
              buyBtn.disabled = out;
              buyBtn.classList.toggle('disabled', out);
            }
          }
          document.querySelectorAll('.variant-opt').forEach(btn => btn.addEventListener('click', () => {
            if (btn.disabled || btn.classList.contains('is-out')) return;
            paintVariant(btn.dataset.variant);
          }));
        }""",
    name='variant-wiring')

# ── 8. buy now carries the variant ──────────────────────────────
rep("""      window.openBuyNow = function (id, name, price, image) {
        buyNowItem = { id, name, price, quantity: 1, image: image || '' };""",
    """      window.openBuyNow = function (id, name, price, image, variant) {
        buyNowItem = { id, name, price, quantity: 1, image: image || '', variant: variant || '' };""",
    name='openBuyNow-signature')

rep("""        document.getElementById('modalCartItems').innerHTML = '<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>' + escapeHtml(name) + ' x1</span><span>' + price.toFixed(3).replace('.', ',') + ' TND</span></div>';""",
    """        document.getElementById('modalCartItems').innerHTML = '<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>' + escapeHtml(name) + (variant ? ' <span class="cart-item-sub">(' + escapeHtml(variant) + ')</span>' : '') + ' x1</span><span>' + price.toFixed(3).replace('.', ',') + ' TND</span></div>';""",
    name='buyNow-modal-line')

# ── 9. order payloads keep product id + variant ─────────────────
rep("""            items: buyNowItem ? [{ name: buyNowItem.name, quantity: 1, price: buyNowItem.price, id: buyNowItem.id }] : cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.id })),""",
    """            items: buyNowItem ? [{ name: buyNowItem.name, quantity: 1, price: buyNowItem.price, id: buyNowItem.id, variant: buyNowItem.variant || null }] : cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, id: item.productId || item.id, variant: item.variant || null })),""",
    name='order-payload')

# cart modal shows the variant too
rep("""          document.getElementById('modalCartItems').innerHTML = cart.map(i => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)} x${i.quantity}</span>""",
    """          document.getElementById('modalCartItems').innerHTML = cart.map(i => `<div style="display:flex;justify-content:space-between;padding:5px 0;"><span>${escapeHtml(i.name)}${i.variant ? ' <span class="cart-item-sub">(' + escapeHtml(i.variant) + ')</span>' : ''} x${i.quantity}</span>""",
    name='cart-modal-line')

io.open(P, 'w', encoding='utf-8').write(src)
print('\nwritten: %s  (%d -> %d bytes)' % (P, len(orig), len(src)))
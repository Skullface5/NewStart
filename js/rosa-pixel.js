/* ROSA — Meta Pixel event layer
   ---------------------------------------------------------------------------
   Loaded right after the Meta base code on every storefront page, BEFORE the
   app-*.js files. Every call is a no-op when the pixel is blocked or missing,
   so nothing here can ever break the cart or checkout.

   API:  RosaPixel.viewContent({id, name, price})
         RosaPixel.addToCart({productId, name, price, variant, quantity})
         RosaPixel.initiateCheckout(cartArray)
         RosaPixel.purchase(itemsArray, totalValue)
         RosaPixel.registration()
   --------------------------------------------------------------------------- */
(function () {
  var CURRENCY = 'TND';
  var lastView = '';

  function ready() { return typeof window.fbq === 'function'; }

  function fire(event, params, eventID) {
    if (!ready()) return;
    try {
      if (eventID) window.fbq('track', event, params, { eventID: eventID });
      else window.fbq('track', event, params);
    } catch (e) { /* tracking must never break the page */ }
  }

  /* "109,000 TND" / 109.000 / "109" -> 109  (the site prints comma decimals) */
  function num(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  }
  function money(v) { return Math.round(num(v) * 1000) / 1000; }

  /* a cart line -> the shape Meta wants (id is the raw product id, never "id::variant") */
  function line(item, qty) {
    var raw = item ? (item.productId != null ? item.productId : item.id) : '';
    return {
      id: raw == null ? '' : String(raw).split('::')[0],
      quantity: qty || num(item && item.quantity) || 1,
      item_price: money(item && item.price)
    };
  }

  function cartItems() {
    try { return JSON.parse(localStorage.getItem('RosaFragrances_cart')) || []; }
    catch (e) { return []; }
  }

  function payload(items) {
    var list = (items && items.length) ? items : cartItems();
    var value = 0, units = 0, contents = [];
    list.forEach(function (i) {
      var q = num(i && i.quantity) || 1;
      value += money(i && i.price) * q;
      units += q;
      contents.push(line(i, q));
    });
    return {
      value: Math.round(value * 1000) / 1000,
      currency: CURRENCY,
      content_ids: contents.map(function (c) { return c.id; }),
      contents: contents,
      content_type: 'product',
      num_items: units
    };
  }

  function uid(prefix) {
    return (prefix || 'ev') + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 10);
  }

  window.RosaPixel = {
    CURRENCY: CURRENCY,
    num: num,
    money: money,
    cartItems: cartItems,
    payload: payload,
    track: fire,

    /* one ViewContent per product id — switching variant is not a new view */
    viewContent: function (product) {
      if (!product || product.id == null) return;
      var key = String(product.id);
      if (lastView === key) return;
      lastView = key;
      fire('ViewContent', {
        content_ids: [key],
        content_name: product.name || '',
        content_type: 'product',
        contents: [{ id: key, quantity: 1, item_price: money(product.price) }],
        value: money(product.price),
        currency: CURRENCY
      });
    },

    addToCart: function (item) {
      if (!item) return;
      fire('AddToCart', payload([item]));
    },

    initiateCheckout: function (items) {
      fire('InitiateCheckout', payload(items));
    },

    /* total comes from the order row when the caller has it (DB is the truth) */
    purchase: function (items, total) {
      var p = payload(items);
      if (total != null && num(total) > 0) p.value = money(total);
      fire('Purchase', p, uid('purchase'));
    },

    registration: function () {
      fire('CompleteRegistration', { currency: CURRENCY });
    }
  };
})();

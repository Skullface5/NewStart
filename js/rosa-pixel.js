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
  var PIXEL_ID = '1039023089029451';
  var lastView = '';
  var pendingIdentity = null;   // promise from the checkout form, awaited by Purchase

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

  /* --- advanced matching -------------------------------------------------
     The customer's own details, SHA-256 hashed in the browser before anything
     is sent, so Meta can match the visit to a real account and the shop's
     reported numbers get attributed to the right ad. Meta's rules: lowercase
     emails, digits-only phone including the country code (Tunisia = 216),
     lowercase names. The clear values never leave this function. */
  function sha256(value) {
    if (!value) return Promise.resolve(null);
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        var data = new TextEncoder().encode(value);
        return window.crypto.subtle.digest('SHA-256', data).then(function (buf) {
          var bytes = new Uint8Array(buf), out = '';
          for (var i = 0; i < bytes.length; i++) out += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
          return out;
        }).catch(function () { return null; });
      }
    } catch (e) {}
    return Promise.resolve(null);
  }

  function normEmail(v) { return String(v || '').trim().toLowerCase(); }

  function normPhone(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.indexOf('216') === 0) return d;
    return d.length === 8 ? '216' + d : d;
  }

  function splitName(v) {
    var parts = String(v || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    return { fn: parts[0] || '', ln: parts.length > 1 ? parts[parts.length - 1] : '' };
  }

  /* hash whatever the caller knows and hand it to Meta's init; resolves true
     when at least one usable identifier was sent. */
  function identify(user) {
    var u = user || {};
    var n = splitName(u.name);
    return Promise.all([
      sha256(normEmail(u.email)),
      sha256(normPhone(u.phone)),
      sha256(n.fn),
      sha256(n.ln)
    ]).then(function (h) {
      var params = {};
      if (h[0]) params.em = h[0];
      if (h[1]) params.ph = h[1];
      if (h[2]) params.fn = h[2];
      if (h[3]) params.ln = h[3];
      if (Object.keys(params).length && ready()) {
        try { window.fbq('init', PIXEL_ID, params); } catch (e) {}
      }
      return Object.keys(params).length > 0;
    }).catch(function () { return false; });
  }

  /* run `done` once the pending identity work settles — but never let a slow
     hash delay or swallow the event. */
  function withIdentity(done) {
    var p = pendingIdentity;
    if (!p) { done(); return; }
    var called = false;
    var go = function () { if (!called) { called = true; done(); } };
    p.then(go, go);
    setTimeout(go, 1500);
  }

  /* the checkout form carries the only customer details we ever see before the
     order exists: start hashing them the moment the form is submitted (this
     listener is registered before the app's own, the pixel loads first). */
  function captureCheckoutForm() {
    try {
      var form = document.getElementById('checkoutForm');
      if (!form || form.__rosaAm) return;
      form.__rosaAm = true;
      form.addEventListener('submit', function () {
        var val = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
        pendingIdentity = identify({ name: val('customerName'), phone: val('customerPhone'), email: val('customerEmail') });
      });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', captureCheckoutForm);
  else captureCheckoutForm();
  window.addEventListener('load', captureCheckoutForm);

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

    /* total comes from the order row when the caller has it (DB is the truth).
       Waits for the checkout form's hashed identity (if it is still in flight)
       so Meta receives the purchase with the customer details attached. */
    purchase: function (items, total) {
      var p = payload(items);
      if (total != null && num(total) > 0) p.value = money(total);
      withIdentity(function () { fire('Purchase', p, uid('purchase')); });
    },

    /* optional: hand it {name, phone, email} (raw — it hashes them itself) */
    identify: identify,

    registration: function (user) {
      var go = function () { fire('CompleteRegistration', { currency: CURRENCY }); };
      if (user) { identify(user).then(go, go); return; }
      withIdentity(go);
    }
  };
})();

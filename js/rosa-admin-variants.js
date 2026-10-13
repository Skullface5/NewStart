/* ============================================================
   ROSA — admin variant editor ("Nos Produits")
   Shared by the add-product form (Alucard146 / adminadd.html)
   and the edit-product form (app-productedit.js).
   Rows: label | price | stock | delete.  Empty label = row ignored.
   ============================================================ */
(function () {
  'use strict';

  var CSS = [
    '.variants-admin{display:flex;flex-direction:column;gap:.5rem;}',
    '.variants-admin .var-row{display:grid;grid-template-columns:1.1fr .85fr .75fr 34px;gap:.45rem;align-items:center;}',
    '.variants-admin .var-row input{width:100%;padding:.55rem .7rem;border:1px solid var(--input-border);border-radius:12px;background:var(--input-bg);color:var(--charcoal);font-size:.82rem;font-family:inherit;}',
    '.variants-admin .var-row input:focus{outline:none;border-color:var(--input-focus);}',
    '.variants-admin .var-del{width:34px;height:34px;border:1px solid var(--border-medium);border-radius:12px;background:none;color:var(--text-mid);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s,border-color .2s;}',
    '.variants-admin .var-del:hover{color:#b34545;border-color:#b34545;}',
    '.variants-add{margin-top:.5rem;background:none;border:1px dashed var(--border-medium);border-radius:12px;padding:.5rem .9rem;color:var(--gold-dark);font-size:.78rem;cursor:pointer;font-family:inherit;transition:border-color .2s,background-color .2s;}',
    '.variants-add:hover{border-color:var(--gold-dark);background:var(--hover-subtle,rgba(180,155,120,.06));}',
    '.variants-admin .var-empty{font-size:.75rem;color:var(--text-mid);font-style:italic;}',
    '@media (max-width:560px){.variants-admin .var-row{grid-template-columns:1fr 1fr;grid-auto-rows:auto;}.variants-admin .var-row .var-del{grid-column:2;justify-self:end;}}'
  ].join('');

  function inject() {
    if (document.getElementById('rosaAdminVariantCss')) return;
    var s = document.createElement('style');
    s.id = 'rosaAdminVariantCss';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function esc(v) { return v == null ? '' : String(v).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); }

  function rowHtml(v) {
    v = v || {};
    var price = (v.price == null || v.price === '') ? '' : v.price;
    var qty = (v.quantity == null || v.quantity === '') ? '' : v.quantity;
    return '<div class="var-row">' +
      '<input type="text" class="var-label" placeholder="100ml" autocomplete="off" value="' + esc(v.label) + '">' +
      '<input type="number" class="var-price" step="0.001" min="0" placeholder="Prix" value="' + esc(price) + '">' +
      '<input type="number" class="var-qty" step="1" min="0" placeholder="Stock" value="' + esc(qty) + '">' +
      '<button type="button" class="var-del" title="Supprimer"><i class="fas fa-times"></i></button>' +
      '</div>';
  }

  function ensureEmpty(listEl) {
    if (!listEl) return;
    var rows = listEl.querySelectorAll('.var-row');
    var empty = listEl.querySelector('.var-empty');
    if (rows.length === 0 && !empty) {
      listEl.insertAdjacentHTML('beforeend', '<div class="var-empty">—</div>');
    } else if (rows.length > 0 && empty) {
      empty.remove();
    }
  }

  /* Delegated delete handler — bound ONCE per list element so it survives
     setRows() (which rewrites innerHTML). Mounting is idempotent on the list. */
  function bindDelegates(listEl) {
    if (!listEl || listEl.__rosaBound) return;
    listEl.__rosaBound = true;
    listEl.addEventListener('click', function (e) {
      var del = e.target.closest('.var-del');
      if (!del) return;
      var row = del.closest('.var-row');
      if (row) row.remove();
      ensureEmpty(listEl);
    });
  }

  var API = {
    inject: inject,

    /* Wire a list container + its "+ Ajouter" button. */
    mount: function (listEl, addBtn) {
      inject();
      if (!listEl) return;
      bindDelegates(listEl);
      /* rebind idempotently: the add button is the only per-mount listener;
         row add/delete are delegated on the list itself (survives setRows),
         so re-mount never creates a second hidden handler set. */
      if (addBtn && !addBtn.__rosaBound) {
        addBtn.__rosaBound = true;
        addBtn.addEventListener('click', function () { API.addRow(listEl); });
      }
      listEl.__rosaMounted = true;
      ensureEmpty(listEl);
    },

    addRow: function (listEl, v) {
      if (!listEl) return;
      var empty = listEl.querySelector('.var-empty');
      if (empty) empty.remove();
      listEl.insertAdjacentHTML('beforeend', rowHtml(v));
      var rows = listEl.querySelectorAll('.var-row');
      var last = rows[rows.length - 1];
      var inp = last && last.querySelector('.var-label');
      if (inp) inp.focus();
    },

    /* Replace all rows (used when loading a product). */
    setRows: function (listEl, variants) {
      if (!listEl) return;
      inject();
      listEl.innerHTML = '';
      (variants || []).forEach(function (v) { listEl.insertAdjacentHTML('beforeend', rowHtml(v)); });
      ensureEmpty(listEl);
    },

    /* Read the rows back. Rows with an empty label are dropped.
       price/quantity left empty stay null (= inherit product value). */
    readRows: function (listEl) {
      if (!listEl) return [];
      var out = [];
      listEl.querySelectorAll('.var-row').forEach(function (row) {
        var label = (row.querySelector('.var-label').value || '').trim();
        if (!label) return;
        var pRaw = row.querySelector('.var-price').value;
        var qRaw = row.querySelector('.var-qty').value;
        var price = (pRaw === '' || pRaw == null) ? null : parseFloat(pRaw);
        var qty = (qRaw === '' || qRaw == null) ? null : parseInt(qRaw, 10);
        out.push({
          label: label,
          price: (price != null && isFinite(price)) ? price : null,
          quantity: (qty != null && isFinite(qty)) ? qty : null
        });
      });
      return out;
    }
  };

  inject();
  window.RosaAdminVariants = API;
})();
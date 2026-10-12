-- Rosa Fragrances — product variants ("Nos Produits")
-- Already applied on 2026-10-12 (project dtwciuhwwanwlwpydeko).
-- Additive + idempotent: safe to re-run anywhere.

alter table public.products add column if not exists variants jsonb;

comment on column public.products.variants is
  'Optional variants: [{"label":"100ml","price":50,"quantity":80}].
   Empty/null = a product with a single size. price/quantity null inherit
   the product row. Read by js/rosa-variants.js on every storefront page and
   written by js/rosa-admin-variants.js from the admin forms.';

-- No RLS change needed: public select is already open, and the existing
-- products_admin_all policy covers the new column for authenticated admins.

-- Rosa Fragrances — manual promo percentage for the -X% badge
-- Applied 2026-10-12 (project dtwciuhwwanwlwpydeko). Additive + idempotent.

alter table public.products add column if not exists promo_percent numeric;

comment on column public.products.promo_percent is
  'Optional manual discount % for the promo badge. Null/0 = the badge computes
   round((old_price - price) / old_price * 100). Set it to force a different
   figure (e.g. a 50% campaign on a 99 -> 69 product).';

-- Promo APPEARANCE (badge colour/shape, sale-price colour, cart icon) lives in
-- the existing settings table, no schema change needed:
--   promo_badge_color = 'green' | 'red' | 'gold' | 'black'
--   promo_price_color = 'green' | 'red' | 'gold' | 'black'
--   promo_badge_shape = 'starburst' | 'pill' | 'corner'
--   buy_cart_icon     = 'plus-cart' | 'bag' | 'cart'
-- Written by js/rosa-promo-admin.js (admin Settings tab), read by
-- js/rosa-promo-load.js on every storefront page.

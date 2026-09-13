# ROSA — Hero Controls + Notre Collection Menu (shared contract)

Repo: /tmp/rosa (branch master == origin/main @ 1d9d9f8). DO NOT run git commands — a human merges/deploys later.
Only edit files you own (listed in your task). Validate, don't deploy.

## Supabase (Rosa)
- URL: https://dtwciuhwwanwlwpydeko.supabase.co
- ANON key: read it from any js/app-*.html file — it's in `const SUPABASE_KEY = '***'`
  (it's the publishable browser key, already public on the live site — fine to embed in new code too).
- Settings REST:
    GET  {URL}/rest/v1/settings?select=*                     (anon key; public read, returns [])
    GET  {URL}/rest/v1/settings?select=*&key=eq.hero_images  (single row)
    POST {URL}/rest/v1/settings (apikey + Authorization: Bearer <anon>) + Prefer: resolution=merge-duplicates
         body: [{"key":"hero_images","value":[...]},{"key":"hero_position","value":{...}}]
         ⚠ writes require a logged-in admin session (RLS). The admin pages already create their own
           supabase-js client (`window.__rosaSupabase` pattern exists in app-adminadd.js etc — mirror it).
           A 401/empty from REST probe scripts is EXPECTED, not a bug.
- Buckets (both public): `img`, `product-images`. Upload folder for hero images: `hero/`.
- products.category is free text — new values allowed. Current real data: women/man/unisexe (+ kids option unused).

## settings keys contract
1. `hero_images`  = JSON array of public URLs (max 6). Empty/absent => hero keeps current gradient, NO bg photo.
2. `hero_position` = map URL -> {tx,ty,zoom} where tx/ty are PERCENT STRINGS with '%' (e.g. "0%","-8%")
   and zoom number >=1. Default when absent: {tx:"0%", ty:"-8%", zoom:1}. Legacy plain object = fallback for all.
3. `collections`  = JSON array of menu items:
   [{"slug":"parfums-inspires","fr":"Parfums inspirés","en":"Inspired perfumes","ar":"عطور مستوحاة","href":"existed.html"},
    {"slug":"voiture",       "fr":"Parfums pour voiture","en":"Car perfumes","ar":"عطور السيارات","href":"cat.html?cat=voiture"},
    {"slug":"ambiance",      "fr":"Parfums d'ambiance","en":"Home fragrances","ar":"عطورات الجو","href":"cat.html?cat=ambiance"},
    {"slug":"musc",          "fr":"Musc","en":"Musk","ar":"مسك","href":"cat.html?cat=musc"},
    {"slug":"accessoires",   "fr":"Accessoires","en":"Accessories","ar":"إكسسوارات","href":"cat.html?cat=accessoires"},
    {"slug":"parfums",       "fr":"Parfums","en":"Perfumes","ar":"عطور","href":"index.html#catalogue","children":["man","women","unisexe","kids"]}]
   - label chosen per page language: item[lang] || item.fr. children = optional sub-links (render as nested list).
   - "Parfums" item is ALWAYS APPENDED after the admin-editable 5 (static in menu builder).
   - slug is the join key for hero-position-like per-item data; keep slugs stable.
4. category labels whitelist (slug -> FR/EN/AR) lives in js/app-collections.js:
   'voiture', 'ambiance', 'musc', 'accessoires' (+ man/women/unisexe/kids existing).

## Storefront settings loader (any page)
  fetch(URL+'/rest/v1/settings?select=*').then(r=>r.json()) -> {key: value} dict. Silent fallback to [].
  Wrap in try/catch + .catch(()=>[]); offline => demo-safe.

## Hero position transform model (MUST match STE exactly)
image inside .hero-tt (object-fit:cover, overflow hidden):
  transform: translate(var(--hp-tx,"0%"), var(--hp-ty,"-8%")) scale(var(--hp-zoom,1));
  transform-origin: center;
editor math: image scaled by zoom covers frame; tx/ty = drag offset as % of frame (clamp so edges never
expose gaps at current zoom — STE code already does this; copy it).

## Reference code to transplant FROM (STE — copy patterns, adapt names):
- /home/alucard/hermes-can-use/ste-mondial-deploy2/js/app2.js  (buildHero, applyHeroPosition, heroApplyToImg)
- /home/alucard/hermes-can-use/ste-mondial-deploy2/js/admin2.js (hp* editor: hpNormalize, hpSeedMap, hpMapJson,
  buildHeroPosition, drag/zoom handlers, saveHeroMedia rows)
- /home/alucard/hermes-can-use/ste-mondial-deploy2/css/admin2.css (#hpEditor block)
- /home/alucard/hermes-can-use/ste-mondial-deploy2/css/index2.css (.hero-* position/transform rules)

## i18n pattern (Rosa pages): each app-*.js has translations = {fr:{...},en:{...},ar:{...}} +
data-translate attrs. For new shared UI: put dicts in js/app-collections.js (owner: menu agent) and call
window.RosaCollections.init({lang}) — pages pass their current lang.

## Validation (run what applies to your files):
- node --check js/<file>.js (skip for html)
- python3: div/section tag balance per html (count('<div') == count('</div>') etc)
- grep confirm no leftover 'TODO' / debug console.log
Return: file-by-file change list + risks + any contract deviation.

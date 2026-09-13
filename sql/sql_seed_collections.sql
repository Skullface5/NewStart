insert into public.settings (key, value) values
  ('collections', '[
    {"slug":"inspires","fr":"Parfums inspirés","en":"Inspired perfumes","ar":"عطور مستوحاة","href":"cat.html?cat=inspires"},
    {"slug":"voiture","fr":"Parfums pour voiture","en":"Car perfumes","ar":"عطور السيارات","href":"cat.html?cat=voiture"},
    {"slug":"ambiance","fr":"Parfums d''ambiance","en":"Home fragrances","ar":"عطورات الجو","href":"cat.html?cat=ambiance"},
    {"slug":"musc","fr":"Musc","en":"Musk","ar":"مسك","href":"cat.html?cat=musc"},
    {"slug":"accessoires","fr":"Accessoires","en":"Accessories","ar":"إكسسوارات","href":"cat.html?cat=accessoires"}
  ]'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

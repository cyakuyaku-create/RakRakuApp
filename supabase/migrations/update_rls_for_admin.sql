-- 既存の一時的な書き込みポリシーを削除
DROP POLICY IF EXISTS "Temporary admin write" ON products;
DROP POLICY IF EXISTS "Temporary admin write types" ON diagnostic_types;
DROP POLICY IF EXISTS "Temporary admin write mapping" ON product_type_mapping;

-- 認証済みユーザー（管理者）のみ編集可能
CREATE POLICY "Admin write products" ON products
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin write types" ON diagnostic_types
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin write mapping" ON product_type_mapping
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Storage のポリシーも更新
DROP POLICY IF EXISTS "Temporary upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Temporary upload character images" ON storage.objects;

CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin upload character images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'character-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete character images" ON storage.objects
  FOR DELETE USING (bucket_id = 'character-images' AND auth.uid() IS NOT NULL);

-- 1. diagnostic_types テーブル（診断タイプ: 8種類）
CREATE TABLE diagnostic_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_name TEXT NOT NULL UNIQUE,
  type_name_en TEXT NOT NULL,
  character_image_url TEXT,
  description TEXT,
  axes_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 初期データ（8タイプ）
INSERT INTO diagnostic_types (type_name, type_name_en, description, axes_scores) VALUES
('時短魔術師', 'Time Saver Wizard', '時短優先度90点', '{"cost": 60, "brand": 40, "trend": 60, "practicality": 80, "design": 50, "time_saving": 90}'),
('デザイン至上主義者', 'Design Purist', 'デザイン優先度90点', '{"cost": 40, "brand": 60, "trend": 70, "practicality": 50, "design": 90, "time_saving": 50}'),
('コスパハンター', 'Value Hunter', 'コスパ優先度95点', '{"cost": 95, "brand": 30, "trend": 40, "practicality": 80, "design": 30, "time_saving": 60}'),
('ブランドロイヤリスト', 'Brand Loyalist', 'ブランド優先度90点', '{"cost": 30, "brand": 90, "trend": 70, "practicality": 60, "design": 70, "time_saving": 50}'),
('トレンドセッター', 'Trend Setter', 'トレンド優先度90点', '{"cost": 40, "brand": 70, "trend": 90, "practicality": 50, "design": 60, "time_saving": 60}'),
('実用性マスター', 'Practicality Master', '実用性優先度90点', '{"cost": 60, "brand": 40, "trend": 50, "practicality": 90, "design": 40, "time_saving": 70}'),
('バランス調和型', 'Harmonious Balance', '全軸70点前後', '{"cost": 70, "brand": 70, "trend": 70, "practicality": 70, "design": 70, "time_saving": 70}'),
('直感冒険家', 'Intuitive Explorer', 'ランダム傾向', '{"cost": 50, "brand": 50, "trend": 50, "practicality": 50, "design": 50, "time_saving": 50}');


-- 2. products テーブル（商品データベース）
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  amazon_link TEXT,
  rakuten_link TEXT,
  review_score DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_visible ON products(is_visible);


-- 3. product_type_mapping テーブル（商品とタイプの関連付け）
CREATE TABLE product_type_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type_id UUID REFERENCES diagnostic_types(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 50,
  UNIQUE(product_id, type_id)
);

CREATE INDEX idx_mapping_type ON product_type_mapping(type_id);
CREATE INDEX idx_mapping_product ON product_type_mapping(product_id);


-- 4. questions テーブル（診断質問）
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number INTEGER NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  axis_type TEXT NOT NULL, -- 'cost', 'brand', 'trend', 'practicality', 'design', 'time_saving'
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 質問データ
INSERT INTO questions (question_number, question_text, axis_type) VALUES
(1, '家電を選ぶとき、価格を最優先に考えますか？', 'cost'),
(2, 'ブランド名が購入の決め手になることが多いですか？', 'brand'),
(3, '最新のトレンド家電をチェックするのが好きですか？', 'trend'),
(4, '機能の多さより、使いやすさを重視しますか？', 'practicality'),
(5, 'デザイン性の高い家電を部屋に置きたいですか？', 'design'),
(6, '家事の時間を短縮できるなら多少高くても買いますか？', 'time_saving'),
(7, '安い代替品があるなら、そちらを選びますか？', 'cost'),
(8, '有名なメーカーの商品だと安心しますか？', 'brand'),
(9, 'SNSで話題の商品は気になりますか？', 'trend'),
(10, '説明書を読まなくても使えるシンプルなものが好きですか？', 'practicality'),
(11, 'インテリアに馴染むかどうかを重視しますか？', 'design'),
(12, '「時短」という言葉に弱いです', 'time_saving'),
(13, '中古品や型落ち品でも気にしませんか？', 'cost'),
(14, '好きなブランドの新作はついチェックしてしまいますか？', 'brand'),
(15, '新しい技術や機能にはすぐに飛びつきたくなりますか？', 'trend'),
(16, '多機能すぎると使いこなせないと感じますか？', 'practicality'),
(17, '見た目が悪いと、機能が良くても買う気が失せますか？', 'design'),
(18, '自分の時間を確保するために家電に投資したいですか？', 'time_saving'),
(19, 'セールの時期まで購入を待つことが多いですか？', 'cost'),
(20, '知られていないメーカーの商品は避けますか？', 'brand'),
(21, '流行り廃りの激しい商品は避けますか？', 'trend'),
(22, '丈夫で長持ちすることを最も重視しますか？', 'practicality'),
(23, '家電もファッションの一部だと思いますか？', 'design'),
(24, '家事の手間を減らすことが最大の目的ですか？', 'time_saving'),
(25, 'コストパフォーマンスという言葉が好きですか？', 'cost');


-- Row Level Security (RLS) 設定

-- diagnostic_types
ALTER TABLE diagnostic_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON diagnostic_types FOR SELECT USING (true);
CREATE POLICY "Temporary admin write types" ON diagnostic_types FOR ALL USING (true);

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible products" ON products FOR SELECT USING (is_visible = true);
CREATE POLICY "Temporary admin write" ON products FOR ALL USING (true);

-- product_type_mapping
ALTER TABLE product_type_mapping ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mappings" ON product_type_mapping FOR SELECT USING (true);
CREATE POLICY "Temporary admin write mapping" ON product_type_mapping FOR ALL USING (true);

-- questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);


-- Storage Bucket 設定

-- buckets テーブルへの挿入はSupabaseのAPI経由や管理画面で行うことが多いが、SQLで初期化する場合:
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('character-images', 'character-images', true) ON CONFLICT DO NOTHING;

-- Storage Policies
-- 注意: storage.objects は通常 public schema ではなく storage schema にあります。
-- Supabase の SQL エディタで実行することを想定。

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public read character images" ON storage.objects FOR SELECT USING (bucket_id = 'character-images');

CREATE POLICY "Temporary upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Temporary upload character images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'character-images');

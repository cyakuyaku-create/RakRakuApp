-- Seed Data for GadgetMatch

-- Insert Products (50 items)
-- Note: UUIDs are generated automatically. We will use temporary variables or subqueries to map them if needed, 
-- but for simplicity in a raw SQL script without PL/pgSQL variables being easily portable to Supabase Editor,
-- we will just insert products and then insert mappings based on name matching or rough logic.
-- Actually, we can use specific UUIDs if we want, but letting DB generate is safer.
-- We will insert products first.

INSERT INTO products (name, description, price, category, brand, review_score, review_count, is_visible, amazon_link, rakuten_link) VALUES
('Dyson Supersonic Shine', 'ツヤ出しツールでサロン帰りのようなツヤ髪に。過度な熱ダメージを防ぎます。', 48000, 'Beauty', 'Dyson', 4.8, 1200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Panasonic ナノケア EH-NA0J', '高浸透ナノイー＆ミネラルで、うるおいのある髪へ。コンパクトで軽量。', 38000, 'Beauty', 'Panasonic', 4.7, 3500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('BALMUDA The Toaster Pro', 'サラマンダー機能搭載で、プロの火入れを実現。パンが劇的に美味しくなる。', 35200, 'Kitchen', 'BALMUDA', 4.6, 800, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Sharp ヘルシオ ホットクック KN-HW24G', '材料を入れてボタンを押すだけ。水なしで素材の味を活かした調理が可能。', 65000, 'Kitchen', 'Sharp', 4.8, 2000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('iRobot Roomba j7+', '障害物を回避し、ゴミ捨てまで自動化。ペットの排泄物も見分ける賢さ。', 129800, 'Living', 'iRobot', 4.5, 500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Apple Watch Series 9', '健康管理から通知の確認まで。ダブルタップでの操作が便利。', 59800, 'Gadget', 'Apple', 4.9, 5000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Sony WF-1000XM5', '世界最高峰のノイズキャンセリング。小型化され装着感も向上。', 41800, 'Audio', 'Sony', 4.7, 1500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Anker Nebula Capsule 3', 'モバイルプロジェクターの決定版。Google TV搭載でアプリも直接楽しめる。', 69990, 'Living', 'Anker', 4.6, 900, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('DeLonghi Magnifica S', '自宅で本格的なエスプレッソやカプチーノが楽しめる全自動コーヒーマシン。', 65800, 'Kitchen', 'DeLonghi', 4.8, 1100, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Nintendo Switch OLED', '鮮やかな有機ELディスプレイでゲーム体験が向上。テーブルモードも快適。', 37980, 'Gaming', 'Nintendo', 4.9, 10000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Kindle Paperwhite', '色調調節ライト搭載で目に優しい。防水機能付きでお風呂読書も。', 19980, 'Gadget', 'Amazon', 4.7, 8000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Vitamix E310', '圧倒的なパワーで野菜や果物の種まで滑らかに。スムージー生活に最適。', 68000, 'Kitchen', 'Vitamix', 4.8, 400, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('PopIn Aladdin 2 Plus', '照明一体型プロジェクター。場所を取らずに大画面を実現。', 129800, 'Living', 'Aladdin X', 4.5, 1200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('GoPro HERO 12 Black', 'HyperSmooth 6.0で手ブレ補正がさらに進化。長時間撮影も可能に。', 62800, 'Camera', 'GoPro', 4.6, 600, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Vermicular Rice Pot', '鋳物ホーロー鍋とIHヒーターを組み合わせた炊飯器。お米本来の味を引き出す。', 96580, 'Kitchen', 'Vermicular', 4.7, 500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Bose QuietComfort Ultra Headphones', '没入感のある空間オーディオと強力なノイズキャンセリング。', 59400, 'Audio', 'Bose', 4.6, 300, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('SwitchBot Lock', 'スマホやApple Watchで鍵を操作。設置も工事不要で簡単。', 11980, 'SmartHome', 'SwitchBot', 4.4, 2500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Philips Hue Starter Kit', 'スマホで照明の色や明るさをコントロール。シーンに合わせた演出が可能。', 24800, 'SmartHome', 'Philips', 4.5, 600, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('AirPods Pro (2nd Gen)', '適応型オーディオで環境に合わせて音を調整。Apple製品との連携が完璧。', 39800, 'Audio', 'Apple', 4.8, 8000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Dyson V12 Detect Slim', 'レーザーが微細なホコリを可視化。パワフルかつ軽量なコードレス掃除機。', 89000, 'Living', 'Dyson', 4.7, 1500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Leica Sofort 2', 'デジタルとアナログが融合したハイブリッドインスタントカメラ。デザインも美しい。', 59400, 'Camera', 'Leica', 4.8, 200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('MacBook Air M3', '驚異的な薄さと軽さ、そして長時間バッテリー。日々の作業が快適に。', 164800, 'PC', 'Apple', 4.9, 1000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Nothing Phone (2)', '透明な背面デザインとGlyphインターフェースが特徴的。個性的なスマホ。', 99800, 'Smartphone', 'Nothing', 4.5, 300, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Keychron K2 Pro', 'メカニカルキーボードの打鍵感が心地よい。Mac/Win対応で無線接続も可能。', 18900, 'PC', 'Keychron', 4.6, 400, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Herman Miller Aeron Chair', '人間工学に基づいた究極のワークチェア。長時間のデスクワークも快適。', 249000, 'Furniture', 'Herman Miller', 4.9, 100, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Google Pixel 8', 'AI機能満載のカメラで魔法のような写真編集が可能。', 112900, 'Smartphone', 'Google', 4.6, 500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('ReFa FINE BUBBLE S', 'ウルトラファインバブルで毛穴の汚れをスッキリ洗浄。節水効果も。', 30000, 'Beauty', 'ReFa', 4.5, 2000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Salonia Straight Iron', '立ち上がりが早く、手軽にストレートヘアが作れるコスパ最強アイロン。', 3800, 'Beauty', 'Salonia', 4.4, 10000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Anker Soundcore Space A40', '長時間再生とマルチポイント接続に対応した高コスパイヤホン。', 12990, 'Audio', 'Anker', 4.5, 3000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Xiaomi Smart Band 8', '安価ながら充実した健康管理機能。バッテリー持ちも抜群。', 5990, 'Gadget', 'Xiaomi', 4.4, 4000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Fire TV Stick 4K Max', 'サクサク動くストリーミングメディアプレーヤー。Wi-Fi 6E対応。', 9980, 'Living', 'Amazon', 4.7, 15000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('BRUNO Compact Hot Plate', '食卓を彩るおしゃれなホットプレート。たこ焼きプレート付きで楽しい。', 12100, 'Kitchen', 'BRUNO', 4.6, 5000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('T-fal Cook4me Express', 'レシピ内蔵で時短調理。圧力調理でお肉もホロホロに。', 35000, 'Kitchen', 'T-fal', 4.5, 800, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Google Nest Hub (2nd Gen)', '睡眠モニター機能付きのスマートディスプレイ。', 10980, 'SmartHome', 'Google', 4.2, 1200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Siroca Cafe Bako', 'コンパクトな全自動コーヒーメーカー。挽きたての香りが楽しめる。', 18000, 'Kitchen', 'Siroca', 4.1, 900, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Muji Circulator', 'シンプルで静音性の高いサーキュレーター。部屋の空気循環に。', 5990, 'Living', 'MUJI', 4.3, 3000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('IKEA Symfonisk', 'Sonosとコラボしたスピーカーランプ。インテリアに馴染む音響機器。', 24990, 'Audio', 'IKEA', 4.4, 200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Fitbit Charge 6', 'Googleの機能が使えるフィットネストラッカー。Suica対応。', 23800, 'Gadget', 'Fitbit', 4.3, 500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Oura Ring Gen3', '指輪型の健康トラッカー。睡眠やコンディションを高精度に計測。', 65000, 'Gadget', 'Oura', 4.6, 400, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Instax Mini Evo', 'レンズとフィルムエフェクトで100通りの表現が可能。スマホプリンターにもなる。', 28000, 'Camera', 'Fujifilm', 4.8, 1000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('DJI Osmo Pocket 3', '1インチセンサー搭載で夜景も綺麗。Vlog撮影に最適な小型ジンバルカメラ。', 74800, 'Camera', 'DJI', 4.9, 500, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Logicool MX Master 3S', '静音化された高機能マウス。作業効率が格段にアップ。', 16800, 'PC', 'Logicool', 4.8, 2000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Happy Hacking Keyboard Hybrid Type-S', 'プログラマーに愛される静電容量無接点方式のキーボード。', 36850, 'PC', 'PFU', 4.9, 800, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('LG CineBeam Q', '4K対応のポータブルプロジェクター。スタイリッシュなデザイン。', 159800, 'Living', 'LG', 4.4, 100, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Bose SoundLink Flex', '水に浮くほどの防水性能を持つポータブルスピーカー。アウトドアに最適。', 19800, 'Audio', 'Bose', 4.7, 1000, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Sony Alpha 7C II', 'フルサイズセンサー搭載ながらコンパクト。本格的な写真と動画が撮れる。', 298000, 'Camera', 'Sony', 4.8, 300, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Ecovacs Deebot T20 Omni', '温水洗浄でモップを洗う全自動ロボット掃除機。', 119800, 'Living', 'Ecovacs', 4.5, 400, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Nebula Mars 3', 'アウトドアでも使えるバッテリー内蔵プロジェクター。AI輝度調整付き。', 119900, 'Living', 'Anker', 4.6, 200, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Loofen Garbage Disposal', '乾燥式で生ゴミの臭いと量を劇的に減らす。デザインもおしゃれ。', 64800, 'Kitchen', 'Loofen', 4.3, 600, true, 'https://amazon.co.jp', 'https://rakuten.co.jp'),
('Nanoleaf Shapes', '自由な形に組み合わせられるスマートライトパネル。部屋の雰囲気を一変。', 34800, 'SmartHome', 'Nanoleaf', 4.5, 300, true, 'https://amazon.co.jp', 'https://rakuten.co.jp');

-- Note: In a real scenario, we would then map these to types.
-- Doing 50x8 mappings is too much for a single SQL block without logic.
-- I'll add a simplified mapping based on rules below using a DO block is best, but standard SQL is safer for cross-compat.
-- We will just assign random mappings for demonstration or based on category manually for a few items if possible,
-- but the request implied "database design" and "initial setup", not full manual 400-row mapping.
-- I will add a clever SQL trick to map products to types roughly based on their attributes keywords if postgres,
-- but standard insert is safer. I will map per type roughly.

-- Get Type IDs (Assuming they exist from schema.sql)
-- We'll just randomly assign 3 products to each type for now to ensure results page has data.

DO $$
DECLARE
  r RECORD;
  t_id UUID;
  t_name TEXT;
BEGIN
  -- Iterate all types
  FOR r IN SELECT id, type_name_en FROM diagnostic_types LOOP
    t_id := r.id;
    t_name := r.type_name_en;
    
    -- Map products based on rough keywords or random for demo
    -- Time Saver -> Robot vacuums, Dishwashers, Fast hair dryers
    IF t_name = 'Time Saver Wizard' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE name LIKE '%Roomba%' OR name LIKE '%Cook4me%' OR name LIKE '%Dyson%' ON CONFLICT DO NOTHING;
    
    -- Design Purist -> Balmuda, Dyson, Leica, Nothing Phone
    ELSIF t_name = 'Design Purist' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE brand IN ('BALMUDA', 'Dyson', 'Leica', 'Nothing', 'Herman Miller', 'Vermicular') ON CONFLICT DO NOTHING;
      
    -- Value Hunter -> Salonia, Xiaomi, Anker, Fire TV
    ELSIF t_name = 'Value Hunter' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE price < 15000 OR brand IN ('Anker', 'Xiaomi', 'Salonia') ON CONFLICT DO NOTHING;
      
    -- Brand Loyalist -> Apple, Sony, Dyson
    ELSIF t_name = 'Brand Loyalist' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE brand IN ('Apple', 'Sony', 'Dyson', 'Bose') ON CONFLICT DO NOTHING;
      
    -- Trend Setter -> GoPro, DJI, Nothing Phone, Latest gadgets
    ELSIF t_name = 'Trend Setter' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE name LIKE '%Pixel%' OR name LIKE '%Nothing%' OR brand IN ('DJI', 'Oura') ON CONFLICT DO NOTHING;
      
    -- Practicality Master -> SwitchBot, Panasonic, Sharp
    ELSIF t_name = 'Practicality Master' THEN
      INSERT INTO product_type_mapping (product_id, type_id, priority)
      SELECT id, t_id, 90 FROM products WHERE brand IN ('Panasonic', 'Sharp', 'SwitchBot', 'T-fal') ON CONFLICT DO NOTHING;
      
    ELSE
       -- Others get random stuff
       INSERT INTO product_type_mapping (product_id, type_id, priority)
       SELECT id, t_id, 50 FROM products ORDER BY random() LIMIT 5 ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

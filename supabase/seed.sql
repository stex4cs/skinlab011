-- ============================================================
-- SkinLab 011 - Supabase Database Schema & Seed
-- Pokrenite ovo u Supabase SQL Editor
-- ============================================================

-- 1. KREIRANJE TABELA
-- ============================================================

CREATE TABLE IF NOT EXISTS treatment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_me VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_ru VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL DEFAULT '✨',
    color VARCHAR(7) NOT NULL DEFAULT '#E8D5B7',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES treatment_categories(id) ON DELETE CASCADE,
    name_me VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    name_ru VARCHAR(200) NOT NULL,
    price VARCHAR(20) NOT NULL,
    price_value DECIMAL(10,2),
    duration_minutes INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    treatment_id UUID REFERENCES treatments(id),
    treatment_name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES treatment_categories(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    end_time TIME,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    locale VARCHAR(5) DEFAULT 'me',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksi za performanse
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(booking_date, status);

-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE treatment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Javno čitanje tretmana
CREATE POLICY "Treatments public read" ON treatments FOR SELECT USING (true);
CREATE POLICY "Categories public read" ON treatment_categories FOR SELECT USING (true);

-- Javno kreiranje rezervacija
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- 3. KATEGORIJE TRETMANA
-- ============================================================

INSERT INTO treatment_categories (slug, name_me, name_en, name_ru, icon, color, sort_order) VALUES
('facial',              'Tretmani lica',                      'Facial Treatments',               'Процедуры для лица',         '✨', '#E8D5B7', 1),
('body',                'Tretmani tijela',                    'Body Treatments',                 'Процедуры для тела',         '💆', '#D4E8D5', 2),
('body-packages',       'Tretmani tijela - Paketi',           'Body Treatments - Packages',      'Процедуры для тела - Пакеты','🎁', '#C5D8E8', 3),
('massage',             'Masaže',                             'Massages',                        'Массаж',                     '🤲', '#E8D5E8', 4),
('wax-cold',            'Depilacija hladnim voskom',          'Cold Wax Hair Removal',           'Депиляция холодным воском',  '🦵', '#F5E6D3', 5),
('wax-cold-packages',   'Depilacija hladnim voskom - Paketi', 'Cold Wax Hair Removal - Packages','Депиляция холодным воском - Пакеты','🎁', '#E8E0C5', 6),
('wax-sugar',           'Depilacija šećernom pastom',         'Sugar Paste Hair Removal',        'Депиляция сахарной пастой',  '🍯', '#F0E0D0', 7),
('wax-sugar-packages',  'Depilacija šećernom pastom - Paketi','Sugar Paste Hair Removal - Packages','Депиляция сахарной пастой - Пакеты','🎁', '#D5D0C5', 8)
ON CONFLICT (slug) DO NOTHING;

-- 4. TRETMANI LICA
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'facial')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, duration_minutes, sort_order) VALUES
((SELECT id FROM cat), 'Higijenski tretman lica',                          'Hygienic facial treatment',                       'Гигиеническая процедура для лица',                '50€',    50,   75,  1),
((SELECT id FROM cat), 'Higijenski tretman lica tinejdžeri',               'Hygienic facial treatment for teenagers',          'Гигиеническая процедура для подростков',          '45€',    45,   60,  2),
((SELECT id FROM cat), 'Higijenski + mezoterapija',                        'Hygienic + mesotherapy',                          'Гигиеническая + мезотерапия',                     '70€',    70,   90,  3),
((SELECT id FROM cat), 'Higijenski + mikrodermoabrazijom',                 'Hygienic + microdermabrasion',                    'Гигиеническая + микродермабразия',                '60€',    60,   90,  4),
((SELECT id FROM cat), 'Mikrodermoabrazija',                               'Microdermabrasion',                               'Микродермабразия',                                '45€',    45,   60,  5),
((SELECT id FROM cat), 'Mikrodermoabrazija + mezoterapija',                'Microdermabrasion + mesotherapy',                 'Микродермабразия + мезотерапия',                  '65€',    65,   90,  6),
((SELECT id FROM cat), 'Higijenski + fitopiling',                          'Hygienic + phytopeeling',                         'Гигиеническая + фитопилинг',                      '60€',    60,   90,  7),
((SELECT id FROM cat), 'Fitopiling leđa',                                  'Back phytopeeling',                               'Фитопилинг спины',                                '70€',    70,   60,  8),
((SELECT id FROM cat), 'Čišćenje lica sa ultrazvučnom špatulom',           'Facial cleansing with ultrasonic spatula',        'Чистка лица ультразвуковым шпателем',             '45€',    45,   60,  9),
((SELECT id FROM cat), 'Ultrazvučno čišćenje sa mezoterapijom',            'Ultrasonic cleansing with mesotherapy',           'Ультразвуковая чистка с мезотерапией',            '55€',    55,   75, 10),
((SELECT id FROM cat), 'Hemijski piling',                                  'Chemical peeling',                                'Химический пилинг',                               '50-70€', 50,   60, 11),
((SELECT id FROM cat), 'Higijenski piling kao dodatak uz tretman lica',    'Hygienic peeling as add-on to facial treatment',  'Гигиенический пилинг как дополнение к процедуре', '10€',    10,   15, 12),
((SELECT id FROM cat), 'Fitopiling',                                       'Phytopeeling',                                    'Фитопилинг',                                      '45€',    45,   60, 13),
((SELECT id FROM cat), 'Detox',                                            'Detox',                                           'Детокс',                                          '45€',    45,   60, 14),
((SELECT id FROM cat), 'Higijenski + detox',                               'Hygienic + detox',                                'Гигиеническая + детокс',                          '70€',    70,   90, 15),
((SELECT id FROM cat), 'Radiotalasni lifting lica i vrata',                'Radiofrequency lifting face and neck',             'Радиочастотный лифтинг лица и шеи',               '55€',    55,   60, 16),
((SELECT id FROM cat), 'Radiotalasni lifting 6 tretmana',                  'Radiofrequency lifting 6 treatments',             'Радиочастотный лифтинг 6 процедур',               '250€',   250,  60, 17),
((SELECT id FROM cat), 'Mikronidling',                                     'Microneedling',                                   'Микронидлинг',                                    '80€',    80,   60, 18),
((SELECT id FROM cat), 'Higijenski + hemijski + mikronidling',             'Hygienic + chemical + microneedling',             'Гигиеническая + химический + микронидлинг',       '110€',   110,  120, 19),
((SELECT id FROM cat), 'Biorevitalizacija',                                'Biorevitalization',                               'Биоревитализация',                                '120€',   120,  60, 20),
((SELECT id FROM cat), 'Led terapija',                                     'LED therapy',                                     'LED-терапия',                                     '30€',    30,   30, 21),
((SELECT id FROM cat), 'Led terapija 3 tretmana',                          'LED therapy 3 treatments',                        'LED-терапия 3 процедуры',                         '70€',    70,   90, 22),
((SELECT id FROM cat), 'Led terapija kao dodatak uz tretman lica',         'LED therapy as add-on to facial treatment',       'LED-терапия как дополнение к процедуре',          '10€',    10,   15, 23),
((SELECT id FROM cat), 'Personalizovani tretmani lica',                    'Personalized facial treatments',                  'Персонализированные процедуры для лица',          '80€',    80,   90, 24),
((SELECT id FROM cat), 'Asa peel tretman',                                 'Asa peel treatment',                              'Asa peel процедура',                              '50€',    50,   60, 25),
((SELECT id FROM cat), 'A clasic tretman',                                 'A clasic treatment',                              'A clasic процедура',                              '50€',    50,   60, 26),
((SELECT id FROM cat), 'Tomato glow',                                      'Tomato glow',                                     'Tomato glow',                                     '80€',    80,   60, 27);

-- 5. TRETMANI TIJELA
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'body')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, duration_minutes, sort_order) VALUES
((SELECT id FROM cat), 'Presoterapija (45 minuta)',              'Pressotherapy (45 minutes)',         'Прессотерапия (45 минут)',             '20€', 20, 45, 1),
((SELECT id FROM cat), 'RF stomak',                              'RF abdomen',                         'RF живот',                            '30€', 30, 45, 2),
((SELECT id FROM cat), 'RF ruke',                                'RF arms',                            'RF руки',                             '20€', 20, 30, 3),
((SELECT id FROM cat), 'RF butine + gluteus',                    'RF thighs + glutes',                 'RF бёдра + ягодицы',                  '35€', 35, 45, 4),
((SELECT id FROM cat), 'Kavitacija stomak + drenaža',            'Cavitation abdomen + drainage',      'Кавитация живот + дренаж',            '30€', 30, 45, 5),
((SELECT id FROM cat), 'Kavitacija ruke + drenaža',              'Cavitation arms + drainage',         'Кавитация руки + дренаж',             '20€', 20, 30, 6),
((SELECT id FROM cat), 'Kavitacija butine gluteus + drenaža',    'Cavitation thighs glutes + drainage','Кавитация бёдра ягодицы + дренаж',    '35€', 35, 45, 7);

-- 6. TRETMANI TIJELA - PAKETI
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'body-packages')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, sort_order) VALUES
((SELECT id FROM cat), 'Presoterapija 10 tretmana',              'Pressotherapy 10 treatments',        'Прессотерапия 10 процедур',           '180€', 180, 1),
((SELECT id FROM cat), 'RF stomak 6 tretmana',                   'RF abdomen 6 treatments',            'RF живот 6 процедур',                 '160€', 160, 2),
((SELECT id FROM cat), 'RF ruke 6 tretmana',                     'RF arms 6 treatments',               'RF руки 6 процедур',                  '100€', 100, 3),
((SELECT id FROM cat), 'RF butine + gluteus',                    'RF thighs + glutes',                 'RF бёдра + ягодицы',                  '190€', 190, 4),
((SELECT id FROM cat), 'Kavitacija stomak 6 tretmana',           'Cavitation abdomen 6 treatments',    'Кавитация живот 6 процедур',          '160€', 160, 5),
((SELECT id FROM cat), 'Kavitacija ruke 6 tretmana',             'Cavitation arms 6 treatments',       'Кавитация руки 6 процедур',           '100€', 100, 6),
((SELECT id FROM cat), 'Kavitacija butine + gluteus 6 tretmana', 'Cavitation thighs + glutes 6 treatments','Кавитация бёдра + ягодицы 6 процедур','190€', 190, 7);

-- 7. MASAŽE
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'massage')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, duration_minutes, sort_order) VALUES
((SELECT id FROM cat), 'Masaža lica, vrata i dekoltea 30 min (+ serum i maska)', 'Face, neck and decollete massage 30 min (+ serum and mask)', 'Массаж лица, шеи и декольте 30 мин (+ сыворотка и маска)', '30€', 30, 30,  1),
((SELECT id FROM cat), 'Relax 30 minuta',                        'Relaxation 30 minutes',              'Релакс 30 минут',                     '25€', 25, 30,  2),
((SELECT id FROM cat), 'Relax 45 minuta',                        'Relaxation 45 minutes',              'Релакс 45 минут',                     '35€', 35, 45,  3),
((SELECT id FROM cat), 'Relax 60 minuta',                        'Relaxation 60 minutes',              'Релакс 60 минут',                     '55€', 55, 60,  4),
((SELECT id FROM cat), 'Relax 90 minuta',                        'Relaxation 90 minutes',              'Релакс 90 минут',                     '70€', 70, 90,  5),
((SELECT id FROM cat), 'Piling kao dodatak uz masažu',           'Peeling as add-on to massage',       'Пилинг как дополнение к массажу',     '10€', 10, 15,  6),
((SELECT id FROM cat), 'Terapeutska masaža 30 minuta',           'Therapeutic massage 30 minutes',     'Терапевтический массаж 30 минут',     '30€', 30, 30,  7),
((SELECT id FROM cat), 'Terapeutska masaža 45 minuta',           'Therapeutic massage 45 minutes',     'Терапевтический массаж 45 минут',     '40€', 40, 45,  8),
((SELECT id FROM cat), 'Terapeutska masaža 60 minuta',           'Therapeutic massage 60 minutes',     'Терапевтический массаж 60 минут',     '65€', 65, 60,  9),
((SELECT id FROM cat), 'Limfna drenaža 45 minuta',               'Lymphatic drainage 45 minutes',      'Лимфодренаж 45 минут',                '35€', 35, 45, 10),
((SELECT id FROM cat), 'Anticelulit masaža 45 minuta',           'Anti-cellulite massage 45 minutes',  'Антицеллюлитный массаж 45 минут',     '25€', 25, 45, 11),
((SELECT id FROM cat), 'Anticelulit masaža 10 tretmana',         'Anti-cellulite massage 10 treatments','Антицеллюлитный массаж 10 процедур',  '225€', 225, 45, 12),
((SELECT id FROM cat), 'Beauty spa detox 90 min (piling lica i tijela, relax masaža)', 'Beauty spa detox 90 min (face and body peeling, relaxation massage)', 'Beauty spa детокс 90 мин (пилинг лица и тела, релакс массаж)', '80€', 80, 90, 13);

-- 8. DEPILACIJA HLADNIM VOSKOM
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'wax-cold')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, duration_minutes, sort_order) VALUES
((SELECT id FROM cat), 'Depilacija nausnica',     'Upper lip hair removal',  'Депиляция усиков',             '4€',  4,  15, 1),
((SELECT id FROM cat), 'Depilacija pola ruku',    'Half arms hair removal',  'Депиляция половины рук',       '8€',  8,  20, 2),
((SELECT id FROM cat), 'Depilacija cijelih ruku', 'Full arms hair removal',  'Депиляция полных рук',         '10€', 10, 30, 3),
((SELECT id FROM cat), 'Depilacija pola nogu',    'Half legs hair removal',  'Депиляция половины ног',       '11€', 11, 30, 4),
((SELECT id FROM cat), 'Depilacija cijelih nogu', 'Full legs hair removal',  'Депиляция полных ног',         '19€', 19, 45, 5),
((SELECT id FROM cat), 'Depilacija leđa',         'Back hair removal',       'Депиляция спины',              '6€',  6,  20, 6);

-- 9. DEPILACIJA HLADNIM VOSKOM - PAKETI
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'wax-cold-packages')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, sort_order) VALUES
((SELECT id FROM cat), 'Cijele noge + cijele ruke hladnim + duboke prepone šećernom pastom', 'Full legs + full arms cold wax + deep bikini sugar paste',         'Полные ноги + полные руки воском + глубокое бикини сахарной пастой',  '36€', 36, 1),
((SELECT id FROM cat), 'Cijele noge hladnim + duboke prepone hladnim',                        'Full legs cold wax + deep bikini cold wax',                        'Полные ноги воском + глубокое бикини воском',                         '28€', 28, 2),
((SELECT id FROM cat), 'Cijele noge + cijele ruke hladnim + brazilska šećernom pastom',       'Full legs + full arms cold wax + Brazilian sugar paste',           'Полные ноги + полные руки воском + бразильская сахарной пастой',      '40€', 40, 3),
((SELECT id FROM cat), 'Cijele noge hladnim + brazilska šećernom pastom',                     'Full legs cold wax + Brazilian sugar paste',                       'Полные ноги воском + бразильская сахарной пастой',                    '34€', 34, 4),
((SELECT id FROM cat), 'Cijele noge + cijele ruke',                                           'Full legs + full arms',                                            'Полные ноги + полные руки',                                           '26€', 26, 5);

-- 10. DEPILACIJA ŠEĆERNOM PASTOM
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'wax-sugar')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, duration_minutes, sort_order) VALUES
((SELECT id FROM cat), 'Depilacija nausnica',           'Upper lip hair removal',         'Депиляция усиков',                   '5€',  5,  15,  1),
((SELECT id FROM cat), 'Depilacija pazuha',             'Underarm hair removal',          'Депиляция подмышек',                 '9€',  9,  20,  2),
((SELECT id FROM cat), 'Depilacija leđa',               'Back hair removal',              'Депиляция спины',                    '8€',  8,  20,  3),
((SELECT id FROM cat), 'Depilacija plitkih prepona',    'Standard bikini hair removal',   'Депиляция классическое бикини',      '11€', 11, 20,  4),
((SELECT id FROM cat), 'Depilacija dubokih prepona',    'Deep bikini hair removal',       'Депиляция глубокое бикини',          '15€', 15, 25,  5),
((SELECT id FROM cat), 'Depilacija brazilska + gluteus','Brazilian + glutes hair removal','Бразильская депиляция + ягодицы',    '20€', 20, 30,  6),
((SELECT id FROM cat), 'Depilacija pola ruku',          'Half arms hair removal',         'Депиляция половины рук',             '10€', 10, 20,  7),
((SELECT id FROM cat), 'Depilacija cijelih ruku',       'Full arms hair removal',         'Депиляция полных рук',               '12€', 12, 30,  8),
((SELECT id FROM cat), 'Depilacija pola nogu',          'Half legs hair removal',         'Депиляция половины ног',             '13€', 13, 30,  9),
((SELECT id FROM cat), 'Depilacija cijelih nogu',       'Full legs hair removal',         'Депиляция полных ног',               '23€', 23, 45, 10);

-- 11. DEPILACIJA ŠEĆERNOM PASTOM - PAKETI
-- ============================================================

WITH cat AS (SELECT id FROM treatment_categories WHERE slug = 'wax-sugar-packages')
INSERT INTO treatments (category_id, name_me, name_en, name_ru, price, price_value, sort_order) VALUES
((SELECT id FROM cat), 'Cijele noge + cijele ruke',                          'Full legs + full arms',                       'Полные ноги + полные руки',                          '31€', 31, 1),
((SELECT id FROM cat), 'Cijele noge + duboke prepone',                       'Full legs + deep bikini',                     'Полные ноги + глубокое бикини',                      '32€', 32, 2),
((SELECT id FROM cat), 'Cijele noge + brazilska depilacija',                 'Full legs + Brazilian',                       'Полные ноги + бразильская депиляция',                '37€', 37, 3),
((SELECT id FROM cat), 'Pola nogu + duboke prepone',                         'Half legs + deep bikini',                     'Половина ног + глубокое бикини',                     '26€', 26, 4),
((SELECT id FROM cat), 'Pola nogu + brazilska depilacija',                   'Half legs + Brazilian',                       'Половина ног + бразильская депиляция',               '28€', 28, 5),
((SELECT id FROM cat), 'Cijele noge + cijele ruke + duboke prepone',         'Full legs + full arms + deep bikini',         'Полные ноги + полные руки + глубокое бикини',        '40€', 40, 6),
((SELECT id FROM cat), 'Cijele noge + cijele ruke + brazilska',              'Full legs + full arms + Brazilian',           'Полные ноги + полные руки + бразильская',            '45€', 45, 7);

-- 12. ADMIN USER (zamijenite sa stvarnim emailom)
-- ============================================================

INSERT INTO admin_users (email, name, role) VALUES
('business@bif.events', 'Neda Vukobrat', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- GOTOVO! Ukupno kategorija: 8, Ukupno tretmana: 81
-- ============================================================

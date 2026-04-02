-- =============================================
-- 샘플 상품 데이터 (가격표 이미지 기준)
-- supabase-schema.sql 실행 후 실행하세요
-- =============================================

-- =============================================
-- 1. 춘천고 상품
-- =============================================
INSERT INTO products (school_id, name, category, uniform_type, gender, base_price, sort_order)
SELECT s.id, p.name, p.category, p.uniform_type, p.gender, p.base_price, p.sort_order
FROM schools s,
(VALUES
  ('상의(동복)',   '교복상의',   '동복',   '남', 116000, 1),
  ('하의(동복)',   '교복하의',   '동복',   '남',  75000, 2),
  ('조끼/스웨터', '조끼',       '동복',   '남',  54000, 3),
  ('셔츠',        '셔츠',       '동복',   '남',  54000, 4),
  ('넥타이',      '넥타이',     '동복',   '남',  10000, 5),
  ('상의(하복)',   '교복상의',   '하복',   '남',  54000, 6),
  ('하의(하복)',   '교복하의',   '하복',   '남',  62000, 7),
  ('체육복 상의', '체육복상의', '체육복', '공용', 89000, 8)
) AS p(name, category, uniform_type, gender, base_price, sort_order)
WHERE s.name = '춘천고';

-- =============================================
-- 2. 춘천중 상품
-- =============================================
INSERT INTO products (school_id, name, category, uniform_type, gender, base_price, sort_order)
SELECT s.id, p.name, p.category, p.uniform_type, p.gender, p.base_price, p.sort_order
FROM schools s,
(VALUES
  ('상의(동복)',    '교복상의',   '동복',   '공용', 116000, 1),
  ('하의(동복)',    '교복하의',   '동복',   '공용',  75000, 2),
  ('조끼/스웨터',  '조끼',       '동복',   '공용',  54000, 3),
  ('셔츠/블라우스','셔츠',       '동복',   '공용',  54000, 4),
  ('넥타이/리본',  '넥타이',     '동복',   '공용',  10000, 5),
  ('상의(하복)',    '교복상의',   '하복',   '공용',  54000, 6),
  ('하의(하복)',    '교복하의',   '하복',   '공용',  62000, 7),
  ('체육복 상의',  '체육복상의', '체육복', '공용',  89000, 8),
  ('명찰(천)',      '명찰',       '명찰',   '공용',   2000, 9)
) AS p(name, category, uniform_type, gender, base_price, sort_order)
WHERE s.name = '춘천중';

-- =============================================
-- 3. 공통 상품 (school_id = NULL)
-- =============================================
INSERT INTO products (school_id, name, category, uniform_type, gender, base_price, sort_order)
VALUES
  (NULL, '천명찰',    '명찰',       '명찰',   '공용',  2000, 1),
  (NULL, '부착명찰',  '명찰',       '명찰',   '공용',  2000, 2),
  (NULL, '가디건',    '기타',       '동복',   '공용', 69000, 3),
  (NULL, '브이넥긴팔','기타',       '동복',   '공용', 65000, 4),
  (NULL, '기모바지',  '교복하의',   '동복',   '공용', 79000, 5),
  (NULL, '기모체육복','체육복하의', '체육복', '공용', 96000, 6);

-- =============================================
-- 4. 사이즈 변형 — 춘천고
-- =============================================
INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 116000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('85',1),('90',2),('95',3),('100',4),('105',5),('110',6),('115',7)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '상의(동복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 75000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('55',1),('60',2),('65',3),('70',4),('75',5),('80',6),('85',7)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '하의(동복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 54000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('85',1),('90',2),('95',3),('100',4),('105',5),('110',6)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '조끼/스웨터';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 54000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('85',1),('90',2),('95',3),('100',4),('105',5)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '셔츠';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, 'FREE', 10000, 1
FROM products p
JOIN schools s ON p.school_id = s.id
WHERE s.name = '춘천고' AND p.name = '넥타이';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 54000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('85',1),('90',2),('95',3),('100',4),('105',5),('110',6),('115',7)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '상의(하복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 62000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('55',1),('60',2),('65',3),('70',4),('75',5),('80',6),('85',7)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '하의(하복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 89000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5),('100',6),('105',7),('110',8)) AS v(size_name, ord)
WHERE s.name = '춘천고' AND p.name = '체육복 상의';

-- =============================================
-- 5. 사이즈 변형 — 춘천중
-- =============================================
INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 116000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('85',1),('90',2),('95',3),('100',4),('105',5),('110',6),('115',7)) AS v(size_name, ord)
WHERE s.name = '춘천중' AND p.name = '상의(동복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 75000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('55',1),('60',2),('65',3),('70',4),('75',5),('80',6),('85',7)) AS v(size_name, ord)
WHERE s.name = '춘천중' AND p.name = '하의(동복)';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 89000, v.ord
FROM products p
JOIN schools s ON p.school_id = s.id
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5),('100',6),('105',7),('110',8)) AS v(size_name, ord)
WHERE s.name = '춘천중' AND p.name = '체육복 상의';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, 'FREE', 2000, 1
FROM products p
JOIN schools s ON p.school_id = s.id
WHERE s.name = '춘천중' AND p.name = '명찰(천)';

-- =============================================
-- 6. 공통 상품 사이즈 변형
-- =============================================
INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, 'FREE', p.base_price, 1
FROM products p
WHERE p.school_id IS NULL AND p.name IN ('천명찰', '부착명찰');

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 69000, v.ord
FROM products p
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5)) AS v(size_name, ord)
WHERE p.school_id IS NULL AND p.name = '가디건';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 65000, v.ord
FROM products p
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5)) AS v(size_name, ord)
WHERE p.school_id IS NULL AND p.name = '브이넥긴팔';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 79000, v.ord
FROM products p
CROSS JOIN (VALUES ('55',1),('60',2),('65',3),('70',4),('75',5),('80',6)) AS v(size_name, ord)
WHERE p.school_id IS NULL AND p.name = '기모바지';

INSERT INTO product_variants (product_id, size, price, sort_order)
SELECT p.id, v.size_name, 96000, v.ord
FROM products p
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5)) AS v(size_name, ord)
WHERE p.school_id IS NULL AND p.name = '기모체육복';

-- =============================================
-- 7. 재고 초기화 (모든 variant 10개씩)
-- =============================================
INSERT INTO inventory (variant_id, quantity, reserved_quantity)
SELECT id, 10, 0
FROM product_variants
ON CONFLICT (variant_id) DO NOTHING;

-- =============================================
-- 8. 관리자 계정 (초기 비밀번호: smart2026!)
-- =============================================
INSERT INTO admin_users (username, password_hash, role)
VALUES ('admin', 'smart2026!', 'super')
ON CONFLICT (username) DO NOTHING;
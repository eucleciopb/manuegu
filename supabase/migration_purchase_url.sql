-- Link opcional de compra nos presentes
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS purchase_url TEXT;

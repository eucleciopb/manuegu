-- Migração: contribuição PIX para quem não comparece
-- Execute no SQL Editor do Supabase se o banco já existia antes desta atualização

ALTER TABLE guests ADD COLUMN IF NOT EXISTS pix_contribution_amount DECIMAL(10, 2);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS pix_contribution_status TEXT
  CHECK (pix_contribution_status IN ('pending', 'confirmed'));

DROP POLICY IF EXISTS "Convidados podem ser atualizados" ON guests;
CREATE POLICY "Convidados podem ser atualizados" ON guests FOR UPDATE USING (true);

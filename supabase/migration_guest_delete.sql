-- Permite excluir convidados pelo painel admin (reservas e PIX são removidos em cascata)
DROP POLICY IF EXISTS "Convidados podem ser deletados" ON guests;
CREATE POLICY "Convidados podem ser deletados" ON guests FOR DELETE USING (true);

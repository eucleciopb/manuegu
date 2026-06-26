-- Políticas para CRUD de presentes no admin
-- Execute no SQL Editor do Supabase

DROP POLICY IF EXISTS "Presentes podem ser criados" ON gifts;
DROP POLICY IF EXISTS "Presentes podem ser excluídos" ON gifts;

CREATE POLICY "Presentes podem ser criados" ON gifts FOR INSERT WITH CHECK (true);
CREATE POLICY "Presentes podem ser excluídos" ON gifts FOR DELETE USING (true);

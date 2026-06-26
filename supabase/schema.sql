-- Chá de Casa Nova — Manu & Gustavo
-- Execute este script no SQL Editor do Supabase (pode rodar mais de uma vez)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tabelas ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  will_attend BOOLEAN NOT NULL DEFAULT false,
  guest_count INTEGER,
  message TEXT,
  pix_contribution_amount DECIMAL(10, 2),
  pix_contribution_status TEXT CHECK (pix_contribution_status IN ('pending', 'confirmed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  purchase_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('bring', 'pix')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gift_id)
);

CREATE TABLE IF NOT EXISTS pix_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  reservation_id UUID NOT NULL REFERENCES gift_reservations(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- ─── Índices ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
CREATE INDEX IF NOT EXISTS idx_gift_reservations_guest ON gift_reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_pix_payments_status ON pix_payments(status);

-- ─── RLS ─────────────────────────────────────────────────────────────────

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Presentes visíveis para todos" ON gifts;
DROP POLICY IF EXISTS "Convidados podem se registrar" ON guests;
DROP POLICY IF EXISTS "Convidados podem ser lidos" ON guests;
DROP POLICY IF EXISTS "Convidados podem ser atualizados" ON guests;
DROP POLICY IF EXISTS "Convidados podem ser deletados" ON guests;
DROP POLICY IF EXISTS "Reservas podem ser criadas" ON gift_reservations;
DROP POLICY IF EXISTS "Reservas podem ser lidas" ON gift_reservations;
DROP POLICY IF EXISTS "Reservas podem ser deletadas" ON gift_reservations;
DROP POLICY IF EXISTS "Presentes podem ser atualizados" ON gifts;
DROP POLICY IF EXISTS "Presentes podem ser criados" ON gifts;
DROP POLICY IF EXISTS "Presentes podem ser excluídos" ON gifts;
DROP POLICY IF EXISTS "PIX pode ser criado" ON pix_payments;
DROP POLICY IF EXISTS "PIX pode ser lido" ON pix_payments;
DROP POLICY IF EXISTS "PIX pode ser atualizado" ON pix_payments;
DROP POLICY IF EXISTS "PIX pode ser deletado" ON pix_payments;

CREATE POLICY "Presentes visíveis para todos" ON gifts FOR SELECT USING (true);
CREATE POLICY "Presentes podem ser criados" ON gifts FOR INSERT WITH CHECK (true);
CREATE POLICY "Presentes podem ser atualizados" ON gifts FOR UPDATE USING (true);
CREATE POLICY "Presentes podem ser excluídos" ON gifts FOR DELETE USING (true);
CREATE POLICY "Convidados podem se registrar" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Convidados podem ser lidos" ON guests FOR SELECT USING (true);
CREATE POLICY "Convidados podem ser atualizados" ON guests FOR UPDATE USING (true);
CREATE POLICY "Convidados podem ser deletados" ON guests FOR DELETE USING (true);
CREATE POLICY "Reservas podem ser criadas" ON gift_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Reservas podem ser lidas" ON gift_reservations FOR SELECT USING (true);
CREATE POLICY "Reservas podem ser deletadas" ON gift_reservations FOR DELETE USING (true);
CREATE POLICY "PIX pode ser criado" ON pix_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "PIX pode ser lido" ON pix_payments FOR SELECT USING (true);
CREATE POLICY "PIX pode ser atualizado" ON pix_payments FOR UPDATE USING (true);
CREATE POLICY "PIX pode ser deletado" ON pix_payments FOR DELETE USING (true);

-- ─── Reserva atômica (evita dois convidados no mesmo presente) ───────────

CREATE OR REPLACE FUNCTION reserve_gift_atomic(
  p_guest_id UUID,
  p_gift_id UUID,
  p_delivery_method TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_gift gifts%ROWTYPE;
  v_reservation gift_reservations%ROWTYPE;
  v_pix pix_payments%ROWTYPE;
BEGIN
  SELECT * INTO v_gift
  FROM gifts
  WHERE id = p_gift_id AND status = 'available'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Presente não está mais disponível.';
  END IF;

  UPDATE gifts SET status = 'reserved' WHERE id = p_gift_id;

  INSERT INTO gift_reservations (guest_id, gift_id, delivery_method)
  VALUES (p_guest_id, p_gift_id, p_delivery_method)
  RETURNING * INTO v_reservation;

  IF p_delivery_method = 'pix' THEN
    INSERT INTO pix_payments (guest_id, gift_id, reservation_id, amount, status)
    VALUES (p_guest_id, p_gift_id, v_reservation.id, v_gift.price, 'pending')
    RETURNING * INTO v_pix;

    RETURN json_build_object(
      'reservation', row_to_json(v_reservation),
      'pix_payment', row_to_json(v_pix)
    );
  END IF;

  RETURN json_build_object(
    'reservation', row_to_json(v_reservation),
    'pix_payment', NULL
  );
END;
$$;

GRANT EXECUTE ON FUNCTION reserve_gift_atomic(UUID, UUID, TEXT) TO anon, authenticated;

-- ─── Dados iniciais (só se a tabela estiver vazia) ───────────────────────
-- Lista completa em supabase/seed_gifts_list.sql

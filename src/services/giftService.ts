import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapGifts, mapPixPayment, parseReserveGiftRpc } from '../lib/mappers';
import {
  MOCK_GIFTS,
  MOCK_RESERVATIONS,
  MOCK_PIX_PAYMENTS,
  generateId,
} from '../lib/mockData';
import type {
  Gift,
  GiftReservation,
  PixPayment,
  DeliveryMethod,
  Guest,
  GiftFormData,
} from '../types';

export async function getAvailableGifts(): Promise<Gift[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('status', 'available')
      .order('price', { ascending: true });

    if (error) throw new Error(error.message);
    return mapGifts(data as Gift[]);
  }

  return MOCK_GIFTS.filter((g) => g.status === 'available');
}

export async function getAllGifts(): Promise<Gift[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return mapGifts(data as Gift[]);
  }

  return [...MOCK_GIFTS];
}

export async function reserveGift(
  guestId: string,
  giftId: string,
  deliveryMethod: DeliveryMethod
): Promise<{ reservation: GiftReservation; pixPayment: PixPayment | null }> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('reserve_gift_atomic', {
      p_guest_id: guestId,
      p_gift_id: giftId,
      p_delivery_method: deliveryMethod,
    });

    if (error) throw new Error(error.message || 'Presente não está mais disponível.');
    return parseReserveGiftRpc(data);
  }

  const gift = MOCK_GIFTS.find((g) => g.id === giftId && g.status === 'available');
  if (!gift) throw new Error('Presente não está mais disponível.');

  gift.status = 'reserved';

  const reservation: GiftReservation = {
    id: generateId(),
    guest_id: guestId,
    gift_id: giftId,
    delivery_method: deliveryMethod,
    created_at: new Date().toISOString(),
  };
  MOCK_RESERVATIONS.push(reservation);

  let pixPayment: PixPayment | null = null;
  if (deliveryMethod === 'pix') {
    pixPayment = {
      id: generateId(),
      guest_id: guestId,
      gift_id: giftId,
      reservation_id: reservation.id,
      amount: gift.price,
      status: 'pending',
      created_at: new Date().toISOString(),
      confirmed_at: null,
    };
    MOCK_PIX_PAYMENTS.push(pixPayment);
  }

  return { reservation, pixPayment };
}

export async function releaseGift(giftId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data: reservation } = await supabase
      .from('gift_reservations')
      .select('id')
      .eq('gift_id', giftId)
      .single();

    if (reservation) {
      await supabase.from('pix_payments').delete().eq('gift_id', giftId);
      await supabase.from('gift_reservations').delete().eq('gift_id', giftId);
    }

    const { error } = await supabase
      .from('gifts')
      .update({ status: 'available' })
      .eq('id', giftId);

    if (error) throw new Error(error.message);
    return;
  }

  const gift = MOCK_GIFTS.find((g) => g.id === giftId);
  if (gift) gift.status = 'available';

  const resIndex = MOCK_RESERVATIONS.findIndex((r) => r.gift_id === giftId);
  if (resIndex >= 0) MOCK_RESERVATIONS.splice(resIndex, 1);

  const pixIndex = MOCK_PIX_PAYMENTS.findIndex((p) => p.gift_id === giftId);
  if (pixIndex >= 0) MOCK_PIX_PAYMENTS.splice(pixIndex, 1);
}

export async function getAllReservations(): Promise<GiftReservation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gift_reservations').select('*');
    if (error) throw new Error(error.message);
    return data as GiftReservation[];
  }
  return [...MOCK_RESERVATIONS];
}

export async function getAllPixPayments(): Promise<PixPayment[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('pix_payments').select('*');
    if (error) throw new Error(error.message);
    return (data as PixPayment[]).map(mapPixPayment);
  }
  return [...MOCK_PIX_PAYMENTS];
}

export async function confirmPixPayment(pixId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('pix_payments')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', pixId);

    if (error) throw new Error(error.message);
    return;
  }

  const pix = MOCK_PIX_PAYMENTS.find((p) => p.id === pixId);
  if (pix) {
    pix.status = 'confirmed';
    pix.confirmed_at = new Date().toISOString();
  }
}

export function getGuestForReservation(
  guestId: string,
  guests: Guest[]
): Guest | undefined {
  return guests.find((g) => g.id === guestId);
}

export async function createGift(form: GiftFormData): Promise<Gift> {
  const giftData = {
    name: form.name.trim(),
    image_url: form.image_url.trim(),
    price: parseFloat(form.price.replace(',', '.')),
    purchase_url: form.purchase_url.trim() || null,
    status: 'available' as const,
  };

  if (!giftData.name || !giftData.image_url || isNaN(giftData.price) || giftData.price <= 0) {
    throw new Error('Preencha nome, imagem e um valor válido.');
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gifts').insert(giftData).select().single();
    if (error) throw new Error(error.message);
    return mapGifts([data as Gift])[0];
  }

  const gift: Gift = {
    id: generateId(),
    ...giftData,
    created_at: new Date().toISOString(),
  };
  MOCK_GIFTS.push(gift);
  return gift;
}

export async function updateGift(giftId: string, form: GiftFormData): Promise<Gift> {
  const giftData = {
    name: form.name.trim(),
    image_url: form.image_url.trim(),
    price: parseFloat(form.price.replace(',', '.')),
    purchase_url: form.purchase_url.trim() || null,
  };

  if (!giftData.name || !giftData.image_url || isNaN(giftData.price) || giftData.price <= 0) {
    throw new Error('Preencha nome, imagem e um valor válido.');
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('gifts')
      .update(giftData)
      .eq('id', giftId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapGifts([data as Gift])[0];
  }

  const gift = MOCK_GIFTS.find((g) => g.id === giftId);
  if (!gift) throw new Error('Presente não encontrado.');
  Object.assign(gift, giftData);
  return gift;
}

export async function deleteGift(giftId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data: gift, error: fetchError } = await supabase
      .from('gifts')
      .select('status')
      .eq('id', giftId)
      .single();

    if (fetchError || !gift) throw new Error('Presente não encontrado.');
    if (gift.status === 'reserved') {
      throw new Error('Libere o presente antes de excluir.');
    }

    const { error } = await supabase.from('gifts').delete().eq('id', giftId);
    if (error) throw new Error(error.message);
    return;
  }

  const index = MOCK_GIFTS.findIndex((g) => g.id === giftId);
  if (index < 0) throw new Error('Presente não encontrado.');
  if (MOCK_GIFTS[index].status === 'reserved') {
    throw new Error('Libere o presente antes de excluir.');
  }
  MOCK_GIFTS.splice(index, 1);
}

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_GUESTS, MOCK_GIFTS, MOCK_RESERVATIONS, MOCK_PIX_PAYMENTS, generateId } from '../lib/mockData';
import type { Guest, GuestFormData, RsvpData } from '../types';

function mapGuest(row: Guest): Guest {
  return {
    ...row,
    pix_contribution_amount: row.pix_contribution_amount
      ? Number(row.pix_contribution_amount)
      : null,
  };
}

export async function createGuest(
  form: GuestFormData,
  rsvp: RsvpData
): Promise<Guest> {
  const guestData = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    whatsapp: form.whatsapp.trim(),
    instagram: form.instagram.trim() || null,
    will_attend: rsvp.willAttend,
    guest_count: rsvp.willAttend ? rsvp.guestCount : null,
    message: rsvp.message.trim() || null,
    pix_contribution_amount: null,
    pix_contribution_status: null,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('guests')
      .insert(guestData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapGuest(data as Guest);
  }

  const guest: Guest = {
    id: generateId(),
    ...guestData,
    created_at: new Date().toISOString(),
  };
  MOCK_GUESTS.push(guest);
  return guest;
}

export async function savePixContributionIntent(guestId: string): Promise<Guest> {
  const updateData = {
    pix_contribution_amount: null,
    pix_contribution_status: 'pending' as const,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapGuest(data as Guest);
  }

  const guest = MOCK_GUESTS.find((g) => g.id === guestId);
  if (!guest) throw new Error('Convidado não encontrado.');

  guest.pix_contribution_amount = null;
  guest.pix_contribution_status = 'pending';
  return guest;
}

export async function savePixContribution(
  guestId: string,
  amount: number
): Promise<Guest> {
  const updateData = {
    pix_contribution_amount: amount,
    pix_contribution_status: 'pending' as const,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      ...(data as Guest),
      pix_contribution_amount: Number(data.pix_contribution_amount),
    };
  }

  const guest = MOCK_GUESTS.find((g) => g.id === guestId);
  if (!guest) throw new Error('Convidado não encontrado.');

  guest.pix_contribution_amount = amount;
  guest.pix_contribution_status = 'pending';
  return guest;
}

export async function confirmPixContribution(guestId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('guests')
      .update({ pix_contribution_status: 'confirmed' })
      .eq('id', guestId);

    if (error) throw new Error(error.message);
    return;
  }

  const guest = MOCK_GUESTS.find((g) => g.id === guestId);
  if (guest) guest.pix_contribution_status = 'confirmed';
}

export async function deleteGuest(guestId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data: reservations, error: resError } = await supabase
      .from('gift_reservations')
      .select('gift_id')
      .eq('guest_id', guestId);

    if (resError) throw new Error(resError.message);

    const giftIds = (reservations ?? []).map((r) => r.gift_id);

    if (giftIds.length > 0) {
      const { error: giftError } = await supabase
        .from('gifts')
        .update({ status: 'available' })
        .in('id', giftIds);

      if (giftError) throw new Error(giftError.message);
    }

    const { error } = await supabase.from('guests').delete().eq('id', guestId);
    if (error) throw new Error(error.message);
    return;
  }

  const guestIndex = MOCK_GUESTS.findIndex((g) => g.id === guestId);
  if (guestIndex < 0) throw new Error('Convidado não encontrado.');

  for (const reservation of MOCK_RESERVATIONS.filter((r) => r.guest_id === guestId)) {
    const gift = MOCK_GIFTS.find((g) => g.id === reservation.gift_id);
    if (gift) gift.status = 'available';
  }

  for (let i = MOCK_RESERVATIONS.length - 1; i >= 0; i--) {
    if (MOCK_RESERVATIONS[i].guest_id === guestId) MOCK_RESERVATIONS.splice(i, 1);
  }

  for (let i = MOCK_PIX_PAYMENTS.length - 1; i >= 0; i--) {
    if (MOCK_PIX_PAYMENTS[i].guest_id === guestId) MOCK_PIX_PAYMENTS.splice(i, 1);
  }

  MOCK_GUESTS.splice(guestIndex, 1);
}

export async function getAllGuests(): Promise<Guest[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as Guest[]).map(mapGuest);
  }

  return [...MOCK_GUESTS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

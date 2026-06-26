import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_GUESTS, generateId } from '../lib/mockData';
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

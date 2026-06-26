import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Guest, Gift, GiftReservation, PixPayment } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type DatabaseTables = {
  guests: Guest;
  gifts: Gift;
  gift_reservations: GiftReservation;
  pix_payments: PixPayment;
};

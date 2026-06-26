export type GiftStatus = 'available' | 'reserved';
export type DeliveryMethod = 'bring' | 'pix';
export type PixStatus = 'pending' | 'confirmed';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  instagram: string | null;
  will_attend: boolean;
  guest_count: number | null;
  message: string | null;
  pix_contribution_amount: number | null;
  pix_contribution_status: PixStatus | null;
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  image_url: string;
  price: number;
  purchase_url: string | null;
  status: GiftStatus;
  created_at: string;
}

export interface GiftFormData {
  name: string;
  image_url: string;
  price: string;
  purchase_url: string;
}

export interface GiftReservation {
  id: string;
  guest_id: string;
  gift_id: string;
  delivery_method: DeliveryMethod;
  created_at: string;
}

export interface PixPayment {
  id: string;
  guest_id: string;
  gift_id: string;
  reservation_id: string;
  amount: number;
  status: PixStatus;
  created_at: string;
  confirmed_at: string | null;
}

export interface GuestFormData {
  firstName: string;
  lastName: string;
  whatsapp: string;
  instagram: string;
}

export interface RsvpData {
  willAttend: boolean;
  guestCount: number;
  message: string;
}

export interface ConfirmationRow {
  guest: Guest;
  gift: Gift | null;
  reservation: GiftReservation | null;
  pixPayment: PixPayment | null;
}

export interface GiftCheckoutItem {
  gift: Gift;
  reservation: GiftReservation;
  pixPayment: PixPayment | null;
}

export interface DashboardStats {
  totalConfirmed: number;
  totalPeople: number;
  giftsReserved: number;
  pixPending: number;
  absences: number;
}

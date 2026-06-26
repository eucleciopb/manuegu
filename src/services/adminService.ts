import { getAllGuests, confirmPixContribution } from './guestService';
import {
  getAllGifts,
  getAllReservations,
  getAllPixPayments,
} from './giftService';
import type { ConfirmationRow, DashboardStats } from '../types';

const ADMIN_SESSION_KEY = 'admin_authenticated';

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  return password === adminPassword;
}

export function setAdminSession(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [guests, gifts, reservations, pixPayments] = await Promise.all([
    getAllGuests(),
    getAllGifts(),
    getAllReservations(),
    getAllPixPayments(),
  ]);

  const confirmed = guests.filter((g) => g.will_attend);
  const absences = guests.filter((g) => !g.will_attend);
  const giftPixPending = pixPayments.filter((p) => p.status === 'pending').length;
  const contributionPixPending = guests.filter(
    (g) => g.pix_contribution_status === 'pending'
  ).length;

  return {
    totalConfirmed: confirmed.length,
    totalPeople: confirmed.reduce((sum, g) => sum + (g.guest_count ?? 1), 0),
    giftsReserved: gifts.filter((g) => g.status === 'reserved').length,
    pixPending: giftPixPending + contributionPixPending,
    absences: absences.length,
  };
}

export async function confirmGuestContribution(guestId: string): Promise<void> {
  await confirmPixContribution(guestId);
}

export async function getAllConfirmations(): Promise<ConfirmationRow[]> {
  const [guests, gifts, reservations, pixPayments] = await Promise.all([
    getAllGuests(),
    getAllGifts(),
    getAllReservations(),
    getAllPixPayments(),
  ]);

  return guests.flatMap((guest) => {
    const guestReservations = reservations.filter((r) => r.guest_id === guest.id);

    if (guestReservations.length === 0) {
      return [{ guest, gift: null, reservation: null, pixPayment: null }];
    }

    return guestReservations.map((reservation) => {
      const gift = gifts.find((g) => g.id === reservation.gift_id) ?? null;
      const pixPayment =
        pixPayments.find((p) => p.reservation_id === reservation.id) ?? null;
      return { guest, gift, reservation, pixPayment };
    });
  });
}

import type { Guest, GiftReservation, PixPayment } from '../types';
import { buildMockGifts } from '../data/giftsCatalog';

export const MOCK_GIFTS = buildMockGifts();

export const MOCK_GUESTS: Guest[] = [];
export const MOCK_RESERVATIONS: GiftReservation[] = [];
export const MOCK_PIX_PAYMENTS: PixPayment[] = [];

export function generateId(): string {
  return crypto.randomUUID();
}

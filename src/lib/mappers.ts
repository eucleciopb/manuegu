import type { Gift, GiftReservation, PixPayment } from '../types';

export function mapGift(row: Gift): Gift {
  return { ...row, price: Number(row.price) };
}

export function mapGifts(rows: Gift[]): Gift[] {
  return rows.map(mapGift);
}

export function mapPixPayment(row: PixPayment): PixPayment {
  return { ...row, amount: Number(row.amount) };
}

export function mapReservation(row: GiftReservation): GiftReservation {
  return row;
}

interface ReserveGiftRpcResult {
  reservation: GiftReservation;
  pix_payment: PixPayment | null;
}

export function parseReserveGiftRpc(data: unknown): {
  reservation: GiftReservation;
  pixPayment: PixPayment | null;
} {
  const result = data as ReserveGiftRpcResult;
  return {
    reservation: mapReservation(result.reservation),
    pixPayment: result.pix_payment ? mapPixPayment(result.pix_payment) : null,
  };
}

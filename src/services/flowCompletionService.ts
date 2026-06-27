import { createGuest, savePixContributionIntent } from './guestService';
import { reserveGift } from './giftService';
import type {
  DeliveryMethod,
  Gift,
  GiftCheckoutItem,
  Guest,
  GuestFormData,
  RsvpData,
} from '../types';

interface CompleteGuestFlowParams {
  form: GuestFormData;
  rsvp: RsvpData;
  gifts: Gift[];
  deliveryMethod: DeliveryMethod | null;
  withContributionPix: boolean;
}

export async function completeGuestFlow({
  form,
  rsvp,
  gifts,
  deliveryMethod,
  withContributionPix,
}: CompleteGuestFlowParams): Promise<{ guest: Guest; checkoutItems: GiftCheckoutItem[] }> {
  let guest = await createGuest(form, rsvp);
  const checkoutItems: GiftCheckoutItem[] = [];

  if (rsvp.willAttend && gifts.length > 0 && deliveryMethod) {
    for (const gift of gifts) {
      const result = await reserveGift(guest.id, gift.id, deliveryMethod);
      checkoutItems.push({
        gift,
        reservation: result.reservation,
        pixPayment: result.pixPayment,
      });
    }
  }

  if (!rsvp.willAttend && withContributionPix) {
    guest = await savePixContributionIntent(guest.id);
  }

  return { guest, checkoutItems };
}

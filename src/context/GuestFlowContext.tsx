import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  Guest,
  Gift,
  GuestFormData,
  RsvpData,
  GiftCheckoutItem,
} from '../types';

export type FlowStep =
  | 'welcome'
  | 'identification'
  | 'rsvp'
  | 'contribution'
  | 'gifts'
  | 'delivery'
  | 'thankyou';

interface GuestFlowState {
  step: FlowStep;
  formData: GuestFormData;
  rsvpData: RsvpData;
  guest: Guest | null;
  selectedGifts: Gift[];
  checkoutItems: GiftCheckoutItem[];
  contributionAmount: number | null;
}

interface GuestFlowContextValue extends GuestFlowState {
  setStep: (step: FlowStep) => void;
  setFormData: (data: GuestFormData) => void;
  setRsvpData: (data: RsvpData) => void;
  setGuest: (guest: Guest) => void;
  toggleGift: (gift: Gift) => void;
  isGiftSelected: (giftId: string) => boolean;
  clearSelectedGifts: () => void;
  setCheckoutItems: (items: GiftCheckoutItem[]) => void;
  setContributionAmount: (amount: number | null) => void;
  reset: () => void;
}

const initialFormData: GuestFormData = {
  firstName: '',
  lastName: '',
  whatsapp: '',
  instagram: '',
};

const initialRsvpData: RsvpData = {
  willAttend: true,
  guestCount: 1,
  message: '',
};

const initialState: GuestFlowState = {
  step: 'welcome',
  formData: initialFormData,
  rsvpData: initialRsvpData,
  guest: null,
  selectedGifts: [],
  checkoutItems: [],
  contributionAmount: null,
};

const GuestFlowContext = createContext<GuestFlowContextValue | null>(null);

export function GuestFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuestFlowState>(initialState);

  const value: GuestFlowContextValue = {
    ...state,
    setStep: (step) => setState((s) => ({ ...s, step })),
    setFormData: (formData) => setState((s) => ({ ...s, formData })),
    setRsvpData: (rsvpData) => setState((s) => ({ ...s, rsvpData })),
    setGuest: (guest) => setState((s) => ({ ...s, guest })),
    toggleGift: (gift) =>
      setState((s) => {
        const exists = s.selectedGifts.some((g) => g.id === gift.id);
        return {
          ...s,
          selectedGifts: exists
            ? s.selectedGifts.filter((g) => g.id !== gift.id)
            : [...s.selectedGifts, gift],
        };
      }),
    isGiftSelected: (giftId) => state.selectedGifts.some((g) => g.id === giftId),
    clearSelectedGifts: () => setState((s) => ({ ...s, selectedGifts: [] })),
    setCheckoutItems: (checkoutItems) => setState((s) => ({ ...s, checkoutItems })),
    setContributionAmount: (contributionAmount) =>
      setState((s) => ({ ...s, contributionAmount })),
    reset: () => setState(initialState),
  };

  return (
    <GuestFlowContext.Provider value={value}>{children}</GuestFlowContext.Provider>
  );
}

export function useGuestFlow() {
  const ctx = useContext(GuestFlowContext);
  if (!ctx) throw new Error('useGuestFlow must be used within GuestFlowProvider');
  return ctx;
}

import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { useGuestFlow } from '../context/GuestFlowContext';
import { reserveGift } from '../services/giftService';
import { deliveryMethodLabel } from '../lib/utils';
import type { DeliveryMethod, Gift } from '../types';

interface GiftDeliveryState {
  method: DeliveryMethod | null;
}

export function GiftDeliveryPage() {
  const { guest, selectedGifts, setCheckoutItems, setStep } = useGuestFlow();
  const [deliveryByGift, setDeliveryByGift] = useState<Record<string, GiftDeliveryState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allHaveMethod = selectedGifts.every((g) => deliveryByGift[g.id]?.method);

  function setMethod(giftId: string, method: DeliveryMethod) {
    setDeliveryByGift((prev) => ({
      ...prev,
      [giftId]: { method },
    }));
  }

  async function handleConfirm() {
    if (!guest || selectedGifts.length === 0) return;

    if (!allHaveMethod) {
      setError('Escolha a forma de entrega para cada presente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutItems = [];
      for (const gift of selectedGifts) {
        const method = deliveryByGift[gift.id]!.method!;
        const result = await reserveGift(guest.id, gift.id, method);
        checkoutItems.push({
          gift,
          reservation: result.reservation,
          pixPayment: result.pixPayment,
        });
      }
      setCheckoutItems(checkoutItems);
      setStep('thankyou');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reservar presentes');
    } finally {
      setLoading(false);
    }
  }

  if (selectedGifts.length === 0) return null;

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container flow-container-wide">
        <StepIndicator current={4} total={4} />
        <h2 className="flow-title">Como deseja presentear?</h2>
        <p className="flow-subtitle">
          Para cada presente, escolha se vai levar no dia ou enviar via PIX.
        </p>

        <div className="delivery-gifts-list">
          {selectedGifts.map((gift) => (
            <GiftDeliveryCard
              key={gift.id}
              gift={gift}
              method={deliveryByGift[gift.id]?.method ?? null}
              onSetMethod={(method) => setMethod(gift.id, method)}
            />
          ))}
        </div>

        {error && <p className="form-error-global">{error}</p>}

        <div className="flow-actions">
          <Button variant="outline" onClick={() => setStep('gifts')}>
            Voltar
          </Button>
          <Button loading={loading} disabled={!allHaveMethod} onClick={handleConfirm}>
            Confirmar {selectedGifts.length} presente(s)
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

function GiftDeliveryCard({
  gift,
  method,
  onSetMethod,
}: {
  gift: Gift;
  method: DeliveryMethod | null;
  onSetMethod: (method: DeliveryMethod) => void;
}) {
  return (
    <div className="delivery-gift-card">
      <div className="delivery-gift-header">
        <img src={gift.image_url} alt={gift.name} className="delivery-gift-thumb" />
        <div>
          <h3 className="delivery-gift-name">{gift.name}</h3>
          {method && (
            <span className="delivery-gift-method">{deliveryMethodLabel(method)}</span>
          )}
        </div>
      </div>

      <div className="delivery-gift-options">
        <button
          type="button"
          className={`delivery-option-btn ${method === 'bring' ? 'delivery-option-btn-active' : ''}`}
          onClick={() => onSetMethod('bring')}
        >
          🎁 Levar no dia
        </button>
        <button
          type="button"
          className={`delivery-option-btn ${method === 'pix' ? 'delivery-option-btn-active' : ''}`}
          onClick={() => onSetMethod('pix')}
        >
          💳 Enviar via PIX
        </button>
      </div>
    </div>
  );
}

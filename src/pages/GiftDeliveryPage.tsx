import { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { PurchaseLink } from '../components/gifts/PurchaseLink';
import { PixPaymentBox } from '../components/pix/PixPaymentBox';
import { useGuestFlow } from '../context/GuestFlowContext';
import { reserveGift } from '../services/giftService';
import { formatCurrency, deliveryMethodLabel } from '../lib/utils';
import type { DeliveryMethod, Gift } from '../types';

interface GiftDeliveryState {
  method: DeliveryMethod | null;
}

export function GiftDeliveryPage() {
  const { guest, selectedGifts, setCheckoutItems, setStep } = useGuestFlow();
  const [deliveryByGift, setDeliveryByGift] = useState<Record<string, GiftDeliveryState>>({});
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pixGifts = useMemo(
    () =>
      selectedGifts.filter((g) => deliveryByGift[g.id]?.method === 'pix'),
    [selectedGifts, deliveryByGift]
  );

  const pixTotal = pixGifts.reduce((sum, g) => sum + g.price, 0);
  const allHaveMethod = selectedGifts.every((g) => deliveryByGift[g.id]?.method);

  function setMethod(giftId: string, method: DeliveryMethod) {
    setDeliveryByGift((prev) => ({
      ...prev,
      [giftId]: { method },
    }));
    if (method === 'bring') setPixConfirmed(false);
  }

  async function handleConfirm() {
    if (!guest || selectedGifts.length === 0) return;

    if (!allHaveMethod) {
      setError('Escolha a forma de entrega para cada presente.');
      return;
    }

    if (pixGifts.length > 0 && !pixConfirmed) {
      setError('Por favor, confirme que já realizou o PIX.');
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
          Escolha a forma de entrega para cada um dos {selectedGifts.length} presente(s).
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

        {pixGifts.length > 0 && (
          <div className="pix-combined-section">
            <h3 className="pix-combined-title">
              PIX — {pixGifts.length} presente(s) · {formatCurrency(pixTotal)}
            </h3>
            <ul className="pix-combined-list">
              {pixGifts.map((g) => (
                <li key={g.id}>
                  {g.name} — {formatCurrency(g.price)}
                </li>
              ))}
            </ul>
            <PixPaymentBox
              amount={pixTotal}
              pixConfirmed={pixConfirmed}
              onPixConfirmedChange={setPixConfirmed}
            />
          </div>
        )}

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
          <p className="delivery-gift-price">{formatCurrency(gift.price)}</p>
          {method && (
            <span className="delivery-gift-method">{deliveryMethodLabel(method)}</span>
          )}
        </div>
      </div>

      {method === 'bring' && gift.purchase_url && (
        <div className="purchase-hint purchase-hint-compact">
          <PurchaseLink
            url={gift.purchase_url}
            label="Comprar online"
            variant="button"
          />
        </div>
      )}

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
          💳 PIX {formatCurrency(gift.price)}
        </button>
      </div>
    </div>
  );
}

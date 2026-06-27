import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { useGuestFlow } from '../context/GuestFlowContext';
import type { DeliveryMethod } from '../types';

export function GiftDeliveryPage() {
  const { selectedGifts, setPendingDeliveryMethod, setStep } = useGuestFlow();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [error, setError] = useState('');

  function handleConfirm() {
    if (selectedGifts.length === 0) return;

    if (!deliveryMethod) {
      setError('Escolha como deseja presentear.');
      return;
    }

    setPendingDeliveryMethod(deliveryMethod);
    setStep('thankyou');
  }

  if (selectedGifts.length === 0) return null;

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container flow-container-wide">
        <StepIndicator current={4} total={4} />
        <h2 className="flow-title">Como deseja presentear?</h2>
        <p className="flow-subtitle">
          Escolha uma opção para {selectedGifts.length === 1 ? 'o presente' : 'todos os presentes'}{' '}
          selecionado{selectedGifts.length === 1 ? '' : 's'}.
        </p>

        <div className="delivery-gifts-summary">
          <p className="delivery-gifts-summary-label">Seus presentes:</p>
          <ul className="delivery-gifts-summary-list">
            {selectedGifts.map((gift) => (
              <li key={gift.id} className="delivery-gifts-summary-item">
                <img src={gift.image_url} alt={gift.name} className="delivery-gift-thumb" />
                <span>{gift.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="delivery-method-choice">
          <button
            type="button"
            className={`delivery-option-btn ${deliveryMethod === 'bring' ? 'delivery-option-btn-active' : ''}`}
            onClick={() => {
              setDeliveryMethod('bring');
              setError('');
            }}
          >
            🎁 Levar no dia
          </button>
          <button
            type="button"
            className={`delivery-option-btn ${deliveryMethod === 'pix' ? 'delivery-option-btn-active' : ''}`}
            onClick={() => {
              setDeliveryMethod('pix');
              setError('');
            }}
          >
            💳 Enviar via PIX
          </button>
        </div>

        {error && <p className="form-error-global">{error}</p>}

        <div className="flow-actions">
          <Button variant="outline" onClick={() => setStep('gifts')}>
            Voltar
          </Button>
          <Button disabled={!deliveryMethod} onClick={handleConfirm}>
            Confirmar {selectedGifts.length} presente(s)
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

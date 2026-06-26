import { useEffect, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { GiftCard } from '../components/gifts/GiftCard';
import { useGuestFlow } from '../context/GuestFlowContext';
import { getAvailableGifts } from '../services/giftService';
import { formatCurrency } from '../lib/utils';
import type { Gift } from '../types';

export function GiftSelectionPage() {
  const { selectedGifts, toggleGift, isGiftSelected, setStep } = useGuestFlow();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalSelected = selectedGifts.reduce((sum, g) => sum + g.price, 0);

  useEffect(() => {
    getAvailableGifts()
      .then(setGifts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar presentes'))
      .finally(() => setLoading(false));
  }, []);

  function handleContinue() {
    if (selectedGifts.length > 0) {
      setStep('delivery');
    } else {
      setStep('thankyou');
    }
  }

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container flow-container-wide">
        <StepIndicator current={3} total={4} />
        <h2 className="flow-title">Escolha os presentes</h2>
        <p className="flow-subtitle">
          Você pode selecionar mais de um item. Cada presente pode ser escolhido por apenas uma pessoa.
        </p>

        {loading && <p className="loading-text">Carregando presentes...</p>}
        {error && <p className="form-error-global">{error}</p>}

        {!loading && gifts.length === 0 && (
          <div className="empty-state">
            <p>😔 Todos os presentes já foram escolhidos.</p>
            <p>Mas sua presença já é o maior presente!</p>
          </div>
        )}

        <div className="gifts-grid">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              selected={isGiftSelected(gift.id)}
              onToggle={toggleGift}
            />
          ))}
        </div>

        {selectedGifts.length > 0 && (
          <div className="gift-cart-bar">
            <div className="gift-cart-info">
              <strong>{selectedGifts.length} presente(s) selecionado(s)</strong>
              <span>Total: {formatCurrency(totalSelected)}</span>
            </div>
            <Button onClick={handleContinue}>Continuar</Button>
          </div>
        )}

        <div className="flow-actions flow-actions-center">
          <Button variant="ghost" onClick={() => setStep('thankyou')}>
            Pular — só confirmar presença
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

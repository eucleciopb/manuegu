import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StepIndicator, OptionCard } from '../components/ui/StepIndicator';
import { PixPaymentBox } from '../components/pix/PixPaymentBox';
import { useGuestFlow } from '../context/GuestFlowContext';
import { savePixContribution } from '../services/guestService';
import { formatCurrency } from '../lib/utils';

const PRESET_AMOUNTS = [50, 100, 150, 200];

export function ContributionPage() {
  const { formData, guest, setGuest, setContributionAmount, setStep } = useGuestFlow();
  const [wantsToContribute, setWantsToContribute] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAmount = amount ?? (customAmount ? parseFloat(customAmount.replace(',', '.')) : null);

  function handleSkip() {
    setStep('thankyou');
  }

  async function handleConfirmContribution() {
    if (!guest || !selectedAmount || selectedAmount <= 0) {
      setError('Selecione ou informe um valor válido.');
      return;
    }
    if (!pixConfirmed) {
      setError('Por favor, confirme que já realizou o PIX.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedGuest = await savePixContribution(guest.id, selectedAmount);
      setGuest(updatedGuest);
      setContributionAmount(selectedAmount);
      setStep('thankyou');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar contribuição');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container">
        <StepIndicator current={3} total={3} />
        <h2 className="flow-title">Que tal ajudar o casal?</h2>
        <p className="flow-subtitle">
          {formData.firstName}, sentiremos sua falta! Mesmo não podendo ir, você gostaria de
          contribuir com algum valor via PIX para ajudar Manu & Gustavo?
        </p>

        {wantsToContribute === null && (
          <div className="option-list">
            <OptionCard
              title="Sim, quero contribuir"
              description="Fazer um PIX com o valor que desejar"
              icon="💝"
              selected={false}
              onClick={() => setWantsToContribute(true)}
            />
            <OptionCard
              title="Não, obrigado"
              description="Agradeço o convite de qualquer forma"
              icon="🤍"
              selected={false}
              onClick={handleSkip}
            />
          </div>
        )}

        {wantsToContribute === true && (
          <div className="contribution-section">
            <p className="contribution-label">Escolha um valor ou informe outro:</p>
            <div className="amount-presets">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-preset ${amount === preset ? 'amount-preset-selected' : ''}`}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount('');
                  }}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>

            <Input
              label="Outro valor"
              type="number"
              min={1}
              step={0.01}
              placeholder="Ex: 75.00"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount(null);
              }}
              hint="Opcional — use se quiser um valor diferente"
            />

            {selectedAmount && selectedAmount > 0 && (
              <PixPaymentBox
                amount={selectedAmount}
                pixConfirmed={pixConfirmed}
                onPixConfirmedChange={setPixConfirmed}
              />
            )}

            {error && <p className="form-error-global">{error}</p>}

            <div className="flow-actions">
              <Button variant="outline" onClick={() => setWantsToContribute(null)}>
                Voltar
              </Button>
              <Button loading={loading} onClick={handleConfirmContribution}>
                Confirmar contribuição
              </Button>
            </div>
          </div>
        )}

        {wantsToContribute === null && (
          <div className="flow-actions flow-actions-center">
            <Button variant="ghost" onClick={() => setStep('rsvp')}>
              Voltar
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

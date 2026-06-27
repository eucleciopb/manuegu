import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StepIndicator, OptionCard } from '../components/ui/StepIndicator';
import { useGuestFlow } from '../context/GuestFlowContext';
import { savePixContributionIntent } from '../services/guestService';

export function ContributionPage() {
  const { formData, guest, setGuest, setHasContributionPix, setStep } = useGuestFlow();
  const [wantsToContribute, setWantsToContribute] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSkip() {
    setStep('thankyou');
  }

  async function handleConfirmContribution() {
    if (!guest) return;

    setLoading(true);
    setError('');
    try {
      const updatedGuest = await savePixContributionIntent(guest.id);
      setGuest(updatedGuest);
      setHasContributionPix(true);
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
          enviar um PIX para ajudar Manu & Gustavo?
        </p>

        {wantsToContribute === null && (
          <div className="option-list">
            <OptionCard
              title="Sim, quero contribuir"
              description="Receber a chave PIX na tela de agradecimento"
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
            <p className="contribution-pix-note">
              Na próxima tela você verá a chave PIX. Contribua com o que desejar, no seu tempo.
            </p>

            {error && <p className="form-error-global">{error}</p>}

            <div className="flow-actions">
              <Button variant="outline" onClick={() => setWantsToContribute(null)}>
                Voltar
              </Button>
              <Button loading={loading} onClick={handleConfirmContribution}>
                Continuar
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

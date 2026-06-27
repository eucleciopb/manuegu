import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StepIndicator, OptionCard } from '../components/ui/StepIndicator';
import { useGuestFlow } from '../context/GuestFlowContext';

export function RsvpPage() {
  const { formData, rsvpData, setRsvpData, setStep } = useGuestFlow();

  function handleNext() {
    if (rsvpData.willAttend) {
      setStep('gifts');
    } else {
      setStep('contribution');
    }
  }

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container">
        <StepIndicator current={2} total={4} />
        <h2 className="flow-title">Vai comparecer?</h2>
        <p className="flow-subtitle">
          Olá, {formData.firstName}! Conte pra gente se poderá estar conosco.
        </p>

        <div className="option-list">
          <OptionCard
            title="Sim, estarei presente"
            description="Mal posso esperar para celebrar com vocês!"
            icon="🎉"
            selected={rsvpData.willAttend}
            onClick={() => setRsvpData({ ...rsvpData, willAttend: true })}
          />
          <OptionCard
            title="Infelizmente não poderei ir"
            description="Estarei com vocês de coração."
            icon="💌"
            selected={!rsvpData.willAttend}
            onClick={() => setRsvpData({ ...rsvpData, willAttend: false })}
          />
        </div>

        {rsvpData.willAttend && (
          <div className="rsvp-details">
            <Input
              label="Quantidade de pessoas"
              type="number"
              min={1}
              max={10}
              required
              value={rsvpData.guestCount}
              onChange={(e) =>
                setRsvpData({ ...rsvpData, guestCount: parseInt(e.target.value) || 1 })
              }
            />
            <div className="form-field">
              <label className="form-label">Mensagem para o casal</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Deixe uma mensagem carinhosa (opcional)"
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="flow-actions">
          <Button variant="outline" onClick={() => setStep('identification')}>
            Voltar
          </Button>
          <Button onClick={handleNext}>
            {rsvpData.willAttend ? 'Escolher presente' : 'Continuar'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

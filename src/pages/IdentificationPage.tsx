import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StepIndicator } from '../components/ui/StepIndicator';
import { useGuestFlow } from '../context/GuestFlowContext';

export function IdentificationPage() {
  const { formData, setFormData, setStep } = useGuestFlow();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (formData.whatsapp.replace(/\D/g, '').length < 10) {
      newErrors.whatsapp = 'WhatsApp inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) setStep('rsvp');
  }

  return (
    <PageLayout showHeader={false}>
      <div className="flow-container">
        <StepIndicator current={1} total={4} />
        <h2 className="flow-title">Quem é você?</h2>
        <p className="flow-subtitle">Preencha seus dados para confirmarmos sua presença.</p>

        <div className="form-grid">
          <Input
            label="Nome"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            placeholder="Seu nome"
          />
          <Input
            label="Sobrenome"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Seu sobrenome"
          />
          <Input
            label="WhatsApp"
            required
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            error={errors.whatsapp}
            placeholder="(00) 00000-0000"
            hint="Usaremos para entrar em contato, se necessário"
          />
          <Input
            label="Instagram"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            placeholder="@seuinstagram"
            hint="Opcional"
          />
        </div>

        <div className="flow-actions">
          <Button variant="outline" onClick={() => setStep('welcome')}>
            Voltar
          </Button>
          <Button onClick={handleNext}>Continuar</Button>
        </div>
      </div>
    </PageLayout>
  );
}

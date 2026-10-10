import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { BotanicalGarland } from '../components/decor/BotanicalDecor';
import { useGuestFlow } from '../context/GuestFlowContext';
import { brand } from '../lib/brand';

export function WelcomePage() {
  const { setStep } = useGuestFlow();
  const heroPhoto = import.meta.env.VITE_HERO_PHOTO_URL || brand.heroPhotoDefault;

  return (
    <PageLayout showHeader={false} centered={false}>
      <div className="welcome-hero">
        <img
          src={heroPhoto}
          alt={brand.heroPhotoAlt}
          className="welcome-hero-image"
          style={{ objectPosition: 'top center' }}
        />
        <div className="welcome-hero-overlay">
          <BotanicalGarland className="welcome-hero-garland" />
          <p className="header-subtitle">{brand.eventName}</p>
          <h1 className="header-title">{brand.coupleDisplay}</h1>
        </div>
      </div>

      <div className="welcome-content">
        <h2 className="welcome-title">Estamos construindo nosso lar</h2>
        <p className="welcome-text">
          É com muito carinho que {brand.coupleFullNames} convidam você para celebrar conosco
          esse novo começo. Sua presença é o presente mais especial que poderíamos receber!
        </p>
        <p className="welcome-text-secondary">
          Confirme sua presença e, se desejar, escolha um presente da nossa lista.
        </p>
        <Button size="lg" fullWidth onClick={() => setStep('identification')}>
          Confirmar presença
        </Button>
      </div>
    </PageLayout>
  );
}

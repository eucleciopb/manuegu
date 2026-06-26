import { GuestFlowProvider, useGuestFlow } from './context/GuestFlowContext';
import { WelcomePage } from './pages/WelcomePage';
import { IdentificationPage } from './pages/IdentificationPage';
import { RsvpPage } from './pages/RsvpPage';
import { GiftSelectionPage } from './pages/GiftSelectionPage';
import { GiftDeliveryPage } from './pages/GiftDeliveryPage';
import { ContributionPage } from './pages/ContributionPage';
import { ThankYouPage } from './pages/ThankYouPage';

function GuestFlow() {
  const { step } = useGuestFlow();

  switch (step) {
    case 'welcome':
      return <WelcomePage />;
    case 'identification':
      return <IdentificationPage />;
    case 'rsvp':
      return <RsvpPage />;
    case 'contribution':
      return <ContributionPage />;
    case 'gifts':
      return <GiftSelectionPage />;
    case 'delivery':
      return <GiftDeliveryPage />;
    case 'thankyou':
      return <ThankYouPage />;
    default:
      return <WelcomePage />;
  }
}

function App() {
  return (
    <GuestFlowProvider>
      <GuestFlow />
    </GuestFlowProvider>
  );
}

export default App;

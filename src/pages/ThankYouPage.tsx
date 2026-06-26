import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { PurchaseLink } from '../components/gifts/PurchaseLink';
import { useGuestFlow } from '../context/GuestFlowContext';
import { formatCurrency, deliveryMethodLabel } from '../lib/utils';

export function ThankYouPage() {
  const { formData, rsvpData, checkoutItems, contributionAmount, reset } = useGuestFlow();

  return (
    <PageLayout>
      <div className="thankyou-content">
        <div className="thankyou-icon">💕</div>
        <h2 className="thankyou-title">Obrigado, {formData.firstName}!</h2>

        {rsvpData.willAttend ? (
          <>
            <p className="thankyou-text">
              Sua presença foi registrada com sucesso! Estamos muito felizes em saber que
              você estará conosco
              {rsvpData.guestCount > 1 ? ` com mais ${rsvpData.guestCount - 1} pessoa(s)` : ''}.
            </p>

            {checkoutItems.length > 0 && (
              <div className="thankyou-summary">
                <h3>
                  {checkoutItems.length === 1 ? 'Resumo do presente' : `Resumo dos ${checkoutItems.length} presentes`}
                </h3>
                {checkoutItems.map((item) => (
                  <div key={item.gift.id} className="thankyou-gift-block">
                    <div className="thankyou-summary-row">
                      <span>Presente</span>
                      <strong>{item.gift.name}</strong>
                    </div>
                    <div className="thankyou-summary-row">
                      <span>Valor</span>
                      <strong>{formatCurrency(item.gift.price)}</strong>
                    </div>
                    <div className="thankyou-summary-row">
                      <span>Entrega</span>
                      <strong>{deliveryMethodLabel(item.reservation.delivery_method)}</strong>
                    </div>
                    {item.reservation.delivery_method === 'bring' && item.gift.purchase_url && (
                      <div className="thankyou-purchase-link">
                        <PurchaseLink
                          url={item.gift.purchase_url}
                          label="Comprar online"
                          variant="button"
                          fullWidth
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {checkoutItems.length === 0 && (
              <p className="thankyou-text">
                Sua presença já é o maior presente para nós!
              </p>
            )}
          </>
        ) : (
          <>
            <p className="thankyou-text">
              Sentiremos sua falta, mas entendemos. Obrigado por nos avisar com carinho.
              Estaremos pensando em você nesse dia especial!
            </p>
            {contributionAmount && (
              <div className="thankyou-summary">
                <h3>Sua contribuição</h3>
                <div className="thankyou-summary-row">
                  <span>Valor via PIX</span>
                  <strong>{formatCurrency(contributionAmount)}</strong>
                </div>
                <div className="thankyou-summary-row">
                  <span>Status</span>
                  <strong>Aguardando confirmação</strong>
                </div>
              </div>
            )}
          </>
        )}

        <p className="thankyou-final">
          Com muito amor,<br />
          <strong>Manu & Gustavo</strong>
        </p>

        <Button variant="outline" onClick={reset}>
          Voltar ao início
        </Button>
      </div>
    </PageLayout>
  );
}

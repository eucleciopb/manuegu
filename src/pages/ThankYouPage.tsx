import { useEffect, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { PurchaseLink } from '../components/gifts/PurchaseLink';
import { PixKeyDisplay } from '../components/pix/PixKeyDisplay';
import { useGuestFlow } from '../context/GuestFlowContext';
import { completeGuestFlow } from '../services/flowCompletionService';

export function ThankYouPage() {
  const {
    formData,
    rsvpData,
    guest,
    selectedGifts,
    checkoutItems,
    hasContributionPix,
    pendingDeliveryMethod,
    setGuest,
    setCheckoutItems,
    reset,
  } = useGuestFlow();

  const [submitting, setSubmitting] = useState(!guest);
  const [submitError, setSubmitError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (guest) {
      setSubmitting(false);
      return;
    }

    let cancelled = false;

    async function saveConfirmation() {
      setSubmitting(true);
      setSubmitError('');

      try {
        const result = await completeGuestFlow({
          form: formData,
          rsvp: rsvpData,
          gifts: selectedGifts,
          deliveryMethod: pendingDeliveryMethod,
          withContributionPix: hasContributionPix,
        });

        if (cancelled) return;

        setGuest(result.guest);
        if (result.checkoutItems.length > 0) {
          setCheckoutItems(result.checkoutItems);
        }
      } catch (err) {
        if (cancelled) return;
        setSubmitError(
          err instanceof Error ? err.message : 'Erro ao salvar sua confirmação. Tente novamente.'
        );
      } finally {
        if (!cancelled) setSubmitting(false);
      }
    }

    saveConfirmation();

    return () => {
      cancelled = true;
    };
  }, [
    guest,
    retryCount,
    formData,
    rsvpData,
    selectedGifts,
    pendingDeliveryMethod,
    hasContributionPix,
    setGuest,
    setCheckoutItems,
  ]);

  const bringItems = checkoutItems.filter((item) => item.reservation.delivery_method === 'bring');
  const pixItems = checkoutItems.filter((item) => item.reservation.delivery_method === 'pix');
  const hasPix = pixItems.length > 0 || hasContributionPix;

  if (submitting) {
    return (
      <PageLayout>
        <div className="thankyou-content">
          <p className="loading-text">Salvando sua confirmação...</p>
        </div>
      </PageLayout>
    );
  }

  if (submitError) {
    return (
      <PageLayout>
        <div className="thankyou-content">
          <p className="form-error-global">{submitError}</p>
          <div className="flow-actions flow-actions-center">
            <Button onClick={() => setRetryCount((count) => count + 1)}>
              Tentar novamente
            </Button>
            <Button variant="outline" onClick={reset}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="thankyou-content">
        <div className="thankyou-icon">💕</div>
        <h2 className="thankyou-title">Obrigado, {formData.firstName}!</h2>

        {rsvpData.willAttend ? (
          <>
            <p className="thankyou-text">
              Sua presença foi registrada com muito carinho! Estamos ansiosos para celebrar
              esse momento especial com você
              {rsvpData.guestCount > 1 ? ` e mais ${rsvpData.guestCount - 1} pessoa(s)` : ''}.
            </p>

            {checkoutItems.length === 0 && (
              <p className="thankyou-text thankyou-text-highlight">
                Sua presença já é o maior presente para nós!
              </p>
            )}

            {bringItems.length > 0 && (
              <div className="thankyou-summary">
                <h3>
                  {bringItems.length === 1
                    ? 'Sugestão para comprar'
                    : 'Sugestões para comprar'}
                </h3>
                <p className="thankyou-section-desc">
                  Você escolheu levar no dia. Aqui estão os links dos presentes selecionados:
                </p>
                {bringItems.map((item) => (
                  <div key={item.gift.id} className="thankyou-gift-block">
                    <p className="thankyou-gift-name">{item.gift.name}</p>
                    {item.gift.purchase_url ? (
                      <PurchaseLink
                        url={item.gift.purchase_url}
                        label="Ver sugestão de compra"
                        variant="button"
                        fullWidth
                      />
                    ) : (
                      <p className="thankyou-text">Leve o presente no dia do chá.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {hasPix && (
              <div className="thankyou-summary">
                <h3>Envio via PIX</h3>
                <p className="thankyou-section-desc">
                  {pixItems.length > 0 && (
                    <>
                      Presente(s):{' '}
                      <strong>{pixItems.map((item) => item.gift.name).join(', ')}</strong>
                      <br />
                    </>
                  )}
                  Use a chave abaixo no app do seu banco quando for conveniente:
                </p>
                <PixKeyDisplay
                  hint="Copie a chave e faça o PIX pelo app do seu banco. Obrigado por presentear com tanto carinho!"
                />
                {pixItems.some((item) => item.gift.purchase_url) && (
                  <div className="thankyou-curiosity-links">
                    <p className="thankyou-section-desc">
                      Quer dar uma olhada nos presentes? Só por curiosidade 😊
                    </p>
                    {pixItems.map((item) =>
                      item.gift.purchase_url ? (
                        <div key={item.gift.id} className="thankyou-gift-block">
                          <p className="thankyou-gift-name">{item.gift.name}</p>
                          <PurchaseLink
                            url={item.gift.purchase_url}
                            label="Ver sugestão de compra"
                            variant="button"
                            fullWidth
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="thankyou-text">
              Sentiremos sua falta, mas entendemos. Obrigado por nos avisar com carinho —
              estaremos pensando em você nesse dia especial!
            </p>
            {hasContributionPix && (
              <div className="thankyou-summary">
                <h3>Sua contribuição via PIX</h3>
                <p className="thankyou-section-desc">
                  Muito obrigado por ajudar Manu & Gustavo nessa nova fase. Use a chave abaixo:
                </p>
                <PixKeyDisplay hint="Copie a chave e envie pelo app do seu banco quando preferir." />
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

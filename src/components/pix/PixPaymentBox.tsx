import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { formatCurrency, formatWhatsApp } from '../../lib/utils';
import {
  copyToClipboard,
  generatePixPayload,
  getPixQrCodeUrl,
} from '../../lib/pixPayload';

interface PixPaymentBoxProps {
  amount: number;
  pixKey?: string;
  pixName?: string;
  pixCity?: string;
  pixConfirmed: boolean;
  onPixConfirmedChange: (confirmed: boolean) => void;
}

export function PixPaymentBox({
  amount,
  pixKey = import.meta.env.VITE_PIX_KEY || '',
  pixName = import.meta.env.VITE_PIX_NAME || 'Manu e Gustavo',
  pixCity = import.meta.env.VITE_PIX_CITY || 'SAO PAULO',
  pixConfirmed,
  onPixConfirmedChange,
}: PixPaymentBoxProps) {
  const [copied, setCopied] = useState<'key' | 'code' | null>(null);

  const payload = useMemo(
    () =>
      generatePixPayload({
        pixKey,
        merchantName: pixName,
        merchantCity: pixCity,
        amount,
      }),
    [pixKey, pixName, pixCity, amount]
  );

  const qrUrl = getPixQrCodeUrl(payload);
  const displayKey = formatWhatsApp(pixKey.replace(/\D/g, '').slice(-11) || pixKey);

  async function handleCopy(type: 'key' | 'code', text: string) {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="pix-section">
      <h3 className="pix-title">Dados para PIX</h3>
      <div className="pix-info">
        <div className="pix-row">
          <span className="pix-label">Beneficiário</span>
          <span className="pix-value">{pixName}</span>
        </div>
        <div className="pix-row">
          <span className="pix-label">Chave PIX (telefone)</span>
          <span className="pix-value pix-key">{displayKey}</span>
        </div>
        <div className="pix-row">
          <span className="pix-label">Valor</span>
          <span className="pix-value">{formatCurrency(amount)}</span>
        </div>
      </div>

      <div className="pix-copy-actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCopy('key', pixKey.replace(/\D/g, ''))}
        >
          {copied === 'key' ? 'Chave copiada!' : 'Copiar chave PIX'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCopy('code', payload)}
        >
          {copied === 'code' ? 'Código copiado!' : 'Copiar PIX copia e cola'}
        </Button>
      </div>

      <div className="pix-qr">
        <img src={qrUrl} alt="QR Code PIX" className="pix-qr-image" />
        <p className="pix-qr-hint">
          Escaneie com o app do seu banco ou use o botão &quot;PIX copia e cola&quot;
        </p>
      </div>

      <label className="pix-confirm">
        <input
          type="checkbox"
          checked={pixConfirmed}
          onChange={(e) => onPixConfirmedChange(e.target.checked)}
        />
        Já realizei o PIX
      </label>
    </div>
  );
}

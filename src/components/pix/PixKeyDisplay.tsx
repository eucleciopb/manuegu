import { useState } from 'react';
import { Button } from '../ui/Button';
import { formatWhatsApp } from '../../lib/utils';

interface PixKeyDisplayProps {
  pixKey?: string;
  pixName?: string;
  title?: string;
  hint?: string;
}

export function PixKeyDisplay({
  pixKey = import.meta.env.VITE_PIX_KEY || '',
  pixName = import.meta.env.VITE_PIX_NAME || 'Manu e Gustavo',
  title = 'Chave PIX',
  hint = 'Use esta chave no app do seu banco para enviar o PIX.',
}: PixKeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const rawKey = pixKey.replace(/\D/g, '') || pixKey;
  const displayKey = formatWhatsApp(rawKey.slice(-11) || rawKey);

  async function handleCopy() {
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pix-key-display">
      <h3 className="pix-key-title">{title}</h3>
      <div className="pix-info">
        <div className="pix-row">
          <span className="pix-label">Beneficiário</span>
          <span className="pix-value">{pixName}</span>
        </div>
        <div className="pix-row">
          <span className="pix-label">Chave PIX</span>
          <span className="pix-value pix-key">{displayKey}</span>
        </div>
      </div>
      <p className="pix-key-hint">{hint}</p>
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copied ? 'Chave copiada!' : 'Copiar chave PIX'}
      </Button>
    </div>
  );
}

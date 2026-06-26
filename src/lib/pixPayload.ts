export interface PixPayloadOptions {
  pixKey: string;
  merchantName: string;
  merchantCity?: string;
  amount: number;
  txid?: string;
}

function formatField(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function normalizePixKey(key: string): string {
  const trimmed = key.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.includes('@')) return trimmed;
  if (digits.length === 11) return `+55${digits}`;
  if (digits.length === 13 && digits.startsWith('55')) return `+${digits}`;
  if (digits.length === 10) return `+55${digits}`;
  return trimmed;
}

export function generatePixPayload({
  pixKey,
  merchantName,
  merchantCity = 'SAO PAULO',
  amount,
  txid = '***',
}: PixPayloadOptions): string {
  const key = normalizePixKey(pixKey);
  const name = merchantName.substring(0, 25).toUpperCase();
  const city = merchantCity.substring(0, 15).toUpperCase();
  const value = amount.toFixed(2);

  const merchantAccount = formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', key);
  const additionalData = formatField('05', txid.substring(0, 25));

  const payloadWithoutCrc = [
    formatField('00', '01'),
    formatField('26', merchantAccount),
    formatField('52', '0000'),
    formatField('53', '986'),
    formatField('54', value),
    formatField('58', 'BR'),
    formatField('59', name),
    formatField('60', city),
    formatField('62', additionalData),
  ].join('');

  const crc = crc16(payloadWithoutCrc + '6304');
  return payloadWithoutCrc + '6304' + crc;
}

export function getPixQrCodeUrl(payload: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&margin=10`;
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

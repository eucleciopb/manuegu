import { useEffect, useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Gift, GiftFormData } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface GiftFormModalProps {
  gift?: Gift | null;
  onClose: () => void;
  onSave: (form: GiftFormData) => Promise<void>;
}

const emptyForm: GiftFormData = {
  name: '',
  image_url: '',
  price: '',
  purchase_url: '',
};

export function GiftFormModal({ gift, onClose, onSave }: GiftFormModalProps) {
  const [form, setForm] = useState<GiftFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(gift);

  useEffect(() => {
    if (gift) {
      setForm({
        name: gift.name,
        image_url: gift.image_url,
        price: String(gift.price),
        purchase_url: gift.purchase_url || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [gift]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar presente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar presente' : 'Novo presente'}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Nome do presente"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Jogo de Panelas"
          />
          <Input
            label="URL da imagem"
            required
            type="url"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            hint="Link de uma foto do presente"
          />
          <Input
            label="Valor (R$)"
            required
            type="number"
            min={0.01}
            step={0.01}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="99.90"
          />
          <Input
            label="Link para compra"
            type="url"
            value={form.purchase_url}
            onChange={(e) => setForm({ ...form, purchase_url: e.target.value })}
            placeholder="https://www.mercadolivre.com.br/..."
            hint="Opcional — Mercado Livre, Amazon, etc."
          />

          {form.image_url && (
            <div className="gift-form-preview">
              <img src={form.image_url} alt="Prévia" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
              {form.price && !isNaN(parseFloat(form.price)) && (
                <span>{formatCurrency(parseFloat(form.price.replace(',', '.')))}</span>
              )}
            </div>
          )}

          {error && <p className="form-error-global">{error}</p>}

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Salvar alterações' : 'Adicionar presente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

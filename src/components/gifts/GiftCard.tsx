import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PurchaseLink } from './PurchaseLink';
import { formatCurrency } from '../../lib/utils';
import type { Gift } from '../../types';

interface GiftCardProps {
  gift: Gift;
  selected: boolean;
  onToggle: (gift: Gift) => void;
}

export function GiftCard({ gift, selected, onToggle }: GiftCardProps) {
  return (
    <Card className={`gift-card ${selected ? 'gift-card-selected' : ''}`}>
      <div className="gift-card-image-wrap">
        <img src={gift.image_url} alt={gift.name} className="gift-card-image" loading="lazy" />
        <span className={`gift-card-badge ${selected ? 'gift-card-badge-selected' : ''}`}>
          {selected ? 'Selecionado' : 'Disponível'}
        </span>
      </div>
      <div className="gift-card-body">
        <h3 className="gift-card-name">{gift.name}</h3>
        <p className="gift-card-price">{formatCurrency(gift.price)}</p>
        {gift.purchase_url && (
          <PurchaseLink url={gift.purchase_url} label="Ver na loja" />
        )}
        <Button
          fullWidth
          variant={selected ? 'secondary' : 'primary'}
          onClick={() => onToggle(gift)}
        >
          {selected ? 'Remover' : 'Adicionar'}
        </Button>
      </div>
    </Card>
  );
}

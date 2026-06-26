import { formatCurrency } from '../../lib/utils';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatsCard({ label, value, icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <span className="stats-card-icon">{icon}</span>
      <div className="stats-card-content">
        <p className="stats-card-value">{value}</p>
        <p className="stats-card-label">{label}</p>
      </div>
    </div>
  );
}

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface GiftSummaryProps {
  name: string;
  price: number;
  imageUrl?: string;
  purchaseUrl?: string | null;
}

export function GiftSummary({ name, price, imageUrl, purchaseUrl }: GiftSummaryProps) {
  return (
    <div className="gift-summary">
      {imageUrl && <img src={imageUrl} alt={name} className="gift-summary-image" />}
      <div className="gift-summary-info">
        <p className="gift-summary-name">{name}</p>
        <p className="gift-summary-price">{formatCurrency(price)}</p>
        {purchaseUrl && (
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="purchase-link"
          >
            Ver para comprar ↗
          </a>
        )}
      </div>
    </div>
  );
}

interface PurchaseLinkProps {
  url: string;
  label?: string;
  variant?: 'button' | 'link';
  fullWidth?: boolean;
}

export function PurchaseLink({
  url,
  label = 'Ver para comprar',
  variant = 'link',
  fullWidth = false,
}: PurchaseLinkProps) {
  if (variant === 'button') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`purchase-link-btn ${fullWidth ? 'purchase-link-btn-full' : ''}`}
      >
        {label} ↗
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="purchase-link"
    >
      {label} ↗
    </a>
  );
}

import type { ReactNode } from 'react';
import { Card } from './Card';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`step-dot ${i + 1 <= current ? 'step-dot-active' : ''} ${i + 1 === current ? 'step-dot-current' : ''}`}
        />
      ))}
    </div>
  );
}

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick: () => void;
}

export function OptionCard({ title, description, icon, selected, onClick }: OptionCardProps) {
  return (
    <Card className="option-card" onClick={onClick} selected={selected}>
      {icon && <div className="option-card-icon">{icon}</div>}
      <div className="option-card-content">
        <h3 className="option-card-title">{title}</h3>
        {description && <p className="option-card-desc">{description}</p>}
      </div>
      <div className={`option-card-radio ${selected ? 'option-card-radio-selected' : ''}`} />
    </Card>
  );
}

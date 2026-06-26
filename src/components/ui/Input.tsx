import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
        {props.required && <span className="required">*</span>}
      </label>
      <input id={inputId} className={`form-input ${error ? 'form-input-error' : ''}`} {...props} />
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

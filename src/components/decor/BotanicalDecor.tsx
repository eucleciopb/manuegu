interface BotanicalProps {
  className?: string;
}

export function BotanicalDivider({ className = '' }: BotanicalProps) {
  return (
    <svg
      className={`botanical-divider ${className}`}
      viewBox="0 0 280 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 16h100"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      <path
        d="M180 16h100"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      <path
        d="M140 16c-8-10-18-14-28-10s-16 14-12 22 18 12 28 8 16-14 12-20z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M112 18c-6-8-2-16 6-14 5 1 8 8 4 14-3 5-8 4-10 0z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <path
        d="M168 18c6-8 2-16-6-14-5 1-8 8-4 14 3 5 8 4 10 0z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <circle cx="140" cy="16" r="2.5" fill="currentColor" fillOpacity="0.35" />
      <path
        d="M128 12c-4-6-10-4-8 2M152 12c4-6 10-4 8 2"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BotanicalCorner({ className = '' }: BotanicalProps) {
  return (
    <svg
      className={`botanical-corner ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 95C25 70 35 45 30 20M15 88C35 65 42 40 38 15"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M20 75c8-12 6-22-2-18-6 3-10 14-4 22 4 5 10 2 6-4z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.3"
      />
      <path
        d="M35 55c10-4 14-14 8-20-8-8-22 2-18 16 2 8 10 10 10 4z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.28"
      />
      <path
        d="M45 35c6-8 14-6 12 2-2 6-10 8-14 4-3-3-1-8 2-6z"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.4"
      />
      <circle cx="52" cy="28" r="3" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M55 22c3-5 8-4 7 1M48 32c-4 3-8 1-6-3"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BotanicalGarland({ className = '' }: BotanicalProps) {
  return (
    <svg
      className={`botanical-garland ${className}`}
      viewBox="0 0 400 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M0 24h120"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.25"
      />
      <path
        d="M280 24h120"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.25"
      />
      <path
        d="M200 26c-15-18-38-22-58-12s-28 32-16 48 42 18 58 8 28-28 16-44z"
        fill="currentColor"
        fillOpacity="0.07"
      />
      <path
        d="M155 28c-8-14-4-26 8-24 10 2 14 16 6 26-5 7-14 6-14-2z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <path
        d="M245 28c8-14 4-26-8-24-10 2-14 16-6 26 5 7 14 6 14-2z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <path
        d="M178 20c-6-10-16-8-14 2 2 8 12 10 16 4M222 20c6-10 16-8 14 2-2 8-12 10-16 4"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.38"
        strokeLinecap="round"
      />
      <ellipse cx="200" cy="24" rx="6" ry="8" fill="currentColor" fillOpacity="0.12" />
      <circle cx="200" cy="22" r="2.5" fill="currentColor" fillOpacity="0.3" />
      <path
        d="M190 30c-4 6-10 4-8-2M210 30c4 6 10 4 8-2"
        stroke="currentColor"
        strokeWidth="0.65"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

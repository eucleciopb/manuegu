export function BotanicalBackground() {
  return (
    <div className="botanical-bg" aria-hidden>
      <RoseBranch className="botanical-bg-branch botanical-bg-left" />
      <RoseBranch className="botanical-bg-branch botanical-bg-right" />
      <RoseBranch className="botanical-bg-branch botanical-bg-bottom" variant="bottom" />
    </div>
  );
}

function RoseBranch({
  className = '',
  variant = 'side',
}: {
  className?: string;
  variant?: 'side' | 'bottom';
}) {
  if (variant === 'bottom') {
    return (
      <svg
        className={className}
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        <path
          d="M200 200V120M200 120c-30-40-80-50-110-20M200 120c30-40 80-50 110-20"
          stroke="#8a9b86"
          strokeWidth="1.2"
          strokeOpacity="0.2"
          strokeLinecap="round"
        />
        <path
          d="M95 95c-8-12-4-22 6-20 8 2 12 14 6 22-4 6-10 4-12-2z"
          fill="#e8c4c0"
          fillOpacity="0.35"
          stroke="#d4a5a5"
          strokeWidth="0.6"
          strokeOpacity="0.25"
        />
        <path
          d="M305 95c8-12 4-22-6-20-8 2-12 14-6 22 4 6 10 4 12-2z"
          fill="#e8c4c0"
          fillOpacity="0.35"
          stroke="#d4a5a5"
          strokeWidth="0.6"
          strokeOpacity="0.25"
        />
        <circle cx="200" cy="88" r="10" fill="#f5e6e6" fillOpacity="0.5" stroke="#d4a5a5" strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="200" cy="88" r="4" fill="#e8c4c0" fillOpacity="0.6" />
        <path
          d="M130 110c-12-8-8-20 4-18M270 110c12-8 8-20-4-18"
          stroke="#8a9b86"
          strokeWidth="0.8"
          strokeOpacity="0.22"
          strokeLinecap="round"
        />
        <ellipse cx="155" cy="75" rx="8" ry="10" fill="#f0e0dc" fillOpacity="0.4" transform="rotate(-20 155 75)" />
        <ellipse cx="245" cy="75" rx="8" ry="10" fill="#f0e0dc" fillOpacity="0.4" transform="rotate(20 245 75)" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 160 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
    >
      {/* Caule principal */}
      <path
        d="M45 420 C50 340 35 260 55 180 C65 130 40 80 60 20"
        stroke="#8a9b86"
        strokeWidth="1.4"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />
      <path
        d="M55 180 C90 170 110 140 100 110 M55 260 C25 245 10 210 25 175 M55 100 C80 85 95 55 85 30"
        stroke="#8a9b86"
        strokeWidth="1"
        strokeOpacity="0.22"
        strokeLinecap="round"
      />

      {/* Folhas eucalipto / samambaia */}
      <path
        d="M100 110c14-8 22-22 14-32-10-12-28 0-24 18 2 8 8 12 10 14z"
        fill="#e4ebe1"
        fillOpacity="0.55"
        stroke="#8a9b86"
        strokeWidth="0.7"
        strokeOpacity="0.3"
      />
      <path
        d="M25 175c-12-10-10-26 2-28 10-2 18 12 12 24-4 8-12 8-14 4z"
        fill="#e4ebe1"
        fillOpacity="0.5"
        stroke="#8a9b86"
        strokeWidth="0.7"
        strokeOpacity="0.28"
      />
      <path
        d="M85 30c10-6 18-16 10-24-8-10-22 4-18 16 2 6 6 10 8 8z"
        fill="#dce8d8"
        fillOpacity="0.45"
        stroke="#8a9b86"
        strokeWidth="0.6"
        strokeOpacity="0.25"
      />

      {/* Rosas em aquarela */}
      <circle cx="108" cy="98" r="14" fill="#f5e0dc" fillOpacity="0.45" />
      <circle cx="108" cy="98" r="8" fill="#e8c4c0" fillOpacity="0.55" />
      <circle cx="108" cy="98" r="3.5" fill="#d4a5a5" fillOpacity="0.4" />
      <path
        d="M102 92c2-4 8-4 10 0M106 104c-4 2-6-2-4-6"
        stroke="#d4a5a5"
        strokeWidth="0.5"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />

      <circle cx="18" cy="168" r="12" fill="#f5e0dc" fillOpacity="0.4" />
      <circle cx="18" cy="168" r="7" fill="#e8c4c0" fillOpacity="0.5" />
      <circle cx="18" cy="168" r="3" fill="#d4a5a5" fillOpacity="0.35" />

      <circle cx="78" cy="22" r="11" fill="#f8ebe8" fillOpacity="0.5" />
      <circle cx="78" cy="22" r="6" fill="#e8c4c0" fillOpacity="0.45" />

      <circle cx="62" cy="250" r="10" fill="#f0deda" fillOpacity="0.38" />
      <circle cx="62" cy="250" r="5" fill="#e8c4c0" fillOpacity="0.45" />

      {/* Botões de rosa fechados */}
      <ellipse cx="95" cy="145" rx="5" ry="7" fill="#edd5d1" fillOpacity="0.5" transform="rotate(-15 95 145)" />
      <ellipse cx="35" cy="115" rx="4" ry="6" fill="#edd5d1" fillOpacity="0.45" transform="rotate(20 35 115)" />

      {/* Folha leque */}
      <path
        d="M70 320c20-5 35-25 28-45-8-22-35-10-30 12 2 14 12 28 2 33z"
        fill="#e4ebe1"
        fillOpacity="0.4"
        stroke="#8a9b86"
        strokeWidth="0.65"
        strokeOpacity="0.25"
      />
    </svg>
  );
}

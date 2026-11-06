import type { ReactNode } from 'react';

function Icon({ children, fill = 'none' }: { children: ReactNode; fill?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={fill}
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const BackIcon = () => (
  <Icon>
    <path d="M15 5 L8 12 L15 19" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M6 6 L18 18 M18 6 L6 18" />
  </Icon>
);

export const NextIcon = () => (
  <Icon>
    <path d="M9 5 L16 12 L9 19" />
  </Icon>
);

export const SpeakerIcon = () => (
  <Icon>
    <path d="M4 10 V14 H8 L13 18 V6 L8 10 Z" fill="currentColor" />
    <path d="M17 9 Q19 12 17 15" />
    <path d="M20 6 Q24 12 20 18" />
  </Icon>
);

export const PlayIcon = () => (
  <Icon fill="currentColor">
    <path d="M8 5 L19 12 L8 19 Z" />
  </Icon>
);

export const EarIcon = () => (
  <Icon>
    <path d="M7 10 A6 6 0 1 1 18 13 C16 15 15 16 15 18 A3 3 0 0 1 9 19" />
    <path d="M10 10 A3 3 0 0 1 15 11" />
  </Icon>
);

export const GearIcon = () => (
  <Icon>
    <circle cx={12} cy={12} r={3} />
    <path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M18.4 5.6 L17 7 M7 17 L5.6 18.4" />
  </Icon>
);

export const LockIcon = () => (
  <Icon>
    <rect x={5} y={11} width={14} height={9} rx={2} fill="currentColor" />
    <path d="M8 11 V8 A4 4 0 0 1 16 8 V11" />
  </Icon>
);

export const MapIcon = () => (
  <Icon>
    <path d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z" />
    <circle cx={12} cy={9.5} r={1.5} fill="currentColor" />
  </Icon>
);

export const GridIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
    <rect x={3} y={3} width={8} height={8} rx={2.5} />
    <rect x={13} y={3} width={8} height={8} rx={2.5} />
    <rect x={3} y={13} width={8} height={8} rx={2.5} />
    <rect x={13} y={13} width={8} height={8} rx={2.5} />
  </svg>
);

export function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        d="M12 2.5 L14.9 8.6 L21.5 9.5 L16.7 14.1 L17.9 20.7 L12 17.5 L6.1 20.7 L7.3 14.1 L2.5 9.5 L9.1 8.6 Z"
        fill={filled ? '#ffc531' : '#d9d5ec'}
        stroke={filled ? '#e09a00' : '#bdb8d6'}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

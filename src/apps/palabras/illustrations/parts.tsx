import type { ReactNode } from 'react';

export const INK = '#2b2a4c';
export const WHITE = '#ffffff';
export const CORAL = '#ff7a59';
export const RED = '#ee3e52';
export const SUN = '#ffc531';
export const GOLD = '#ffb627';
export const GOLD_DARK = '#e08e00';
export const SKY = '#22b8f0';
export const SKY_LIGHT = '#bdeeff';
export const GRAPE = '#9a6bff';
export const PINK = '#ff8fc4';
export const BLUSH = '#ff9eb0';
export const LIME = '#6fd64b';
export const GREEN = '#3fb45a';
export const SKIN = '#f8c9a0';
export const HAIR = '#6a3f2a';

/** Lienzo común: todas las ilustraciones comparten tamaño, contorno y esquinas redondas. */
export function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  );
}

/** Una extremidad con contorno: trazo oscuro grueso y el color encima. */
export function Limb({ d, color, width = 15 }: { d: string; color: string; width?: number }) {
  return (
    <>
      <path d={d} stroke={INK} strokeWidth={width + 9} />
      <path d={d} stroke={color} strokeWidth={width} />
    </>
  );
}

export function Eye({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={INK} stroke="none" />
      <circle cx={x + r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill={WHITE} stroke="none" />
    </>
  );
}

export function Cheek({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={BLUSH} stroke="none" opacity={0.75} />;
}

/** Carita de frente: da personalidad a los objetos. */
export function Face({ x, y, gap = 30, r = 6 }: { x: number; y: number; gap?: number; r?: number }) {
  const half = gap / 2;
  const mouth = gap * 0.28;
  return (
    <g>
      <Eye x={x - half} y={y} r={r} />
      <Eye x={x + half} y={y} r={r} />
      <path
        d={`M${x - mouth} ${y + r + 1} Q${x} ${y + r + mouth + 2} ${x + mouth} ${y + r + 1}`}
        strokeWidth={4}
      />
      <Cheek x={x - half - r - 2} y={y + r + 3} r={r * 0.85} />
      <Cheek x={x + half + r + 2} y={y + r + 3} r={r * 0.85} />
    </g>
  );
}

export function Cloud({ x, y, scale = 1, fill = WHITE }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M-22 10 C-32 10 -34 -4 -23 -6 C-22 -18 -6 -20 -1 -11 C6 -18 20 -14 19 -4 C30 -4 30 10 20 10 Z"
      fill={fill}
    />
  );
}

export function Star({ x, y, r = 10, fill = SUN }: { x: number; y: number; r?: number; fill?: string }) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? r : r * 0.48;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    return `${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={points} fill={fill} strokeWidth={4} />;
}

export function Flower({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const petals = Array.from({ length: 5 }, (_, index) => {
    const angle = ((Math.PI * 2) / 5) * index - Math.PI / 2;
    return (
      <circle
        key={index}
        cx={x + r * Math.cos(angle)}
        cy={y + r * Math.sin(angle)}
        r={r * 0.72}
        fill={color}
        strokeWidth={4}
      />
    );
  });
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={r * 0.55} fill={SUN} strokeWidth={4} />
    </g>
  );
}

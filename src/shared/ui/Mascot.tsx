import type { ReactNode } from 'react';

export type Mood = 'happy' | 'cheer' | 'oops' | 'wave';

const INK = '#2b2a4c';
const GREEN = '#6fd64b';
const GREEN_DARK = '#47a82a';
const BELLY = '#fff6d6';
const ORANGE = '#ff8a3d';
const RED = '#ff3b3b';
const BLUE = '#3aa0ff';
const BLUSH = '#ff9eb0';

function Toes({ x, y }: { x: number; y: number }) {
  return (
    <g fill={ORANGE} strokeWidth={4}>
      <circle cx={x - 11} cy={y} r={7} />
      <circle cx={x + 11} cy={y} r={7} />
      <circle cx={x} cy={y + 3} r={8} />
    </g>
  );
}

function Arm({ d, handX, handY }: { d: string; handX: number; handY: number }) {
  return (
    <>
      <path d={d} stroke={INK} strokeWidth={24} />
      <path d={d} stroke={GREEN} strokeWidth={15} />
      <Toes x={handX} y={handY} />
    </>
  );
}

function FrogEye({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={19} fill={RED} strokeWidth={4} />
      <circle cx={x} cy={y} r={12} fill={INK} stroke="none" />
      <circle cx={x + 4} cy={y - 5} r={4.5} fill="#fff" stroke="none" />
    </g>
  );
}

/** La cabeza sola: también es el ícono de la app. */
export function FrogHead({ mouth }: { mouth?: ReactNode }) {
  return (
    <g>
      {/* Primero el contorno grueso y encima el relleno: la cabeza y los ojos se ven de una pieza. */}
      <circle cx={58} cy={52} r={27} strokeWidth={10} />
      <circle cx={142} cy={52} r={27} strokeWidth={10} />
      <ellipse cx={100} cy={90} rx={68} ry={46} strokeWidth={10} />
      <circle cx={58} cy={52} r={27} fill={GREEN} stroke="none" />
      <circle cx={142} cy={52} r={27} fill={GREEN} stroke="none" />
      <ellipse cx={100} cy={90} rx={68} ry={46} fill={GREEN} stroke="none" />
      <FrogEye x={58} y={52} />
      <FrogEye x={142} y={52} />
      <circle cx={92} cy={80} r={2.5} fill={GREEN_DARK} stroke="none" />
      <circle cx={108} cy={80} r={2.5} fill={GREEN_DARK} stroke="none" />
      <circle cx={46} cy={96} r={10} fill={BLUSH} stroke="none" />
      <circle cx={154} cy={96} r={10} fill={BLUSH} stroke="none" />
      {mouth ?? <path d="M64 94 Q100 124 136 94" strokeWidth={5} />}
    </g>
  );
}

const OPEN_MOUTH = (
  <g>
    <path d="M62 92 Q100 138 138 92 Q100 104 62 92 Z" fill="#c2344f" />
    <path d="M84 112 Q100 104 116 112 Q112 122 100 122 Q88 122 84 112 Z" fill={BLUSH} stroke="none" />
  </g>
);

const SMALL_MOUTH = <ellipse cx={100} cy={106} rx={11} ry={9} fill="#c2344f" />;

export function Mascot({ mood = 'happy' }: { mood?: Mood }) {
  const mouth = mood === 'cheer' || mood === 'wave' ? OPEN_MOUTH : mood === 'oops' ? SMALL_MOUTH : undefined;
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      fill="none"
      role="img"
      aria-label="Brinco, la ranita"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        {/* patas traseras */}
        <ellipse cx={46} cy={156} rx={27} ry={29} fill={GREEN} />
        <ellipse cx={154} cy={156} rx={27} ry={29} fill={GREEN} />
        <Toes x={32} y={184} />
        <Toes x={168} y={184} />
        {/* cuerpo */}
        <ellipse cx={100} cy={146} rx={54} ry={44} fill={BLUE} />
        <ellipse cx={100} cy={144} rx={46} ry={42} fill={GREEN} stroke="none" />
        <ellipse cx={100} cy={154} rx={34} ry={30} fill={BELLY} stroke="none" />
        {mood === 'cheer' && (
          <>
            <Arm d="M62 130 L30 92" handX={26} handY={84} />
            <Arm d="M138 130 L170 92" handX={174} handY={84} />
          </>
        )}
        <FrogHead mouth={mouth} />
        {mood === 'wave' && <Arm d="M144 130 L176 94" handX={180} handY={86} />}
        {mood !== 'cheer' && <Arm d="M70 136 L66 170" handX={66} handY={176} />}
        {mood !== 'cheer' && mood !== 'wave' && <Arm d="M130 136 L134 170" handX={134} handY={176} />}
        {mood === 'wave' && <Arm d="M130 140 L132 172" handX={132} handY={178} />}
      </g>
    </svg>
  );
}

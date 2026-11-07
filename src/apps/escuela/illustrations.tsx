import { useEffect, type ComponentType } from 'react';
import { motion, useAnimationControls, type TargetAndTransition } from 'motion/react';
import {
  Art,
  Cloud,
  CORAL,
  Eye,
  Face,
  Flower,
  GOLD,
  GRAPE,
  GREEN,
  HAIR,
  INK,
  LIME,
  Limb,
  PINK,
  RED,
  SKIN,
  SKY,
  SKY_LIGHT,
  Star,
  SUN,
  WHITE,
} from '../palabras/illustrations/parts';

const CREAM = '#fff3d6';
const BOARD = '#2f7d5b';

export function Garden() {
  return (
    <Art>
      <circle cx={160} cy={36} r={18} fill={SUN} />
      <Cloud x={56} y={36} scale={1.1} />
      {/* suelo */}
      <path d="M8 150 Q100 134 192 150 V186 Q192 194 184 194 H16 Q8 194 8 186 Z" fill={LIME} />
      {/* cerca */}
      <rect x={14} y={104} width={172} height={10} rx={3} fill={WHITE} />
      <rect x={14} y={128} width={172} height={10} rx={3} fill={WHITE} />
      {[24, 56, 88, 120, 152].map((x) => (
        <path key={x} d={`M${x} 150 V96 L${x + 12} 84 L${x + 24} 96 V150 Z`} fill={WHITE} />
      ))}
      {/* flores */}
      <Limb d="M50 184 V146" color={GREEN} width={6} />
      <Limb d="M100 184 V138" color={GREEN} width={6} />
      <Limb d="M150 184 V148" color={GREEN} width={6} />
      <Flower x={50} y={140} r={11} color={PINK} />
      <Flower x={100} y={130} r={14} color={CORAL} />
      <Flower x={150} y={142} r={11} color={GRAPE} />
    </Art>
  );
}

export function Restroom() {
  return (
    <Art>
      <circle cx={28} cy={62} r={8} fill={SKY_LIGHT} />
      <circle cx={20} cy={36} r={5} fill={SKY_LIGHT} />
      <circle cx={174} cy={52} r={7} fill={SKY_LIGHT} />
      <path d="M10 178 H190" />
      {/* tanque */}
      <rect x={58} y={20} width={84} height={60} rx={10} fill={WHITE} />
      <rect x={116} y={32} width={18} height={9} rx={4} fill={SKY_LIGHT} />
      {/* taza */}
      <path d="M40 100 Q44 150 76 158 L70 178 H130 L124 158 Q156 150 160 100 Z" fill={WHITE} />
      <ellipse cx={100} cy={96} rx={62} ry={18} fill={WHITE} />
      <ellipse cx={100} cy={96} rx={44} ry={10} fill={SKY_LIGHT} />
      <Face x={100} y={128} gap={34} r={6} />
    </Art>
  );
}

export function PrincipalOffice() {
  return (
    <Art>
      {/* la directora, detrás del escritorio */}
      <path d="M50 150 Q50 104 100 104 Q150 104 150 150 Z" fill={GRAPE} />
      <path d="M86 106 L100 124 L114 106 Z" fill={WHITE} />
      <path d="M100 120 L93 130 L100 150 L107 130 Z" fill={CORAL} />
      <circle cx={100} cy={70} r={30} fill={SKIN} />
      <path d="M68 70 Q66 36 100 36 Q134 36 132 70 Q120 52 100 54 Q80 52 68 70 Z" fill={HAIR} />
      <circle cx={88} cy={73} r={10} fill={WHITE} strokeWidth={4} />
      <circle cx={112} cy={73} r={10} fill={WHITE} strokeWidth={4} />
      <path d="M98 73 H102" strokeWidth={4} />
      <Eye x={88} y={74} r={4} />
      <Eye x={112} y={74} r={4} />
      <path d="M91 88 Q100 95 109 88" strokeWidth={4} />
      {/* escritorio, taza y placa */}
      <rect x={146} y={114} width={22} height={28} rx={4} fill={CORAL} />
      <path d="M168 120 Q178 120 178 128 Q178 136 168 136" strokeWidth={4} />
      <rect x={14} y={140} width={172} height={52} rx={8} fill={GOLD} />
      <rect x={64} y={150} width={72} height={24} rx={6} fill={WHITE} />
      <Star x={100} y={162} r={8} />
    </Art>
  );
}

const BOOKS: { x: number; w: number; h: number; color: string }[] = [
  { x: 38, w: 18, h: 48, color: CORAL },
  { x: 56, w: 16, h: 40, color: SKY },
  { x: 72, w: 20, h: 52, color: LIME },
  { x: 92, w: 16, h: 44, color: GRAPE },
  { x: 108, w: 18, h: 50, color: SUN },
  { x: 126, w: 16, h: 38, color: PINK },
  { x: 142, w: 20, h: 46, color: SKY },
];

export function Library() {
  return (
    <Art>
      {/* estante */}
      <rect x={22} y={10} width={156} height={150} rx={10} fill={GOLD} />
      <rect x={34} y={22} width={132} height={58} fill={CREAM} />
      <rect x={34} y={92} width={132} height={56} fill={CREAM} />
      {BOOKS.map((book) => (
        <rect key={`a${book.x}`} x={book.x} y={80 - book.h} width={book.w} height={book.h} rx={3} fill={book.color} />
      ))}
      {BOOKS.map((book, index) => {
        const next = BOOKS[(index + 3) % BOOKS.length];
        return (
          <rect key={`b${book.x}`} x={book.x} y={148 - next.h} width={book.w} height={next.h} rx={3} fill={next.color} />
        );
      })}
      {/* libro abierto */}
      <path d="M100 162 Q70 148 34 158 V194 Q70 184 100 196 Z" fill={WHITE} />
      <path d="M100 162 Q130 148 166 158 V194 Q130 184 100 196 Z" fill={WHITE} />
      <path d="M48 170 Q68 165 88 171 M48 181 Q68 176 88 182" stroke={SKY} strokeWidth={4} />
      <path d="M112 171 Q132 165 152 170 M112 182 Q132 176 152 181" stroke={SKY} strokeWidth={4} />
    </Art>
  );
}

export function Classroom() {
  return (
    <Art>
      {/* pizarra */}
      <rect x={14} y={16} width={172} height={112} rx={10} fill={GOLD} />
      <rect x={26} y={28} width={148} height={88} rx={4} fill={BOARD} />
      <g stroke="none" fill={WHITE} fontFamily="'Fredoka Variable', sans-serif" fontWeight={700}>
        <text x={44} y={68} fontSize={34}>
          ABC
        </text>
        <text x={44} y={104} fontSize={28}>
          1+2
        </text>
      </g>
      <Star x={150} y={50} r={10} />
      {/* pupitre con manzana */}
      <circle cx={130} cy={140} r={11} fill={RED} />
      <path d="M130 129 Q132 122 138 120" strokeWidth={4} />
      <path d="M48 166 V194 M152 166 V194" stroke={INK} strokeWidth={8} />
      <rect x={36} y={150} width={128} height={18} rx={6} fill={CORAL} />
    </Art>
  );
}

const ILLUSTRATIONS: Record<string, ComponentType> = {
  garden: Garden,
  restroom: Restroom,
  'principal-office': PrincipalOffice,
  library: Library,
  classroom: Classroom,
};

const SWAY: TargetAndTransition = {
  rotate: [0, -8, 7, -5, 3, 0],
  transition: { duration: 0.9 },
};
const WOBBLE: TargetAndTransition = {
  scaleX: [1, 1.12, 0.92, 1.05, 1],
  scaleY: [1, 0.9, 1.08, 0.97, 1],
  transition: { duration: 0.7 },
};
const POP: TargetAndTransition = {
  scale: [1, 1.16, 0.94, 1.05, 1],
  transition: { duration: 0.6 },
};
const NOD: TargetAndTransition = {
  y: [0, -10, 0, -6, 0],
  rotate: [0, -3, 3, -2, 0],
  transition: { duration: 0.8 },
};

const ANIMATIONS: Record<string, TargetAndTransition> = {
  garden: SWAY,
  restroom: WOBBLE,
  'principal-office': NOD,
  library: POP,
  classroom: POP,
};

/** Dibuja el lugar y reproduce su animación cada vez que cambia `play`. */
export function PlaceArt({ id, play = 0 }: { id: string; play?: number }) {
  const controls = useAnimationControls();
  const Illustration = ILLUSTRATIONS[id];

  useEffect(() => {
    if (play > 0) void controls.start(ANIMATIONS[id]);
  }, [play, id, controls]);

  return (
    <motion.div animate={controls} style={{ width: '100%', height: '100%', transformOrigin: '50% 90%' }}>
      <Illustration />
    </motion.div>
  );
}

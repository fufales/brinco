import { useEffect, type ComponentType } from 'react';
import { motion, useAnimationControls, type TargetAndTransition } from 'motion/react';
import {
  Art,
  CORAL,
  Eye,
  Face,
  GOLD,
  GRAPE,
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

const NAVY = '#33449a';
const VEST = '#c8f04a';
const BOARD = '#2f7d5b';
const SILVER = '#c9cede';

/** Torso redondeado que llega al borde de abajo. */
function Torso({ cx, top, half, fill }: { cx: number; top: number; half: number; fill: string }) {
  return <path d={`M${cx - half} 196 Q${cx - half} ${top} ${cx} ${top} Q${cx + half} ${top} ${cx + half} 196 Z`} fill={fill} />;
}

export function Principal() {
  return (
    <Art>
      {/* pelo largo, por detrás */}
      <path d="M64 112 Q56 42 100 40 Q144 42 136 112 Z" fill={HAIR} />
      <Torso cx={100} top={124} half={54} fill={GRAPE} />
      <path d="M84 126 L100 146 L116 126 Z" fill={WHITE} />
      <path d="M100 140 L92 152 L100 176 L108 152 Z" fill={CORAL} />
      <Star x={128} y={152} r={8} />
      <circle cx={100} cy={82} r={30} fill={SKIN} />
      <path d="M70 76 Q72 50 100 50 Q128 50 130 76 Q114 62 100 64 Q86 62 70 76 Z" fill={HAIR} />
      {/* lentes */}
      <circle cx={88} cy={86} r={10} fill={WHITE} strokeWidth={4} />
      <circle cx={112} cy={86} r={10} fill={WHITE} strokeWidth={4} />
      <path d="M98 86 H102" strokeWidth={4} />
      <Eye x={88} y={87} r={4} />
      <Eye x={112} y={87} r={4} />
      <path d="M91 101 Q100 108 109 101" strokeWidth={4} />
    </Art>
  );
}

export function Cook() {
  return (
    <Art>
      {/* cuchara de palo */}
      <Limb d="M166 188 L172 104" color={GOLD} width={7} />
      <ellipse cx={173} cy={94} rx={11} ry={15} fill={GOLD} />
      <Torso cx={96} top={138} half={52} fill={WHITE} />
      <path d="M80 138 L96 158 L112 138 Z" fill={RED} />
      {[164, 182].map((y) => (
        <g key={y}>
          <circle cx={84} cy={y} r={3.5} fill={INK} stroke="none" />
          <circle cx={108} cy={y} r={3.5} fill={INK} stroke="none" />
        </g>
      ))}
      <circle cx={160} cy={172} r={10} fill={SKIN} />
      <circle cx={96} cy={102} r={28} fill={SKIN} />
      <Face x={96} y={100} gap={20} r={4} />
      {/* bigote */}
      <path d="M82 114 Q89 108 96 113 Q103 108 110 114 Q103 119 96 115 Q89 119 82 114 Z" fill={HAIR} strokeWidth={3} />
      {/* gorro de chef */}
      <rect x={70} y={64} width={52} height={16} rx={4} fill={WHITE} />
      <path d="M72 66 C56 66 54 38 72 38 C74 18 100 14 106 30 C116 16 142 22 136 42 C150 46 146 68 120 66 Z" fill={WHITE} />
    </Art>
  );
}

export function Janitor() {
  return (
    <Art>
      {/* cubeta */}
      <path d="M12 156 H58 L52 196 H18 Z" fill={SKY_LIGHT} />
      <ellipse cx={35} cy={156} rx={23} ry={6} fill={SKY} />
      {/* escoba */}
      <Limb d="M166 30 L156 166" color={GOLD} width={8} />
      <path d="M136 164 H174 L186 196 H126 Z" fill={SUN} />
      <path d="M142 172 L136 194 M156 172 V194 M170 172 L176 194" strokeWidth={3} />
      <Torso cx={96} top={136} half={48} fill={SUN} />
      {/* overol */}
      <path d="M70 196 V160 H122 V196 Z" fill={SKY} />
      <path d="M74 160 L80 138 M118 160 L112 138" stroke={SKY} strokeWidth={8} />
      <circle cx={80} cy={162} r={3.5} fill={INK} stroke="none" />
      <circle cx={112} cy={162} r={3.5} fill={INK} stroke="none" />
      <circle cx={150} cy={150} r={10} fill={SKIN} />
      <circle cx={96} cy={100} r={28} fill={SKIN} />
      <Face x={96} y={102} gap={20} r={4} />
      {/* gorra */}
      <path d="M68 94 Q68 66 96 66 Q124 66 124 94 Z" fill={SKY} />
      <path d="M118 92 H146" strokeWidth={6} />
    </Art>
  );
}

function Kid({ cx, shirt, pack, girl }: { cx: number; shirt: string; pack: string; girl?: boolean }) {
  return (
    <g>
      <rect x={cx - 34} y={136} width={68} height={52} rx={12} fill={pack} />
      <Torso cx={cx} top={138} half={28} fill={shirt} />
      <path d={`M${cx - 14} 142 V184 M${cx + 14} 142 V184`} stroke={pack} strokeWidth={7} />
      {girl && (
        <>
          <circle cx={cx - 26} cy={100} r={10} fill={HAIR} />
          <circle cx={cx + 26} cy={100} r={10} fill={HAIR} />
        </>
      )}
      <circle cx={cx} cy={110} r={24} fill={SKIN} />
      <path
        d={`M${cx - 24} 106 Q${cx - 24} 84 ${cx} 84 Q${cx + 24} 84 ${cx + 24} 106 Q${cx + 8} 94 ${cx} 98 Q${cx - 10} 94 ${cx - 24} 106 Z`}
        fill={HAIR}
      />
      <Face x={cx} y={112} gap={16} r={3.5} />
    </g>
  );
}

export function Students() {
  return (
    <Art>
      <Kid cx={62} shirt={CORAL} pack={SUN} girl />
      <Kid cx={138} shirt={LIME} pack={GRAPE} />
    </Art>
  );
}

export function Teacher() {
  return (
    <Art>
      {/* pizarrita */}
      <rect x={10} y={30} width={88} height={64} rx={6} fill={GOLD} />
      <rect x={18} y={38} width={72} height={48} rx={3} fill={BOARD} />
      <text x={26} y={73} fontSize={28} fontWeight={700} fontFamily="'Fredoka Variable', sans-serif" fill={WHITE} stroke="none">
        ABC
      </text>
      {/* pelo con chongo */}
      <circle cx={134} cy={52} r={14} fill={HAIR} />
      <path d="M104 116 Q98 62 134 62 Q170 62 164 116 Z" fill={HAIR} />
      <Torso cx={134} top={138} half={44} fill={PINK} />
      {/* puntero */}
      <Limb d="M106 160 L72 96" color={RED} width={5} />
      <circle cx={108} cy={162} r={9} fill={SKIN} />
      <circle cx={134} cy={98} r={26} fill={SKIN} />
      <path d="M108 94 Q110 72 134 72 Q158 72 160 94 Q146 82 134 84 Q122 82 108 94 Z" fill={HAIR} />
      <Face x={134} y={100} gap={18} r={4} />
    </Art>
  );
}

export function SecurityGuard() {
  return (
    <Art>
      <Torso cx={100} top={134} half={54} fill={NAVY} />
      {/* chaleco */}
      <path d="M58 196 Q58 152 84 138 L94 196 Z" fill={VEST} />
      <path d="M142 196 Q142 152 116 138 L106 196 Z" fill={VEST} />
      <path d="M62 178 H92 M108 178 H138" stroke={WHITE} strokeWidth={5} />
      {/* silbato */}
      <path d="M100 136 Q94 150 88 160" strokeWidth={3} />
      <rect x={74} y={158} width={22} height={12} rx={5} fill={SILVER} />
      <Star x={124} y={162} r={9} />
      <circle cx={100} cy={96} r={28} fill={SKIN} />
      <Face x={100} y={100} gap={20} r={4} />
      {/* gorra con placa */}
      <path d="M68 86 Q68 56 100 56 Q132 56 132 86 Z" fill={NAVY} />
      <rect x={62} y={80} width={76} height={11} rx={5} fill={NAVY} />
      <Star x={100} y={70} r={8} />
    </Art>
  );
}

export function Secretary() {
  return (
    <Art>
      <Torso cx={92} top={136} half={50} fill={SKY} />
      <path d="M78 138 L92 154 L106 138 Z" fill={WHITE} />
      <path d="M92 150 L86 160 L92 180 L98 160 Z" fill={GOLD} />
      {/* carpeta */}
      <g transform="rotate(-10 150 168)">
        <rect x={118} y={140} width={62} height={46} rx={5} fill={SUN} />
        <path d="M128 156 H168 M128 168 H160" strokeWidth={4} />
      </g>
      <circle cx={122} cy={178} r={10} fill={SKIN} />
      <circle cx={92} cy={98} r={28} fill={SKIN} />
      <path d="M64 92 Q64 66 92 66 Q120 66 120 92 Q108 78 92 80 Q78 78 64 92 Z" fill={HAIR} />
      <Face x={92} y={100} gap={20} r={4} />
      {/* audífono con micrófono */}
      <path d="M60 98 Q58 56 92 56 Q126 56 124 98" strokeWidth={6} />
      <rect x={52} y={88} width={14} height={22} rx={6} fill={GRAPE} />
      <rect x={118} y={88} width={14} height={22} rx={6} fill={GRAPE} />
      <path d="M60 110 Q64 124 80 122" strokeWidth={4} />
      <circle cx={82} cy={122} r={4} fill={INK} stroke="none" />
    </Art>
  );
}

const ILLUSTRATIONS: Record<string, ComponentType> = {
  principal: Principal,
  cook: Cook,
  janitor: Janitor,
  students: Students,
  teacher: Teacher,
  'security-guard': SecurityGuard,
  secretary: Secretary,
};

const NOD: TargetAndTransition = {
  y: [0, -10, 0, -6, 0],
  rotate: [0, -3, 3, -2, 0],
  transition: { duration: 0.8 },
};
const HOP: TargetAndTransition = {
  y: [0, -24, 0, -12, 0],
  scaleY: [1, 1.06, 0.94, 1.03, 1],
  transition: { duration: 0.8 },
};
const SWEEP: TargetAndTransition = {
  rotate: [0, -6, 6, -6, 6, 0],
  transition: { duration: 0.9 },
};

const ANIMATIONS: Record<string, TargetAndTransition> = {
  principal: NOD,
  cook: SWEEP,
  janitor: SWEEP,
  students: HOP,
  teacher: NOD,
  'security-guard': HOP,
  secretary: NOD,
};

/** Dibuja a la persona y reproduce su animación cada vez que cambia `play`. */
export function PersonArt({ id, play = 0 }: { id: string; play?: number }) {
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

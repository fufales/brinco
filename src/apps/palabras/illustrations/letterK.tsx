import type { ReactNode } from 'react';
import {
  Art,
  BLUSH,
  Cheek,
  Cloud,
  CORAL,
  Eye,
  Face,
  GOLD,
  GOLD_DARK,
  GRAPE,
  HAIR,
  INK,
  LIME,
  Limb,
  PINK,
  RED,
  SKIN,
  SKY,
  SUN,
  WHITE,
} from './parts';

const TAN = '#e0985c';
const CREAM = '#fbe3bd';
const POUCH = '#f2c98f';

export function Kangaroo() {
  return (
    <Art>
      {/* cola */}
      <path d="M74 150 C50 156 26 166 8 188 C34 190 70 184 96 170 Z" fill={TAN} />
      {/* orejas */}
      <path d="M102 50 C90 32 88 10 100 5 C114 3 120 28 116 48 Z" fill={TAN} />
      <path d="M118 46 C116 26 124 4 137 7 C148 12 140 36 130 50 Z" fill={TAN} />
      <path d="M104 40 C98 28 97 16 102 13 C108 13 111 28 110 40 Z" fill={BLUSH} stroke="none" />
      <path d="M124 40 C124 28 128 16 134 15 C138 18 132 32 127 42 Z" fill={BLUSH} stroke="none" />
      {/* cuerpo */}
      <path
        d="M100 72 C72 84 58 116 62 150 C64 172 84 182 110 180 C136 178 148 156 144 126 C142 102 132 84 118 74 Z"
        fill={TAN}
      />
      <path
        d="M114 92 C98 100 90 122 92 146 C94 166 110 174 124 170 C138 164 142 142 138 122 C135 106 126 94 114 92 Z"
        fill={CREAM}
        stroke="none"
      />
      {/* canguro bebé asomado en la bolsa */}
      <path d="M104 118 C100 108 102 100 107 100 C111 102 112 110 111 118 Z" fill={TAN} strokeWidth={4} />
      <path d="M122 116 C122 106 126 98 131 100 C135 103 131 112 128 119 Z" fill={TAN} strokeWidth={4} />
      <circle cx={117} cy={129} r={16} fill={TAN} strokeWidth={4} />
      <Eye x={111} y={127} r={3.5} />
      <Eye x={124} y={127} r={3.5} />
      <circle cx={117.5} cy={134} r={2.5} fill={INK} stroke="none" />
      <path d="M90 138 Q116 154 142 134 C144 156 136 174 116 176 C98 176 90 158 90 138 Z" fill={POUCH} />
      {/* cabeza */}
      <path
        d="M94 64 C94 44 112 36 128 40 C142 43 150 52 160 58 C172 65 172 80 158 84 C142 88 120 92 106 86 C98 82 94 74 94 64 Z"
        fill={TAN}
      />
      <ellipse cx={166} cy={66} rx={7} ry={6} fill={INK} stroke="none" />
      <Eye x={128} y={58} r={7} />
      <path d="M154 78 Q145 83 136 78" strokeWidth={4} />
      <Cheek x={116} y={72} r={6.5} />
      {/* brazo */}
      <Limb d="M126 104 C136 112 146 114 156 110" color={TAN} width={11} />
      {/* pata */}
      <path
        d="M72 160 C68 178 84 192 106 192 L150 192 C164 192 164 176 150 174 L116 170 C108 156 82 148 72 160 Z"
        fill={TAN}
      />
    </Art>
  );
}

export function Kite() {
  return (
    <Art>
      <Cloud x={160} y={158} scale={1.15} />
      <Cloud x={30} y={150} scale={0.8} />
      {/* cola con moños */}
      <path d="M86 156 C66 170 108 174 92 194" strokeWidth={4} />
      <path d="M84 170 L68 162 L70 178 Z M84 170 L100 162 L98 178 Z" fill={PINK} strokeWidth={4} />
      <path d="M93 188 L77 182 L78 198 Z M93 188 L109 182 L108 198 Z" fill={LIME} strokeWidth={4} />
      <g transform="rotate(12 100 84)">
        <path d="M100 6 L100 84 L36 84 Z" fill={CORAL} />
        <path d="M100 6 L164 84 L100 84 Z" fill={SUN} />
        <path d="M36 84 L100 84 L100 158 Z" fill={SKY} />
        <path d="M164 84 L100 84 L100 158 Z" fill={GRAPE} />
        <circle cx={100} cy={82} r={27} fill={WHITE} />
        <Face x={100} y={78} gap={22} r={4.5} />
      </g>
    </Art>
  );
}

function Key({
  angle,
  color,
  dark,
  children,
}: {
  angle: number;
  color: string;
  dark: string;
  children?: ReactNode;
}) {
  return (
    <g transform={`rotate(${angle} 100 34)`}>
      <rect x={91} y={90} width={18} height={100} rx={5} fill={color} />
      <path d="M109 150 H128 V163 H109 Z M109 172 H123 V186 H109 Z" fill={color} />
      <path d="M100 112 V176" stroke={dark} strokeWidth={4} />
      <circle cx={100} cy={82} r={33} fill={color} />
      <circle cx={100} cy={62} r={9} fill={WHITE} />
      {children}
    </g>
  );
}

export function Keys() {
  return (
    <Art>
      <Key angle={30} color={SKY} dark="#0f8fc4">
        <circle cx={100} cy={92} r={8} fill={WHITE} strokeWidth={4} />
      </Key>
      <Key angle={-24} color={GOLD} dark={GOLD_DARK}>
        <path
          d="M100 104 C86 94 86 82 94 82 C98 82 100 86 100 88 C100 86 102 82 106 82 C114 82 114 94 100 104 Z"
          fill={RED}
          strokeWidth={4}
        />
      </Key>
      {/* argolla */}
      <circle cx={100} cy={36} r={24} stroke={INK} strokeWidth={12} />
      <circle cx={100} cy={36} r={24} stroke="#d5d9ea" strokeWidth={5} />
    </Art>
  );
}

export function King() {
  return (
    <Art>
      {/* manto */}
      <path d="M58 128 C38 146 30 172 30 194 L170 194 C170 172 162 146 142 128 Z" fill={RED} />
      <path d="M86 138 H114 L120 194 H80 Z" fill={WHITE} />
      <path d="M100 150 V154 M100 168 V172 M100 184 V188" strokeWidth={5} />
      {/* cuello de armiño */}
      <path d="M50 134 Q100 164 150 134 Q152 118 136 114 H64 Q48 118 50 134 Z" fill={WHITE} />
      <path d="M68 132 V136 M86 140 V144 M114 140 V144 M132 132 V136" strokeWidth={5} />
      {/* cabeza */}
      <circle cx={58} cy={88} r={10} fill={SKIN} />
      <circle cx={142} cy={88} r={10} fill={SKIN} />
      <circle cx={100} cy={84} r={43} fill={SKIN} />
      {/* barba y bigote */}
      <path d="M58 90 C54 128 82 148 100 148 C118 148 146 128 142 90 C134 106 118 104 100 104 C82 104 66 106 58 90 Z" fill={HAIR} />
      <path d="M100 106 C92 98 78 100 74 110 C84 116 96 114 100 110 C104 114 116 116 126 110 C122 100 108 98 100 106 Z" fill={HAIR} strokeWidth={4} />
      <path d="M90 122 Q100 130 110 122" stroke={WHITE} strokeWidth={4} />
      <Eye x={83} y={80} r={6.5} />
      <Eye x={117} y={80} r={6.5} />
      <Cheek x={72} y={93} r={6} />
      <Cheek x={128} y={93} r={6} />
      {/* corona */}
      <path d="M56 58 L46 14 L78 36 L100 4 L122 36 L154 14 L144 58 Z" fill={GOLD} />
      <path d="M56 50 H144 L144 66 Q100 76 56 66 Z" fill={GOLD_DARK} />
      <circle cx={46} cy={14} r={7} fill={RED} />
      <circle cx={100} cy={6} r={8} fill={SKY} />
      <circle cx={154} cy={14} r={7} fill={RED} />
      <circle cx={100} cy={60} r={6} fill={SKY} strokeWidth={4} />
      <circle cx={74} cy={59} r={4} fill={RED} strokeWidth={3} />
      <circle cx={126} cy={59} r={4} fill={RED} strokeWidth={3} />
    </Art>
  );
}

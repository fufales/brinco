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
  PINK,
  SKIN,
  SKY,
  SKY_LIGHT,
  SUN,
  WHITE,
} from './parts';

function Passenger({ x, hair }: { x: number; hair: string }) {
  return (
    <g>
      <circle cx={x} cy={84} r={13} fill={SKIN} strokeWidth={4} />
      <path d={`M${x - 13} 82 C${x - 14} 66 ${x + 14} 66 ${x + 13} 82 C${x + 6} 76 ${x - 6} 76 ${x - 13} 82 Z`} fill={hair} strokeWidth={4} />
      <Eye x={x + 5} y={85} r={2.8} />
    </g>
  );
}

export function Van() {
  return (
    <Art>
      <Cloud x={46} y={22} scale={0.85} />
      <Cloud x={156} y={28} scale={0.65} />
      <path d="M6 180 H194" />
      <path d="M14 150 V70 Q14 46 38 46 H130 Q146 46 154 60 L176 96 Q194 102 194 122 V150 Q194 160 184 160 H24 Q14 160 14 150 Z" fill={SUN} />
      {/* franja */}
      <path d="M16 118 H190 V136 H16 Z" fill={CORAL} stroke="none" />
      <path d="M16 118 H190 M16 136 H190" strokeWidth={4} />
      {/* ventanas con pasajeros */}
      <rect x={26} y={60} width={36} height={44} rx={8} fill={SKY_LIGHT} />
      <rect x={72} y={60} width={36} height={44} rx={8} fill={SKY_LIGHT} />
      <Passenger x={44} hair={HAIR} />
      <Passenger x={90} hair="#2b2a4c" />
      <rect x={26} y={60} width={36} height={44} rx={8} />
      <rect x={72} y={60} width={36} height={44} rx={8} />
      <path d="M118 60 H132 Q140 60 144 66 L164 104 H118 Z" fill={SKY_LIGHT} />
      {/* luces y parachoques */}
      <circle cx={184} cy={126} r={6} fill={WHITE} strokeWidth={4} />
      <rect x={170} y={148} width={28} height={13} rx={6} fill="#d5d9ea" />
      <path d="M118 122 H130" strokeWidth={5} />
      {/* llantas */}
      <circle cx={56} cy={158} r={22} fill={INK} />
      <circle cx={56} cy={158} r={10} fill="#d5d9ea" strokeWidth={4} />
      <circle cx={150} cy={158} r={22} fill={INK} />
      <circle cx={150} cy={158} r={10} fill="#d5d9ea" strokeWidth={4} />
    </Art>
  );
}

const VEST = '#17b8a6';
const VEST_DARK = '#0c8f80';

export function Vest() {
  return (
    <Art>
      <path d="M68 14 Q100 40 132 14 L100 108 Z" fill={VEST_DARK} />
      <path d="M70 12 L42 24 Q48 58 28 84 V178 Q28 192 42 192 H99 V108 Z" fill={VEST} />
      <path d="M130 12 L158 24 Q152 58 172 84 V178 Q172 192 158 192 H101 V108 Z" fill={VEST} />
      {/* bolsillos */}
      <path d="M44 140 H82 V160 Q82 170 72 170 H54 Q44 170 44 160 Z" fill="#5be0cf" />
      <path d="M156 140 H118 V160 Q118 170 128 170 H146 Q156 170 156 160 Z" fill="#5be0cf" />
      {/* botones */}
      <circle cx={88} cy={122} r={6} fill={SUN} strokeWidth={4} />
      <circle cx={88} cy={148} r={6} fill={SUN} strokeWidth={4} />
      <circle cx={88} cy={174} r={6} fill={SUN} strokeWidth={4} />
    </Art>
  );
}

function Note({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M12 -2 V-30 L30 -34 V-8" stroke={color} strokeWidth={6} />
      <ellipse cx={6} cy={0} rx={8} ry={6.5} fill={color} strokeWidth={4} />
      <ellipse cx={24} cy={-6} rx={8} ry={6.5} fill={color} strokeWidth={4} />
    </g>
  );
}

const WOOD = '#d9792e';
const WOOD_DARK = '#a4521a';

export function Violin() {
  return (
    <Art>
      <Note x={16} y={52} color={GRAPE} />
      <Note x={150} y={190} color={PINK} />
      {/* arco */}
      <path d="M20 148 L150 18" stroke={INK} strokeWidth={10} />
      <path d="M20 148 L150 18" stroke={GOLD} strokeWidth={4} />
      <path d="M30 152 L156 26" stroke={WHITE} strokeWidth={4} />
      <g transform="translate(14 8) rotate(24 100 100) scale(0.92)">
        {/* mástil y voluta */}
        <rect x={92} y={14} width={16} height={70} rx={3} fill={WOOD_DARK} />
        <circle cx={100} cy={10} r={12} fill={WOOD} />
        <path d="M100 10 m-5 0 a5 5 0 1 1 5 5" strokeWidth={3.5} />
        <path d="M80 30 H90 M110 30 H120 M80 46 H90 M110 46 H120" strokeWidth={6} />
        {/* cuerpo */}
        <path
          d="M100 70 C122 70 136 80 134 96 C132 110 120 112 120 124 C120 136 146 138 146 164 C146 188 124 200 100 200 C76 200 54 188 54 164 C54 138 80 136 80 124 C80 112 68 110 66 96 C64 80 78 70 100 70 Z"
          fill={WOOD}
        />
        {/* efes */}
        <path d="M74 136 C84 142 74 156 84 164" strokeWidth={4} />
        <path d="M126 136 C116 142 126 156 116 164" strokeWidth={4} />
        {/* diapasón, cuerdas, puente y cordal */}
        <path d="M94 40 H106 L108 124 H92 Z" fill={INK} stroke="none" />
        <path d="M98 40 V146 M102 40 V146" stroke={WHITE} strokeWidth={1.5} />
        <rect x={84} y={142} width={32} height={7} rx={2} fill="#fbe3bd" strokeWidth={3} />
        <path d="M90 154 H110 L106 188 H94 Z" fill={INK} stroke="none" />
      </g>
    </Art>
  );
}

export function Vase() {
  return (
    <Art>
      {/* tallos y hojas */}
      <path d="M92 108 C88 84 72 70 58 58" stroke={GREEN} strokeWidth={6} />
      <path d="M100 108 V50" stroke={GREEN} strokeWidth={6} />
      <path d="M108 108 C112 84 128 70 142 58" stroke={GREEN} strokeWidth={6} />
      <path d="M86 88 Q66 92 62 76 Q82 70 86 88 Z" fill={LIME} strokeWidth={4} />
      <path d="M114 88 Q134 92 138 76 Q118 70 114 88 Z" fill={LIME} strokeWidth={4} />
      <Flower x={50} y={40} r={15} color={PINK} />
      <Flower x={100} y={28} r={16} color={CORAL} />
      <Flower x={150} y={40} r={15} color={GRAPE} />
      {/* florero */}
      <path
        d="M74 106 H126 Q124 120 138 136 Q158 160 140 186 Q134 196 122 196 H78 Q66 196 60 186 Q42 160 62 136 Q76 120 74 106 Z"
        fill={SKY}
      />
      <path d="M57 150 L70 138 L84 150 L100 138 L116 150 L130 138 L143 150" stroke={WHITE} strokeWidth={5} />
      <path d="M58 172 L70 160 L84 172 L100 160 L116 172 L130 160 L142 172" stroke={SUN} strokeWidth={5} />
      <ellipse cx={100} cy={106} rx={30} ry={8} fill="#0f8fc4" />
    </Art>
  );
}

const ROCK = '#9a6b52';
const ROCK_DARK = '#7c523d';
const LAVA = '#ff6b35';

export function Volcano() {
  return (
    <Art>
      {/* humo */}
      <Cloud x={46} y={36} scale={1} fill="#d5d9ea" />
      <Cloud x={158} y={28} scale={1.05} fill="#d5d9ea" />
      {/* erupción */}
      <path
        d="M78 80 C68 62 74 46 84 44 C82 28 96 14 104 26 C116 20 126 36 118 48 C130 56 130 70 122 80 Z"
        fill={LAVA}
      />
      <path d="M90 80 C84 66 90 56 96 56 C98 44 110 46 108 58 C116 60 116 72 110 80 Z" fill={SUN} strokeWidth={4} />
      <circle cx={40} cy={74} r={7} fill={LAVA} strokeWidth={4} />
      <circle cx={160} cy={70} r={8} fill={LAVA} strokeWidth={4} />
      <circle cx={136} cy={14} r={5} fill={SUN} strokeWidth={3.5} />
      <circle cx={66} cy={14} r={5} fill={SUN} strokeWidth={3.5} />
      {/* montaña */}
      <path d="M8 194 L70 82 Q74 74 82 74 H118 Q126 74 130 82 L192 194 Z" fill={ROCK} />
      <path d="M8 194 L34 148 Q52 158 68 148 Q86 162 102 150 Q122 162 140 148 Q154 158 166 148 L192 194 Z" fill={ROCK_DARK} stroke="none" />
      <path d="M8 194 L70 82 Q74 74 82 74 H118 Q126 74 130 82 L192 194 Z" />
      {/* lava que baja */}
      <path
        d="M72 80 Q100 92 128 80 L140 104 Q132 122 122 104 Q116 136 104 110 Q96 126 88 106 Q78 120 62 98 Z"
        fill={LAVA}
      />
      <ellipse cx={100} cy={78} rx={29} ry={7} fill={SUN} />
      <Face x={100} y={150} gap={40} r={8} />
    </Art>
  );
}

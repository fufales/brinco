import { Art, Cheek, CORAL, Eye, Face, GRAPE, HAIR, INK, LIME, Limb, SKIN, SKY, SKY_LIGHT, SUN, WHITE } from './parts';

export function Water() {
  return (
    <Art>
      {/* gota */}
      <path d="M100 2 C110 18 120 28 120 40 C120 51 111 57 100 57 C89 57 80 51 80 40 C80 28 90 18 100 2 Z" fill={SKY} />
      <path d="M92 40 C92 34 95 30 97 28" stroke={WHITE} strokeWidth={4} />
      {/* salpicaduras */}
      <path d="M60 46 C64 52 66 56 62 60 C57 60 56 54 60 46 Z" fill={SKY} strokeWidth={4} />
      <path d="M140 46 C144 52 146 56 142 60 C137 60 136 54 140 46 Z" fill={SKY} strokeWidth={4} />
      {/* vaso */}
      <path d="M46 68 H154 L142 186 Q141 196 130 196 H70 Q59 196 58 186 Z" fill={SKY_LIGHT} />
      <path
        d="M51 104 Q75 92 100 104 T149 104 L142 186 Q141 196 130 196 H70 Q59 196 58 186 Z"
        fill={SKY}
      />
      <Face x={100} y={142} gap={36} r={7} />
      <path d="M66 86 L72 170" stroke={WHITE} strokeWidth={7} opacity={0.75} />
    </Art>
  );
}

const SHIRT = SKY;
const SHORTS = SUN;
const SHOE = CORAL;

export function Walk() {
  return (
    <Art>
      {/* suelo y líneas de movimiento */}
      <path d="M14 192 H186" />
      <path d="M22 84 H44 M12 106 H36 M22 128 H42" stroke={SKY} strokeWidth={5} />
      {/* brazo y pierna de atrás */}
      <Limb d="M90 100 L62 124" color={SKIN} width={12} />
      <Limb d="M92 140 L72 174" color={SKIN} width={13} />
      <path d="M50 188 C50 176 62 170 74 170 C84 170 84 180 82 188 Z" fill={SHOE} />
      {/* pierna de adelante */}
      <Limb d="M108 140 L134 170" color={SKIN} width={13} />
      <path d="M124 186 C122 172 132 164 142 166 C152 168 164 176 164 186 Z" fill={SHOE} />
      {/* mochila */}
      <path d="M78 92 C60 92 58 110 60 128 C62 134 76 134 82 130 Z" fill={GRAPE} />
      {/* cuerpo */}
      <path d="M76 90 Q100 80 124 90 L126 130 Q100 138 74 130 Z" fill={SHIRT} />
      <path d="M74 126 Q100 134 126 126 L132 152 L104 154 L100 142 L96 154 L68 152 Z" fill={SHORTS} />
      {/* cabeza */}
      <circle cx={84} cy={58} r={7} fill={SKIN} />
      <circle cx={104} cy={54} r={34} fill={SKIN} />
      <path d="M70 52 C64 18 102 8 124 20 C138 28 140 42 138 48 C126 38 112 34 100 36 C92 42 80 46 70 52 Z" fill={HAIR} />
      <Eye x={118} y={56} r={6} />
      <path d="M108 72 Q118 78 128 68" strokeWidth={4} />
      <Cheek x={104} y={66} r={6} />
      {/* brazo de adelante */}
      <Limb d="M110 100 L138 120" color={SKIN} width={12} />
    </Art>
  );
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_COLORS = [CORAL, SKY, LIME, GRAPE, '#ff5ca8', '#ffb627', CORAL];

export function Week() {
  return (
    <Art>
      <rect x={14} y={26} width={172} height={166} rx={20} fill={WHITE} />
      <path d="M14 46 Q14 26 34 26 H166 Q186 26 186 46 V66 H14 Z" fill={CORAL} />
      <rect x={48} y={10} width={13} height={32} rx={6.5} fill={WHITE} />
      <rect x={139} y={10} width={13} height={32} rx={6.5} fill={WHITE} />
      <circle cx={88} cy={46} r={5} fill={INK} stroke="none" />
      <circle cx={112} cy={46} r={5} fill={INK} stroke="none" />
      <path d="M95 50 Q100 56 105 50" strokeWidth={4} />
      {/* filas del mes, tenues */}
      {[76, 158, 174].map((y) =>
        DAYS.map((_, column) => (
          <rect
            key={`${y}-${column}`}
            x={26 + column * 22}
            y={y}
            width={15}
            height={10}
            rx={3}
            fill="#e8e4f5"
            stroke="none"
          />
        )),
      )}
      {/* la semana resaltada */}
      <rect x={20} y={92} width={160} height={58} rx={14} fill={SUN} />
      {DAYS.map((day, column) => (
        <g key={column}>
          <rect
            x={25 + column * 21.6}
            y={102}
            width={18.5}
            height={38}
            rx={6}
            fill={DAY_COLORS[column]}
            strokeWidth={3}
          />
          <text
            x={34.25 + column * 21.6}
            y={127}
            textAnchor="middle"
            fontFamily="'Fredoka Variable', sans-serif"
            fontSize={16}
            fontWeight={700}
            fill={WHITE}
            stroke="none"
          >
            {day}
          </text>
        </g>
      ))}
    </Art>
  );
}

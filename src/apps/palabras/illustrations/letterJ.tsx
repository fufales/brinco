import {
  Art,
  CORAL,
  Eye,
  Face,
  GREEN,
  HAIR,
  INK,
  Limb,
  PINK,
  RED,
  SKIN,
  SKY,
  SKY_LIGHT,
  Star,
  SUN,
  WHITE,
} from './parts';

const ORANGE = '#ff9f1c';
const ORANGE_LIGHT = '#ffd27a';

export function Juice() {
  return (
    <Art>
      {/* pajilla */}
      <path d="M104 120 L128 22 L158 12" stroke={INK} strokeWidth={15} />
      <path d="M104 120 L128 22 L158 12" stroke={PINK} strokeWidth={7} />
      {/* vaso con jugo */}
      <path d="M50 52 H150 L136 186 Q135 196 124 196 H76 Q65 196 64 186 Z" fill="#fff5e0" />
      <path
        d="M54 84 Q77 74 100 84 T147 84 L136 186 Q135 196 124 196 H76 Q65 196 64 186 Z"
        fill={ORANGE}
      />
      <Face x={100} y={132} gap={38} r={7.5} />
      <path d="M70 72 L76 166" stroke={WHITE} strokeWidth={7} opacity={0.7} />
      {/* rodaja de naranja */}
      <circle cx={154} cy={54} r={30} fill={ORANGE} />
      <circle cx={154} cy={54} r={21} fill={ORANGE_LIGHT} stroke="none" />
      <path d="M154 33 V75 M133 54 H175 M139 39 L169 69 M169 39 L139 69" stroke={ORANGE} strokeWidth={3.5} />
      <circle cx={154} cy={54} r={30} />
    </Art>
  );
}

export function Jam() {
  return (
    <Art>
      {/* frasco */}
      <path d="M42 62 Q34 70 34 86 V170 Q34 196 60 196 H140 Q166 196 166 170 V86 Q166 70 158 62 Z" fill={RED} />
      <path d="M50 88 V164" stroke={WHITE} strokeWidth={8} opacity={0.6} />
      {/* tela de cuadritos */}
      <path d="M28 44 Q100 22 172 44 L180 72 Q166 84 150 72 Q132 86 116 72 Q100 86 84 72 Q68 86 50 72 Q34 84 20 72 Z" fill={WHITE} />
      <path d="M40 40 L36 74 M64 34 L62 78 M88 31 V78 M112 31 V78 M136 34 L138 78 M160 40 L164 74" stroke={CORAL} strokeWidth={5} opacity={0.8} />
      <path d="M26 52 H174 M24 66 H176" stroke={CORAL} strokeWidth={5} opacity={0.8} />
      <path d="M28 44 Q100 22 172 44 L180 72 Q166 84 150 72 Q132 86 116 72 Q100 86 84 72 Q68 86 50 72 Q34 84 20 72 Z" />
      <path d="M38 80 Q100 92 162 80" stroke={SUN} strokeWidth={8} />
      {/* etiqueta */}
      <rect x={58} y={100} width={84} height={78} rx={14} fill="#fff6dc" />
      {/* fresa */}
      <path d="M100 170 C82 160 72 136 78 124 C84 114 116 114 122 124 C128 136 118 160 100 170 Z" fill={RED} />
      <path d="M84 122 L92 108 L100 116 L108 108 L116 122 Q100 130 84 122 Z" fill={GREEN} strokeWidth={4} />
      <path d="M90 136 V137 M110 136 V137 M100 146 V147 M88 150 V151 M112 150 V151 M100 158 V159" stroke={SUN} strokeWidth={4} />
    </Art>
  );
}

const WOOL = '#ff6b8b';
const WOOL_DARK = '#d9406a';

export function Jumper() {
  return (
    <Art>
      <path
        d="M70 22 Q100 42 130 22 L162 36 Q178 44 182 62 L196 138 L160 148 L148 96 V176 H52 V96 L40 148 L4 138 L18 62 Q22 44 38 36 Z"
        fill={WOOL}
      />
      {/* puños, ruedo y cuello */}
      <path d="M4 138 L40 148 L36 166 L0 156 Z" fill={WOOL_DARK} />
      <path d="M196 138 L160 148 L164 166 L200 156 Z" fill={WOOL_DARK} />
      <rect x={48} y={172} width={104} height={22} rx={7} fill={WOOL_DARK} />
      <path d="M66 22 Q100 50 134 22 L126 12 Q100 30 74 12 Z" fill={WOOL_DARK} />
      <path d="M64 176 V190 M82 176 V190 M100 176 V190 M118 176 V190 M136 176 V190" strokeWidth={3.5} />
      {/* costuras */}
      <path d="M52 96 V70 M148 96 V70" strokeWidth={4} />
      {/* dibujo */}
      <path d="M54 68 L69 54 L84 68 L100 54 L116 68 L131 54 L146 68" stroke={WHITE} strokeWidth={6} />
      <Star x={100} y={122} r={30} fill={SUN} />
    </Art>
  );
}

export function Jump() {
  return (
    <Art>
      {/* sombra y líneas de salto */}
      <ellipse cx={100} cy={190} rx={46} ry={8} fill={INK} stroke="none" opacity={0.18} />
      <path d="M72 164 V178 M100 168 V182 M128 164 V178" stroke={SKY} strokeWidth={5} />
      <Star x={24} y={92} r={13} />
      <Star x={176} y={92} r={13} />
      {/* brazos arriba */}
      <Limb d="M76 88 L44 48" color={SKIN} width={12} />
      <Limb d="M124 88 L156 48" color={SKIN} width={12} />
      {/* piernas dobladas */}
      <Limb d="M86 124 Q64 128 58 150" color={SKIN} width={13} />
      <Limb d="M114 124 Q136 128 142 150" color={SKIN} width={13} />
      <path d="M36 164 C34 152 46 146 58 148 C68 150 72 158 70 164 Z" fill={CORAL} />
      <path d="M164 164 C166 152 154 146 142 148 C132 150 128 158 130 164 Z" fill={CORAL} />
      {/* cuerpo */}
      <path d="M76 82 Q100 74 124 82 L126 116 Q100 122 74 116 Z" fill={SKY} />
      <path d="M74 112 Q100 120 126 112 L132 134 L104 138 L100 128 L96 138 L68 134 Z" fill={SUN} />
      {/* cabeza */}
      <circle cx={100} cy={46} r={33} fill={SKIN} />
      <path d="M67 42 C62 8 138 8 133 42 C126 30 112 26 100 28 C88 26 74 30 67 42 Z" fill={HAIR} />
      <Eye x={87} y={46} r={5.5} />
      <Eye x={113} y={46} r={5.5} />
      <path d="M88 58 Q100 72 112 58 Z" fill={RED} strokeWidth={4} />
      <circle cx={76} cy={57} r={5.5} fill="#ff9eb0" stroke="none" opacity={0.75} />
      <circle cx={124} cy={57} r={5.5} fill="#ff9eb0" stroke="none" opacity={0.75} />
    </Art>
  );
}

const JELLY = '#c678ff';
const JELLY_LIGHT = '#e6bcff';

export function Jellyfish() {
  return (
    <Art>
      {/* burbujas */}
      <circle cx={22} cy={46} r={8} fill={SKY_LIGHT} strokeWidth={4} />
      <circle cx={180} cy={74} r={6} fill={SKY_LIGHT} strokeWidth={4} />
      <circle cx={170} cy={22} r={10} fill={SKY_LIGHT} strokeWidth={4} />
      {/* tentáculos */}
      <Limb d="M58 106 C44 124 70 134 54 154 C46 166 58 176 52 192" color={JELLY_LIGHT} width={7} />
      <Limb d="M84 110 C74 128 96 138 84 158 C78 170 88 178 84 194" color={JELLY_LIGHT} width={7} />
      <Limb d="M116 110 C126 128 104 138 116 158 C122 170 112 178 116 194" color={JELLY_LIGHT} width={7} />
      <Limb d="M142 106 C156 124 130 134 146 154 C154 166 142 176 148 192" color={JELLY_LIGHT} width={7} />
      {/* campana */}
      <path
        d="M30 100 C26 38 68 10 100 10 C132 10 174 38 170 100 C170 112 156 118 146 108 C136 120 122 120 114 108 C106 120 94 120 86 108 C78 120 64 120 54 108 C44 118 30 112 30 100 Z"
        fill={JELLY}
      />
      <circle cx={58} cy={54} r={9} fill={JELLY_LIGHT} stroke="none" />
      <circle cx={140} cy={46} r={7} fill={JELLY_LIGHT} stroke="none" />
      <circle cx={100} cy={30} r={6} fill={JELLY_LIGHT} stroke="none" />
      <Face x={100} y={72} gap={42} r={8} />
    </Art>
  );
}

import { isMastered, type State } from '../../shared/progress';
import { POSITIONS } from './positions';

export function dondeSummary(state: State) {
  const mastered = POSITIONS.filter((item) => isMastered(state, item.id)).length;
  return { label: `${mastered} de ${POSITIONS.length} posiciones`, value: mastered / POSITIONS.length };
}

/** Dos cajas y una flecha que señala el hueco entre ellas: ícono de la tarjeta y de la portada. */
export function DondeIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <g stroke="#2b2a4c" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 56 H60" />
        <rect x={6} y={30} width={18} height={26} rx={4} fill="#fff" />
        <rect x={40} y={30} width={18} height={26} rx={4} fill="#fff" />
        <circle cx={32} cy={48} r={7} fill="#6fd64b" />
        <path d="M32 8 V24 M25 18 L32 25 L39 18" fill="none" stroke="#ffc531" strokeWidth={5} />
      </g>
      <g fill="#2b2a4c">
        <circle cx={29.5} cy={46.5} r={1.6} />
        <circle cx={34.5} cy={46.5} r={1.6} />
      </g>
    </svg>
  );
}

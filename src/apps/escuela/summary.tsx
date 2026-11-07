import { isMastered, type State } from '../../shared/progress';
import { PEOPLE } from './people';
import { PLACES } from './places';

const ALL = [...PLACES, ...PEOPLE];

export function escuelaSummary(state: State) {
  const mastered = ALL.filter((item) => isMastered(state, item.id)).length;
  return { label: `${mastered} de ${ALL.length} lugares y personas`, value: mastered / ALL.length };
}

/** Una escuelita con bandera: ícono de la tarjeta y dibujo de la portada. */
export function SchoolIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <g stroke="#2b2a4c" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        <path d="M32 14 V3 L43 6.5 L32 10" fill="#ff7a59" />
        <path d="M6 30 L32 14 L58 30 V59 H6 Z" fill="#fff" />
        <circle cx={32} cy={30} r={6} fill="#ffc531" />
        <rect x={12} y={37} width={10} height={9} rx={2} fill="#bdeeff" />
        <rect x={42} y={37} width={10} height={9} rx={2} fill="#bdeeff" />
        <path d="M25 59 V46 Q25 41 32 41 Q39 41 39 46 V59" fill="#3d7bf5" />
      </g>
    </svg>
  );
}

import { isMastered, type State } from '../../shared/progress';
import { PEOPLE } from './people';

export function amigosSummary(state: State) {
  const mastered = PEOPLE.filter((person) => isMastered(state, person.id)).length;
  return { label: `${mastered} de ${PEOPLE.length} personas`, value: mastered / PEOPLE.length };
}

/** Dos caritas juntas: ícono de la tarjeta y dibujo de la portada. */
export function AmigosIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <g stroke="#2b2a4c" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 60 Q6 42 22 42 Q38 42 38 60 Z" fill="#22b8f0" />
        <path d="M28 60 Q28 40 44 40 Q60 40 60 60 Z" fill="#ffc531" />
        <circle cx={22} cy={30} r={11} fill="#f8c9a0" />
        <path d="M11 29 Q11 17 22 17 Q33 17 33 29 Q27 23 22 24 Q16 23 11 29 Z" fill="#6a3f2a" />
        <circle cx={44} cy={27} r={11} fill="#f8c9a0" />
        <path d="M33 26 Q33 14 44 14 Q55 14 55 26 Q49 20 44 21 Q38 20 33 26 Z" fill="#2b2a4c" />
      </g>
      <g fill="#2b2a4c">
        <circle cx={18.5} cy={31} r={1.8} />
        <circle cx={25.5} cy={31} r={1.8} />
        <circle cx={40.5} cy={28} r={1.8} />
        <circle cx={47.5} cy={28} r={1.8} />
      </g>
      <g stroke="#2b2a4c" strokeWidth={2.2} fill="none" strokeLinecap="round">
        <path d="M19 35 Q22 37.5 25 35" />
        <path d="M41 32 Q44 34.5 47 32" />
      </g>
    </svg>
  );
}

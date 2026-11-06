import { isMastered, type State } from '../../shared/progress';
import { WORDS } from './words';

export function palabrasSummary(state: State) {
  const mastered = WORDS.filter((word) => isMastered(state, word.id)).length;
  return { label: `${mastered} de ${WORDS.length} palabras`, value: mastered / WORDS.length };
}

export function PalabrasIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <path
        d="M10 12 H54 Q60 12 60 18 V40 Q60 46 54 46 H30 L18 57 L20 46 H10 Q4 46 4 40 V18 Q4 12 10 12 Z"
        fill="#fff"
        stroke="#2b2a4c"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <text
        x={32}
        y={37}
        textAnchor="middle"
        fontFamily="'Fredoka Variable', sans-serif"
        fontSize={24}
        fontWeight={700}
        fill="#6c4df6"
      >
        Hi!
      </text>
    </svg>
  );
}

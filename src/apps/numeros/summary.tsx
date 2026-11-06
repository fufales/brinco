import { isMastered, type State } from '../../shared/progress';
import { NUMBERS } from './numbers';

export function numerosSummary(state: State) {
  const mastered = NUMBERS.filter((item) => isMastered(state, item.id)).length;
  return { label: `${mastered} de ${NUMBERS.length} números`, value: mastered / NUMBERS.length };
}

export function NumerosIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <path
        d="M32 32 L41 5 A28 28 0 1 1 23 5 Z"
        fill="#fff"
        stroke="#2b2a4c"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <text
        x={32}
        y={46}
        textAnchor="middle"
        fontFamily="'Fredoka Variable', sans-serif"
        fontSize={25}
        fontWeight={700}
        fill="#0c8f80"
      >
        20
      </text>
    </svg>
  );
}

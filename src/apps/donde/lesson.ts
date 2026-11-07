import type { LessonItem } from '../../shared/lesson/types';
import { shuffle, type Random } from '../../shared/lesson/utils';
import { POSITIONS, randomObjects, randomScene, type PositionId, type Scene } from './positions';

export type DondeExercise =
  | { kind: 'listen' | 'read'; key: string; item: LessonItem; scene: Scene; options: PositionId[] }
  | { kind: 'match'; key: string; items: LessonItem[]; objects: [string, string]; ref: 0 | 1 };

const LISTEN_ROUNDS = 2;

function choice(kind: 'listen' | 'read', item: LessonItem, round: number, random: Random): DondeExercise {
  return {
    kind,
    key: `${kind}-${item.id}-${round}`,
    item,
    scene: randomScene(item.id as PositionId, random),
    options: shuffle(
      POSITIONS.map((position) => position.id as PositionId),
      random,
    ),
  };
}

function mainItem(exercise: DondeExercise): string | null {
  return exercise.kind === 'match' ? null : exercise.item.id;
}

/** Evita preguntar la misma posición dos veces seguidas. */
function separateRepeats(exercises: DondeExercise[], random: Random): DondeExercise[] {
  const result = [...exercises];
  for (let attempt = 0; attempt < 200; attempt++) {
    const clash = result.findIndex(
      (exercise, index) => index > 0 && mainItem(exercise) !== null && mainItem(exercise) === mainItem(result[index - 1]),
    );
    if (clash === -1) break;
    const swapWith = Math.floor(random() * result.length);
    [result[clash], result[swapWith]] = [result[swapWith], result[clash]];
  }
  return result;
}

/** Oír cada posición dos veces, leer cada una una vez y, a la mitad, unir parejas. */
export function buildDondeLesson(random: Random = Math.random): DondeExercise[] {
  const listen = Array.from({ length: LISTEN_ROUNDS }, (_, round) =>
    POSITIONS.map((item) => choice('listen', item, round, random)),
  ).flat();
  const read = POSITIONS.map((item) => choice('read', item, 0, random));
  const match: DondeExercise = {
    kind: 'match',
    key: 'match-0',
    items: POSITIONS,
    objects: randomObjects(random),
    ref: random() < 0.5 ? 0 : 1,
  };
  const singles = shuffle([...listen, ...read], random);
  const half = Math.ceil(singles.length / 2);
  return separateRepeats([...singles.slice(0, half), match, ...singles.slice(half)], random);
}

export function retryDondeExercise(exercise: DondeExercise, attempt: number, random: Random = Math.random): DondeExercise {
  const key = `${exercise.key}-retry${attempt}`;
  return exercise.kind === 'match' ? { ...exercise, key } : { ...exercise, key, options: shuffle(exercise.options, random) };
}

export function exercisePositions(exercise: DondeExercise): LessonItem[] {
  return exercise.kind === 'match' ? exercise.items : [exercise.item];
}

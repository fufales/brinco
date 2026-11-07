import type { LessonItem } from '../../shared/lesson/types';
import { shuffle, type Random } from '../../shared/lesson/utils';

export type SchoolExercise =
  | { kind: 'listen' | 'read'; key: string; item: LessonItem; options: LessonItem[] }
  | { kind: 'match'; key: string; items: LessonItem[] };

const OPTION_COUNT = 4;
const PAIRS_PER_MATCH = 4;

function choice(kind: 'listen' | 'read', item: LessonItem, all: LessonItem[], random: Random): SchoolExercise {
  const others = shuffle(
    all.filter((other) => other.id !== item.id),
    random,
  ).slice(0, OPTION_COUNT - 1);
  return { kind, key: `${kind}-${item.id}`, item, options: shuffle([item, ...others], random) };
}

function mainItem(exercise: SchoolExercise): string | null {
  return exercise.kind === 'match' ? null : exercise.item.id;
}

/** Evita preguntar lo mismo dos veces seguidas. */
function separateRepeats(exercises: SchoolExercise[], random: Random): SchoolExercise[] {
  const result = [...exercises];
  for (let attempt = 0; attempt < 50; attempt++) {
    const clash = result.findIndex(
      (exercise, index) => index > 0 && mainItem(exercise) !== null && mainItem(exercise) === mainItem(result[index - 1]),
    );
    if (clash === -1) break;
    const swapWith = Math.floor(random() * result.length);
    [result[clash], result[swapWith]] = [result[swapWith], result[clash]];
  }
  return result;
}

/** Oír cada uno, leer algunos y, a la mitad, unir parejas. */
export function buildSchoolLesson(items: LessonItem[], readCount: number, random: Random = Math.random): SchoolExercise[] {
  const listen = items.map((item) => choice('listen', item, items, random));
  const read = shuffle(items, random)
    .slice(0, readCount)
    .map((item) => choice('read', item, items, random));
  const match: SchoolExercise = {
    kind: 'match',
    key: 'match-0',
    items: shuffle(items, random).slice(0, PAIRS_PER_MATCH),
  };
  const singles = shuffle([...listen, ...read], random);
  const half = Math.ceil(singles.length / 2);
  return separateRepeats([...singles.slice(0, half), match, ...singles.slice(half)], random);
}

/** Vuelve a preguntar al final, con otro orden para que no se memorice la posición. */
export function retrySchoolExercise(exercise: SchoolExercise, attempt: number, random: Random = Math.random): SchoolExercise {
  const key = `${exercise.key}-retry${attempt}`;
  return exercise.kind === 'match' ? { ...exercise, key } : { ...exercise, key, options: shuffle(exercise.options, random) };
}

export function exerciseItems(exercise: SchoolExercise): LessonItem[] {
  return exercise.kind === 'match' ? exercise.items : [exercise.item];
}

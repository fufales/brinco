import type { LessonItem } from '../../shared/lesson/types';
import { shuffle, type Random } from '../../shared/lesson/utils';
import { PLACES, type Place } from './places';

export type SchoolExercise =
  | { kind: 'listen' | 'read'; key: string; place: Place; options: Place[] }
  | { kind: 'match'; key: string; places: Place[] };

const OPTION_COUNT = 4;
const READ_COUNT = 4;
const PAIRS_PER_MATCH = 4;

function choice(kind: 'listen' | 'read', place: Place, random: Random): SchoolExercise {
  const others = shuffle(
    PLACES.filter((other) => other.id !== place.id),
    random,
  ).slice(0, OPTION_COUNT - 1);
  return { kind, key: `${kind}-${place.id}`, place, options: shuffle([place, ...others], random) };
}

function mainPlace(exercise: SchoolExercise): string | null {
  return exercise.kind === 'match' ? null : exercise.place.id;
}

/** Evita preguntar el mismo lugar dos veces seguidas. */
function separateRepeats(exercises: SchoolExercise[], random: Random): SchoolExercise[] {
  const result = [...exercises];
  for (let attempt = 0; attempt < 50; attempt++) {
    const clash = result.findIndex(
      (exercise, index) => index > 0 && mainPlace(exercise) !== null && mainPlace(exercise) === mainPlace(result[index - 1]),
    );
    if (clash === -1) break;
    const swapWith = Math.floor(random() * result.length);
    [result[clash], result[swapWith]] = [result[swapWith], result[clash]];
  }
  return result;
}

/** Oír cada lugar, leer cuatro y, a la mitad, unir parejas. */
export function buildSchoolLesson(random: Random = Math.random): SchoolExercise[] {
  const listen = PLACES.map((place) => choice('listen', place, random));
  const read = shuffle(PLACES, random)
    .slice(0, READ_COUNT)
    .map((place) => choice('read', place, random));
  const match: SchoolExercise = {
    kind: 'match',
    key: 'match-0',
    places: shuffle(PLACES, random).slice(0, PAIRS_PER_MATCH),
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

export function exercisePlaces(exercise: SchoolExercise): LessonItem[] {
  return exercise.kind === 'match' ? exercise.places : [exercise.place];
}

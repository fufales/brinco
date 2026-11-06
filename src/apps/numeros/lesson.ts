import { shuffle, type Random } from '../../shared/lesson/utils';
import { MAX_VALUE, MIN_VALUE, NUMBERS, numbersIn, type NumberItem, type NumberScope } from './numbers';

export type NumberExercise =
  | { kind: 'listen' | 'read'; key: string; item: NumberItem; options: NumberItem[] }
  | { kind: 'count'; key: string; item: NumberItem; options: NumberItem[] }
  | { kind: 'write'; key: string; item: NumberItem; tiles: string[] }
  | { kind: 'missing'; key: string; item: NumberItem; line: number[]; options: NumberItem[] }
  | { kind: 'hop'; key: string; items: NumberItem[] }
  | { kind: 'match'; key: string; items: NumberItem[] };

type SingleKind = 'listen' | 'read' | 'count' | 'write' | 'missing';

const PAIRS_PER_MATCH = 4;
const LINE_LENGTH = 5;
const CHALLENGE_HOPS = 6;
const DIGIT_TILES = 4;
const DIGITS = '0123456789'.split('');

const byValue = (a: NumberItem, b: NumberItem) => a.value - b.value;

/** Respuestas parecidas: los números vecinos son los que de verdad se confunden. */
function nearbyOptions(item: NumberItem, count: number, random: Random): NumberItem[] {
  const closest = shuffle(
    NUMBERS.filter((other) => other.id !== item.id),
    random,
  ).sort((a, b) => Math.abs(a.value - item.value) - Math.abs(b.value - item.value));
  return shuffle([item, ...closest.slice(0, count - 1)], random);
}

/** Cinco números seguidos con uno sin mostrar; nunca se sale del 11 al 20. */
function missingLine(item: NumberItem, random: Random): number[] {
  const back = 1 + Math.floor(random() * (LINE_LENGTH - 2));
  const start = Math.min(Math.max(item.value - back, MIN_VALUE), MAX_VALUE - LINE_LENGTH + 1);
  return Array.from({ length: LINE_LENGTH }, (_, index) => start + index);
}

function missingOptions(item: NumberItem, line: number[], random: Random): NumberItem[] {
  // Las demás opciones no pueden ser números que ya se ven en la fila.
  const outside = shuffle(
    NUMBERS.filter((other) => !line.includes(other.value)),
    random,
  ).sort((a, b) => Math.abs(a.value - item.value) - Math.abs(b.value - item.value));
  return shuffle([item, ...outside.slice(0, 2)], random);
}

/** Las cifras del número y otras de relleno, hasta completar las fichas. */
function digitTiles(item: NumberItem, random: Random): string[] {
  const digits = String(item.value).split('');
  const others = shuffle(
    DIGITS.filter((digit) => !digits.includes(digit)),
    random,
  );
  return shuffle([...digits, ...others.slice(0, DIGIT_TILES - digits.length)], random);
}

function single(kind: SingleKind, item: NumberItem, random: Random): NumberExercise {
  const key = `${kind}-${item.id}`;
  switch (kind) {
    case 'write':
      return { kind, key, item, tiles: digitTiles(item, random) };
    case 'missing': {
      const line = missingLine(item, random);
      return { kind, key, item, line, options: missingOptions(item, line, random) };
    }
    case 'count':
      return { kind, key, item, options: nearbyOptions(item, 3, random) };
    default:
      return { kind, key, item, options: nearbyOptions(item, 4, random) };
  }
}

function hop(items: NumberItem[], random: Random): NumberExercise {
  return { kind: 'hop', key: 'hop', items: shuffle(items, random) };
}

/** De lo fácil a lo difícil. La secuencia reparte los números para no repetir uno seguido. */
const GROUP_PLAN: (SingleKind | 'match' | 'hop')[] = [
  'listen',
  'count',
  'read',
  'match',
  'write',
  'listen',
  'count',
  'missing',
  'write',
  'hop',
];

const CHALLENGE_PLAN: (SingleKind | 'match' | 'hop')[] = [
  'listen',
  'count',
  'write',
  'read',
  'missing',
  'match',
  'listen',
  'write',
  'count',
  'read',
  'missing',
  'hop',
];

export function buildNumberLesson(scope: NumberScope, random: Random = Math.random): NumberExercise[] {
  const numbers = numbersIn(scope);
  const order = shuffle(numbers, random);
  const plan = scope === 'todos' ? CHALLENGE_PLAN : GROUP_PLAN;

  let next = 0;
  let round = 0;
  return plan.map((step): NumberExercise => {
    if (step === 'hop') {
      const count = scope === 'todos' ? CHALLENGE_HOPS : numbers.length;
      return hop(shuffle(numbers, random).slice(0, count), random);
    }
    if (step === 'match') {
      round += 1;
      return { kind: 'match', key: `match-${round}`, items: shuffle(numbers, random).slice(0, PAIRS_PER_MATCH) };
    }
    const item = order[next % order.length];
    next += 1;
    const exercise = single(step, item, random);
    // En los grupos de 5, un mismo número puede tocar dos veces el mismo ejercicio.
    return { ...exercise, key: `${exercise.key}-${next}` };
  });
}

export function retryNumberExercise(
  exercise: NumberExercise,
  attempt: number,
  random: Random = Math.random,
): NumberExercise {
  const key = `${exercise.key}-retry${attempt}`;
  return 'options' in exercise ? { ...exercise, key, options: shuffle(exercise.options, random) } : { ...exercise, key };
}

export function exerciseNumbers(exercise: NumberExercise): NumberItem[] {
  return 'items' in exercise ? [...exercise.items].sort(byValue) : [exercise.item];
}

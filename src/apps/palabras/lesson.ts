import { shuffle, type Random } from '../../shared/lesson/utils';
import { ALL_ID, WORDS, wordsIn, type Scope, type Word } from './words';

export type Exercise =
  | { kind: 'listen' | 'read'; key: string; word: Word; options: Word[] }
  | { kind: 'spell'; key: string; word: Word; tiles: string[] }
  | { kind: 'match'; key: string; words: Word[] };

/** Palabras más largas se piden armar solo si no hay otra opción: a los 7 años cuestan mucho. */
const MAX_SPELL_LENGTH = 7;
const TARGET_LENGTH = 10;
const OPTION_COUNT = 4;
const PAIRS_PER_MATCH = 4;

function pickOptions(word: Word, random: Random): Word[] {
  // Primero las de la misma letra: es más difícil y es lo que practica.
  const sameGroup = shuffle(
    WORDS.filter((w) => w.group === word.group && w.id !== word.id),
    random,
  );
  const others = shuffle(
    WORDS.filter((w) => w.group !== word.group),
    random,
  );
  const distractors = [...sameGroup, ...others].slice(0, OPTION_COUNT - 1);
  return shuffle([word, ...distractors], random);
}

function scrambleLetters(text: string, random: Random): string[] {
  const letters = text.split('');
  for (let attempt = 0; attempt < 12; attempt++) {
    const scrambled = shuffle(letters, random);
    if (scrambled.join('') !== text) return scrambled;
  }
  return letters.reverse();
}

function choice(kind: 'listen' | 'read', word: Word, random: Random): Exercise {
  return { kind, key: `${kind}-${word.id}`, word, options: pickOptions(word, random) };
}

function spell(word: Word, random: Random): Exercise {
  return { kind: 'spell', key: `spell-${word.id}`, word, tiles: scrambleLetters(word.en, random) };
}

function canSpell(word: Word): boolean {
  return word.en.length <= MAX_SPELL_LENGTH;
}

function buildGroupLesson(words: Word[], random: Random): Exercise[] {
  const listen = words.map((word) => choice('listen', word, random));
  const match: Exercise = {
    kind: 'match',
    key: 'match-0',
    words: shuffle(words, random).slice(0, PAIRS_PER_MATCH),
  };

  const remaining = TARGET_LENGTH - listen.length - 1;
  const spellable = shuffle(words.filter(canSpell), random);
  const spellCount = Math.min(Math.floor(remaining / 2), spellable.length);
  const readCount = Math.min(remaining - spellCount, words.length);
  const read = shuffle(words, random)
    .slice(0, readCount)
    .map((word) => choice('read', word, random));
  const spells = spellable.slice(0, spellCount).map((word) => spell(word, random));

  // De lo fácil a lo difícil: oír y leer primero, armar palabras al final.
  const warmUp = shuffle([...listen, ...read], random);
  const half = Math.ceil(warmUp.length / 2);
  return separateRepeats(
    [...warmUp.slice(0, half), match, ...shuffle([...warmUp.slice(half), ...spells], random)],
    random,
  );
}

/** El Gran reto toca las 17 palabras una vez, para que no sea eterno. */
function buildChallenge(random: Random): Exercise[] {
  const words = shuffle(WORDS, random);
  const matches: Exercise[] = [0, 1].map((round) => ({
    kind: 'match',
    key: `match-${round}`,
    words: words.slice(round * PAIRS_PER_MATCH, (round + 1) * PAIRS_PER_MATCH),
  }));
  const singles = words.slice(matches.length * PAIRS_PER_MATCH).map((word, index): Exercise => {
    const turn = index % 3;
    if (turn === 2 && canSpell(word)) return spell(word, random);
    return choice(turn === 0 ? 'listen' : 'read', word, random);
  });
  const third = Math.floor(singles.length / 3);
  return [
    ...singles.slice(0, third),
    matches[0],
    ...singles.slice(third, third * 2),
    matches[1],
    ...singles.slice(third * 2),
  ];
}

function mainWord(exercise: Exercise): string | null {
  return exercise.kind === 'match' ? null : exercise.word.id;
}

/** Evita preguntar la misma palabra dos veces seguidas. */
function separateRepeats(exercises: Exercise[], random: Random): Exercise[] {
  const result = [...exercises];
  for (let attempt = 0; attempt < 30; attempt++) {
    const clash = result.findIndex(
      (exercise, index) => index > 0 && mainWord(exercise) !== null && mainWord(exercise) === mainWord(result[index - 1]),
    );
    if (clash === -1) break;
    const swapWith = Math.floor(random() * result.length);
    [result[clash], result[swapWith]] = [result[swapWith], result[clash]];
  }
  return result;
}

export function buildLesson(scope: Scope, random: Random = Math.random): Exercise[] {
  return scope === ALL_ID ? buildChallenge(random) : buildGroupLesson(wordsIn(scope), random);
}

/** Vuelve a preguntar al final, con otro orden para que no se memorice la posición. */
export function retryExercise(exercise: Exercise, attempt: number, random: Random = Math.random): Exercise {
  const key = `${exercise.key}-retry${attempt}`;
  return exercise.kind === 'listen' || exercise.kind === 'read'
    ? { ...exercise, key, options: shuffle(exercise.options, random) }
    : { ...exercise, key };
}

export function exerciseWords(exercise: Exercise): Word[] {
  return exercise.kind === 'match' ? exercise.words : [exercise.word];
}

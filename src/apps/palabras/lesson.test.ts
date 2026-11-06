import { describe, expect, it } from 'vitest';
import { buildLesson, exerciseWords, retryExercise, starsFor, type Exercise } from './lesson';
import { GROUPS, WORDS, wordsIn } from './words';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

describe('buildLesson', () => {
  for (const group of GROUPS) {
    it(`practices every word of letter ${group.letter} in 10 exercises`, () => {
      for (let seed = 1; seed < 40; seed++) {
        const lesson = buildLesson(group.id, seeded(seed));
        expect(lesson).toHaveLength(10);
        const practiced = new Set(lesson.flatMap(exerciseWords).map((word) => word.id));
        expect(practiced).toEqual(new Set(wordsIn(group.id).map((word) => word.id)));
        expect(new Set(lesson.map((exercise) => exercise.key)).size).toBe(lesson.length);
      }
    });
  }

  it('covers all 17 words in the challenge', () => {
    for (let seed = 1; seed < 40; seed++) {
      const lesson = buildLesson('todas', seeded(seed));
      const practiced = lesson.flatMap(exerciseWords).map((word) => word.id);
      expect(new Set(practiced).size).toBe(WORDS.length);
    }
  });

  it('builds valid choices and scrambled letters', () => {
    for (let seed = 1; seed < 40; seed++) {
      for (const scope of ['k', 'w', 'v', 'j', 'todas'] as const) {
        for (const exercise of buildLesson(scope, seeded(seed))) {
          if (exercise.kind === 'listen' || exercise.kind === 'read') {
            expect(exercise.options).toHaveLength(4);
            expect(new Set(exercise.options.map((word) => word.id)).size).toBe(4);
            expect(exercise.options.map((word) => word.id)).toContain(exercise.word.id);
          }
          if (exercise.kind === 'spell') {
            expect(exercise.word.en.length).toBeLessThanOrEqual(7);
            expect([...exercise.tiles].sort()).toEqual(exercise.word.en.split('').sort());
            expect(exercise.tiles.join('')).not.toBe(exercise.word.en);
          }
        }
      }
    }
  });
});

describe('retryExercise', () => {
  it('keeps the answer but gets a new key', () => {
    const exercise = buildLesson('k', seeded(3)).find((item) => item.kind === 'listen') as Extract<
      Exercise,
      { kind: 'listen' | 'read' }
    >;
    const retried = retryExercise(exercise, 1, seeded(9));
    expect(retried.key).not.toBe(exercise.key);
    expect(exerciseWords(retried)).toEqual(exerciseWords(exercise));
  });
});

describe('starsFor', () => {
  it('gives at least one star and three for a nearly clean lesson', () => {
    expect(starsFor(0, 10)).toBe(1);
    expect(starsFor(6, 10)).toBe(2);
    expect(starsFor(9, 10)).toBe(3);
    expect(starsFor(10, 10)).toBe(3);
  });
});

import { describe, expect, it } from 'vitest';
import { buildSchoolLesson, exerciseItems, retrySchoolExercise, type SchoolExercise } from './lesson';
import { PEOPLE } from '../amigos/people';
import { PLACES } from './places';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function mainItem(exercise: SchoolExercise) {
  return exercise.kind === 'match' ? null : exercise.item.id;
}

const TOPICS = [
  { name: 'places', items: PLACES, readCount: 3 },
  { name: 'people', items: PEOPLE, readCount: 2 },
];

for (const { name, items, readCount } of TOPICS) {
  describe(`buildSchoolLesson for ${name}`, () => {
    const build = (seed: number) => buildSchoolLesson(items, readCount, seeded(seed));

    it('practices every item in 10 exercises with one match', () => {
      for (let seed = 1; seed < 60; seed++) {
        const lesson = build(seed);
        expect(lesson).toHaveLength(10);
        expect(new Set(lesson.flatMap(exerciseItems).map((item) => item.id))).toEqual(new Set(items.map((item) => item.id)));
        expect(new Set(lesson.map((exercise) => exercise.key)).size).toBe(lesson.length);
        expect(lesson.filter((exercise) => exercise.kind === 'match')).toHaveLength(1);
      }
    });

    it('never asks the same item twice in a row', () => {
      for (let seed = 1; seed < 200; seed++) {
        const lesson = build(seed);
        lesson.forEach((exercise, index) => {
          if (index > 0 && mainItem(exercise)) expect(mainItem(exercise)).not.toBe(mainItem(lesson[index - 1]));
        });
      }
    });

    it('builds valid choices and a match of four different items', () => {
      for (let seed = 1; seed < 60; seed++) {
        for (const exercise of build(seed)) {
          if (exercise.kind === 'match') {
            expect(new Set(exercise.items.map((item) => item.id)).size).toBe(4);
          } else {
            expect(exercise.options).toHaveLength(4);
            expect(new Set(exercise.options.map((item) => item.id)).size).toBe(4);
            expect(exercise.options.some((item) => item.id === exercise.item.id)).toBe(true);
          }
        }
      }
    });

    it('gives retries a new key and keeps the same options', () => {
      const [first] = build(7);
      const retry = retrySchoolExercise(first, 1, seeded(3));
      expect(retry.key).not.toBe(first.key);
      expect(new Set(exerciseItems(retry).map((item) => item.id))).toEqual(new Set(exerciseItems(first).map((item) => item.id)));
    });
  });
}

import { describe, expect, it } from 'vitest';
import { buildSchoolLesson, exercisePlaces, retrySchoolExercise, type SchoolExercise } from './lesson';
import { PLACES } from './places';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function mainPlace(exercise: SchoolExercise) {
  return exercise.kind === 'match' ? null : exercise.place.id;
}

describe('buildSchoolLesson', () => {
  it('practices all five places in 10 exercises with one match', () => {
    for (let seed = 1; seed < 60; seed++) {
      const lesson = buildSchoolLesson(seeded(seed));
      expect(lesson).toHaveLength(10);
      expect(new Set(lesson.flatMap(exercisePlaces).map((place) => place.id))).toEqual(new Set(PLACES.map((place) => place.id)));
      expect(new Set(lesson.map((exercise) => exercise.key)).size).toBe(lesson.length);
      expect(lesson.filter((exercise) => exercise.kind === 'match')).toHaveLength(1);
    }
  });

  it('never asks the same place twice in a row', () => {
    for (let seed = 1; seed < 200; seed++) {
      const lesson = buildSchoolLesson(seeded(seed));
      lesson.forEach((exercise, index) => {
        if (index > 0 && mainPlace(exercise)) expect(mainPlace(exercise)).not.toBe(mainPlace(lesson[index - 1]));
      });
    }
  });

  it('builds valid choices and a match of four different places', () => {
    for (let seed = 1; seed < 60; seed++) {
      for (const exercise of buildSchoolLesson(seeded(seed))) {
        if (exercise.kind === 'match') {
          expect(new Set(exercise.places.map((place) => place.id)).size).toBe(4);
        } else {
          expect(exercise.options).toHaveLength(4);
          expect(new Set(exercise.options.map((place) => place.id)).size).toBe(4);
          expect(exercise.options.some((place) => place.id === exercise.place.id)).toBe(true);
        }
      }
    }
  });

  it('gives retries a new key and keeps the same options', () => {
    const [first] = buildSchoolLesson(seeded(7));
    const retry = retrySchoolExercise(first, 1, seeded(3));
    expect(retry.key).not.toBe(first.key);
    expect(new Set(exercisePlaces(retry).map((place) => place.id))).toEqual(new Set(exercisePlaces(first).map((place) => place.id)));
  });
});

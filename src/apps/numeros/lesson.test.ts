import { describe, expect, it } from 'vitest';
import { buildNumberLesson, exerciseNumbers, retryNumberExercise, type NumberExercise } from './lesson';
import { numbersIn, type NumberScope } from './numbers';

function seeded(seed: number) {
  // Se dispersa la semilla: las pequeñas casi no mezclan y siempre darían órdenes parecidos.
  let value = (seed * 2654435761) % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

const SCOPES: NumberScope[] = ['a', 'b', 'todos'];

function forEverySeed(check: (scope: NumberScope, lesson: NumberExercise[]) => void) {
  for (let seed = 1; seed < 60; seed++) {
    for (const scope of SCOPES) check(scope, buildNumberLesson(scope, seeded(seed)));
  }
}

describe('buildNumberLesson', () => {
  it('practices every number of its part', () => {
    forEverySeed((scope, lesson) => {
      const practiced = new Set(lesson.flatMap(exerciseNumbers).map((item) => item.value));
      expect(practiced).toEqual(new Set(numbersIn(scope).map((item) => item.value)));
    });
  });

  it('has 10 exercises, or 12 in the challenge, with unique keys', () => {
    forEverySeed((scope, lesson) => {
      expect(lesson).toHaveLength(scope === 'todos' ? 12 : 10);
      expect(new Set(lesson.map((exercise) => exercise.key)).size).toBe(lesson.length);
    });
  });

  it('uses every kind of exercise', () => {
    forEverySeed((_scope, lesson) => {
      expect(new Set(lesson.map((exercise) => exercise.kind))).toEqual(
        new Set(['listen', 'read', 'count', 'write', 'missing', 'hop', 'match']),
      );
    });
  });

  it('does not ask for the same number twice in a row', () => {
    forEverySeed((_scope, lesson) => {
      lesson.forEach((exercise, index) => {
        const previous = lesson[index - 1];
        if (previous && 'item' in exercise && 'item' in previous) {
          expect(exercise.item.value).not.toBe(previous.item.value);
        }
      });
    });
  });

  it('builds valid answers', () => {
    forEverySeed((_scope, lesson) => {
      for (const exercise of lesson) {
        if (exercise.kind === 'listen' || exercise.kind === 'read') expect(exercise.options).toHaveLength(4);
        if (exercise.kind === 'count' || exercise.kind === 'missing') expect(exercise.options).toHaveLength(3);
        if ('options' in exercise) {
          const values = exercise.options.map((item) => item.value);
          expect(new Set(values).size).toBe(values.length);
          expect(values).toContain(exercise.item.value);
          for (const value of values) {
            expect(value).toBeGreaterThanOrEqual(11);
            expect(value).toBeLessThanOrEqual(20);
          }
        }
      }
    });
  });

  it('offers the digits of the number among four tiles', () => {
    forEverySeed((_scope, lesson) => {
      for (const exercise of lesson) {
        if (exercise.kind !== 'write') continue;
        expect(exercise.tiles).toHaveLength(4);
        const remaining = [...exercise.tiles];
        for (const digit of String(exercise.item.value)) {
          const found = remaining.indexOf(digit);
          expect(found).toBeGreaterThanOrEqual(0);
          remaining.splice(found, 1);
        }
        // Las de relleno no pueden ser una de las cifras: no habría forma de equivocarse con ellas.
        for (const digit of remaining) expect(String(exercise.item.value)).not.toContain(digit);
      }
    });
  });

  it('has two tiles of 1 for eleven', () => {
    for (let seed = 1; seed < 200; seed++) {
      const eleven = buildNumberLesson('a', seeded(seed)).find(
        (exercise) => exercise.kind === 'write' && exercise.item.value === 11,
      );
      if (eleven?.kind === 'write') {
        expect(eleven.tiles.filter((digit) => digit === '1')).toHaveLength(2);
        return;
      }
    }
    throw new Error('No lesson asked to write eleven');
  });

  it('shows five numbers in a row around the missing one', () => {
    forEverySeed((_scope, lesson) => {
      for (const exercise of lesson) {
        if (exercise.kind !== 'missing') continue;
        expect(exercise.line).toHaveLength(5);
        expect(exercise.line).toContain(exercise.item.value);
        exercise.line.forEach((value, index) => expect(value).toBe(exercise.line[0] + index));
        expect(exercise.line[0]).toBeGreaterThanOrEqual(11);
        expect(exercise.line[4]).toBeLessThanOrEqual(20);
        // Una opción incorrecta que ya se ve en la fila sería un regalo o una trampa.
        for (const option of exercise.options) {
          if (option.value !== exercise.item.value) expect(exercise.line).not.toContain(option.value);
        }
      }
    });
  });
});

describe('retryNumberExercise', () => {
  it('keeps the answer but gets a new key', () => {
    const exercise = buildNumberLesson('a', seeded(5)).find((item) => item.kind === 'listen')!;
    const retried = retryNumberExercise(exercise, 1, seeded(9));
    expect(retried.key).not.toBe(exercise.key);
    expect(exerciseNumbers(retried)).toEqual(exerciseNumbers(exercise));
  });
});

import { describe, expect, it } from 'vitest';
import { PEOPLE } from '../amigos/people';
import { PLACES } from '../escuela/places';
import { NUMBERS } from '../numeros/numbers';
import { WORDS } from '../palabras/words';
import { buildDondeLesson, exercisePositions } from './lesson';
import { makeRounds } from './MoveGame';
import { acceptedSpots, command, OBJECT_IDS, POSITIONS, sentence, SPOTS, spotFor, type PositionId } from './positions';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

describe('positions', () => {
  it('teaches next to, in front of and between with ids no other app uses', () => {
    expect(POSITIONS.map((item) => item.en)).toEqual(['next to', 'in front of', 'between']);
    const others = new Set([...WORDS, ...NUMBERS, ...PLACES, ...PEOPLE].map((item) => item.id));
    expect(POSITIONS.filter((item) => others.has(item.id))).toEqual([]);
  });

  it('only uses objects that have a drawing in Brincapalabras', () => {
    const words = new Set(WORDS.map((word) => word.id));
    for (const id of OBJECT_IDS) expect(words.has(id)).toBe(true);
  });

  it('builds the sentences the voice says', () => {
    expect(sentence({ objects: ['van', 'vase'], position: 'next-to', ref: 1 })).toBe('The frog is next to the vase.');
    expect(sentence({ objects: ['van', 'vase'], position: 'between', ref: 0 })).toBe('The frog is between the van and the vase.');
    expect(command({ objects: ['king', 'juice'], position: 'in-front-of', ref: 0 })).toBe('Put the frog in front of the king!');
  });

  it('draws each position in a different place, so every scene has one answer', () => {
    for (const ref of [0, 1] as const) {
      const spots = POSITIONS.map((item) => spotFor({ position: item.id as PositionId, ref }));
      expect(new Set(spots).size).toBe(3);
    }
  });

  it('accepts the right spots in the drag game', () => {
    expect(acceptedSpots({ position: 'between', ref: 0 })).toEqual(['between']);
    expect(acceptedSpots({ position: 'in-front-of', ref: 1 })).toEqual(['front-b']);
    expect(acceptedSpots({ position: 'next-to', ref: 0 })).toEqual(['left-a', 'between']);
    // "In front of" queda más abajo y más grande que lo que está al lado.
    expect(SPOTS['front-a'].floor).toBeLessThan(SPOTS['left-a'].floor);
    expect(SPOTS['front-a'].size).toBeGreaterThan(SPOTS['left-a'].size);
  });
});

describe('lesson and game', () => {
  it('practices the three positions in 10 exercises without repeating one twice in a row', () => {
    for (let seed = 1; seed < 100; seed++) {
      const lesson = buildDondeLesson(seeded(seed));
      expect(lesson).toHaveLength(10);
      expect(new Set(lesson.flatMap(exercisePositions).map((item) => item.id)).size).toBe(3);
      expect(new Set(lesson.map((exercise) => exercise.key)).size).toBe(10);
      lesson.forEach((exercise, index) => {
        const previous = lesson[index - 1];
        if (index > 0 && exercise.kind !== 'match' && previous.kind !== 'match') {
          expect(exercise.item.id).not.toBe(previous.item.id);
        }
      });
    }
  });

  it('plays six rounds, two of each position, with two different objects each time', () => {
    for (let seed = 1; seed < 100; seed++) {
      const rounds = makeRounds(seeded(seed));
      expect(rounds).toHaveLength(6);
      for (const id of POSITIONS.map((item) => item.id)) {
        expect(rounds.filter((scene) => scene.position === id)).toHaveLength(2);
      }
      for (const scene of rounds) expect(scene.objects[0]).not.toBe(scene.objects[1]);
    }
  });
});

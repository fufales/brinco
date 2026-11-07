import { describe, expect, it } from 'vitest';
import { NUMBERS } from '../numeros/numbers';
import { WORDS } from '../palabras/words';
import { directions, PLACES } from './places';

describe('places', () => {
  it('has the five requested places', () => {
    expect(PLACES.map((place) => place.en)).toEqual(['garden', 'restroom', "principal's office", 'library', 'classroom']);
  });

  it('uses ids that no other app uses, since progress is saved by id', () => {
    const others = new Set([...WORDS, ...NUMBERS].map((item) => item.id));
    const ids = PLACES.map((place) => place.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => others.has(id))).toEqual([]);
  });

  it('says where to go', () => {
    expect(directions(PLACES[2])).toBe("Go to the principal's office!");
  });
});

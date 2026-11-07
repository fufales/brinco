import { describe, expect, it } from 'vitest';
import { NUMBERS } from '../numeros/numbers';
import { WORDS } from '../palabras/words';
import { findText, PEOPLE } from './people';
import { PLACES } from '../escuela/places';

describe('people', () => {
  it('has the seven requested people', () => {
    expect(PEOPLE.map((person) => person.en)).toEqual([
      'principal',
      'cook',
      'janitor',
      'students',
      'teacher',
      'security guard',
      'secretary',
    ]);
  });

  it('uses ids that no other app uses, since progress is saved by id', () => {
    const others = new Set([...WORDS, ...NUMBERS, ...PLACES].map((item) => item.id));
    const ids = PEOPLE.map((person) => person.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => others.has(id))).toEqual([]);
  });

  it('puts each person somewhere on the school plan, at most two per room', () => {
    const areas = ['garden', 'cafeteria', 'classroom', 'library', 'restroom', 'office', 'entrance'];
    for (const person of PEOPLE) expect(areas).toContain(person.area);
    for (const area of areas) expect(PEOPLE.filter((person) => person.area === area).length).toBeLessThanOrEqual(2);
  });

  it('says who to find', () => {
    expect(findText(PEOPLE[5])).toBe('Find the security guard!');
  });
});

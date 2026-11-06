import { describe, expect, it } from 'vitest';
import { shuffle, starsFor } from './utils';

describe('starsFor', () => {
  it('gives at least one star and three for a nearly clean lesson', () => {
    expect(starsFor(0, 10)).toBe(1);
    expect(starsFor(6, 10)).toBe(2);
    expect(starsFor(9, 10)).toBe(3);
    expect(starsFor(10, 10)).toBe(3);
  });
});

describe('shuffle', () => {
  it('keeps every item and leaves the original alone', () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect([...result].sort()).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

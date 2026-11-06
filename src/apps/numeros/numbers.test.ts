import { describe, expect, it } from 'vitest';
import { NUMBERS, numbersIn, progressKey, wordFor } from './numbers';

describe('numbers', () => {
  it('has the numbers from 11 to 20 with their words', () => {
    expect(NUMBERS.map((item) => item.value)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(NUMBERS.map((item) => item.en)).toEqual([
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
      'twenty',
    ]);
    expect(NUMBERS.map((item) => item.es)).toEqual([
      'once',
      'doce',
      'trece',
      'catorce',
      'quince',
      'dieciséis',
      'diecisiete',
      'dieciocho',
      'diecinueve',
      'veinte',
    ]);
  });

  it('splits the numbers into two parts and a challenge with all of them', () => {
    expect(numbersIn('a').map((item) => item.value)).toEqual([11, 12, 13, 14, 15]);
    expect(numbersIn('b').map((item) => item.value)).toEqual([16, 17, 18, 19, 20]);
    expect(numbersIn('todos')).toHaveLength(10);
  });

  it('has a word for every number used when counting', () => {
    expect(wordFor(1)).toBe('one');
    expect(wordFor(10)).toBe('ten');
    expect(wordFor(11)).toBe('eleven');
    expect(wordFor(20)).toBe('twenty');
  });

  it('keeps its stars apart from the word game', () => {
    for (const key of [progressKey('a'), progressKey('b'), progressKey('todos')]) {
      expect(['k', 'w', 'v', 'j', 'todas']).not.toContain(key);
    }
  });
});

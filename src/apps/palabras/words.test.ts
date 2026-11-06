import { describe, expect, it } from 'vitest';
import { GROUPS, WORDS, wordsIn } from './words';

describe('words', () => {
  it('has the 17 requested words', () => {
    expect(WORDS).toHaveLength(17);
    expect(WORDS.map((w) => w.es)).toEqual([
      'canguro',
      'cometa',
      'llaves',
      'rey',
      'agua',
      'caminar',
      'semana',
      'buseta',
      'chaleco',
      'violín',
      'florero',
      'volcán',
      'jugo',
      'mermelada',
      'suéter',
      'brincar',
      'medusa',
    ]);
  });

  it('starts every word with the letter of its group', () => {
    for (const word of WORDS) {
      expect(word.en[0]).toBe(word.group);
    }
  });

  it('has unique ids and places each word in exactly one group', () => {
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length);
    const total = GROUPS.reduce((sum, g) => sum + wordsIn(g.id).length, 0);
    expect(total).toBe(WORDS.length);
  });
});

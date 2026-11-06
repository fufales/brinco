import { describe, expect, it } from 'vitest';
import { rankVoice, sortVoices } from './speech';

describe('voice ranking', () => {
  it('drops voices that are not English', () => {
    const sorted = sortVoices([
      { name: 'Paulina', lang: 'es-MX' },
      { name: 'Samantha', lang: 'en-US' },
    ]);
    expect(sorted.map((v) => v.name)).toEqual(['Samantha']);
  });

  it('prefers American voices over other English voices', () => {
    const sorted = sortVoices([
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'Generic', lang: 'en-US' },
    ]);
    expect(sorted[0].name).toBe('Generic');
  });

  it('accepts Android style language tags', () => {
    expect(rankVoice({ name: 'English', lang: 'en_US' })).toBeGreaterThanOrEqual(1000);
  });

  it('prefers natural voices and pushes novelty voices last', () => {
    const sorted = sortVoices([
      { name: 'Zarvox', lang: 'en-US' },
      { name: 'Plain', lang: 'en-US' },
      { name: 'Samantha', lang: 'en-US' },
      { name: 'Microsoft Aria Online (Natural)', lang: 'en-US' },
    ]);
    expect(sorted.map((v) => v.name)).toEqual([
      'Microsoft Aria Online (Natural)',
      'Samantha',
      'Plain',
      'Zarvox',
    ]);
  });
});

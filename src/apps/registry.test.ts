import { describe, expect, it } from 'vitest';
import { APPS } from './registry';

describe('registry', () => {
  it('gives every app its own id, path and name', () => {
    for (const key of ['id', 'path', 'title'] as const) {
      const values = APPS.map((app) => app[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('keeps school places and school people as separate games', () => {
    expect(APPS.map((app) => app.title)).toEqual(['Brincapalabras', 'Brincanúmeros', 'Brincaescuela', 'Brincamigos']);
  });
});

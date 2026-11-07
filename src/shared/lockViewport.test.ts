import { describe, expect, it } from 'vitest';
import { viewportFor } from './lockViewport';

const cssWidth = (content: string) => Number(/width=(\d+)/.exec(content)?.[1]);
const scale = (content: string) => Number(/initial-scale=([\d.]+)/.exec(content)?.[1]);

describe('viewportFor', () => {
  it('deja los teléfonos como están, en vertical y acostados', () => {
    expect(viewportFor(390, 844, true)).toEqual({ tablet: false, content: expect.stringContaining('width=device-width') });
    expect(viewportFor(932, 430, true).tablet).toBe(false);
  });

  it('no toca una computadora sin pantalla táctil', () => {
    expect(viewportFor(1440, 900, false).tablet).toBe(false);
  });

  it('agranda un iPad y conserva el tamaño al girarlo', () => {
    const portrait = viewportFor(820, 1180, true);
    const landscape = viewportFor(1180, 820, true);
    expect(portrait.tablet && landscape.tablet).toBe(true);
    expect(scale(portrait.content)).toBeCloseTo(1.367, 2);
    expect(scale(landscape.content)).toBe(scale(portrait.content));
    expect(cssWidth(portrait.content)).toBe(600);
    expect(cssWidth(landscape.content)).toBe(863);
  });

  it('no agranda de más un iPad grande', () => {
    const big = viewportFor(1032, 1376, true);
    expect(scale(big.content)).toBe(1.5);
    expect(cssWidth(big.content)).toBe(688);
  });

  it('usa el diseño de teléfono con la ventana partida', () => {
    expect(viewportFor(507, 1180, true).tablet).toBe(false);
  });
});

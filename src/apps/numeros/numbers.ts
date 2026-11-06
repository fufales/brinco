import type { LessonItem } from '../../shared/lesson/types';

export interface NumberItem extends LessonItem {
  value: number;
}

const NAMES: [number, string, string][] = [
  [11, 'eleven', 'once'],
  [12, 'twelve', 'doce'],
  [13, 'thirteen', 'trece'],
  [14, 'fourteen', 'catorce'],
  [15, 'fifteen', 'quince'],
  [16, 'sixteen', 'dieciséis'],
  [17, 'seventeen', 'diecisiete'],
  [18, 'eighteen', 'dieciocho'],
  [19, 'nineteen', 'diecinueve'],
  [20, 'twenty', 'veinte'],
];

export const NUMBERS: NumberItem[] = NAMES.map(([value, en, es]) => ({ id: `n${value}`, value, en, es }));

const SMALL_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** La palabra en inglés de cualquier número del 1 al 20, para contar en voz alta. */
export function wordFor(value: number): string {
  return value <= 10 ? SMALL_WORDS[value - 1] : NUMBERS[value - 11].en;
}

export const MIN_VALUE = 11;
export const MAX_VALUE = 20;

export type NumberScope = 'a' | 'b' | 'todos';

const SCOPES: Record<NumberScope, { title: string; from: number; to: number; color: string; edge: string }> = {
  a: { title: '11 a 15', from: 11, to: 15, color: '#ff7a59', edge: '#dc5533' },
  b: { title: '16 a 20', from: 16, to: 20, color: '#9a6bff', edge: '#7344e0' },
  todos: { title: 'Gran reto', from: 11, to: 20, color: '#ff5ca8', edge: '#d33a84' },
};

export function isNumberScope(value: string): value is NumberScope {
  return value in SCOPES;
}

export function scopeInfo(scope: NumberScope) {
  return SCOPES[scope];
}

export function numbersIn(scope: NumberScope): NumberItem[] {
  const { from, to } = SCOPES[scope];
  return NUMBERS.filter((item) => item.value >= from && item.value <= to);
}

/** Dónde se guardan las estrellas; no choca con las de Brincapalabras. */
export function progressKey(scope: NumberScope): string {
  return `num-${scope}`;
}

export const FIREFLY_PROGRESS_KEY = 'num-luciernagas';

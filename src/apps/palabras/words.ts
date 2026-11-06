export type GroupId = 'k' | 'w' | 'v' | 'j';

export interface Word {
  id: string;
  /** La palabra en inglés que se practica y que dice la voz. */
  en: string;
  /** La pista en español. */
  es: string;
  group: GroupId;
}

export interface Group {
  id: GroupId;
  letter: string;
  color: string;
  edge: string;
}

export const WORDS: Word[] = [
  { id: 'kangaroo', en: 'kangaroo', es: 'canguro', group: 'k' },
  { id: 'kite', en: 'kite', es: 'cometa', group: 'k' },
  { id: 'keys', en: 'keys', es: 'llaves', group: 'k' },
  { id: 'king', en: 'king', es: 'rey', group: 'k' },

  { id: 'water', en: 'water', es: 'agua', group: 'w' },
  { id: 'walk', en: 'walk', es: 'caminar', group: 'w' },
  { id: 'week', en: 'week', es: 'semana', group: 'w' },

  { id: 'van', en: 'van', es: 'buseta', group: 'v' },
  { id: 'vest', en: 'vest', es: 'chaleco', group: 'v' },
  { id: 'violin', en: 'violin', es: 'violín', group: 'v' },
  { id: 'vase', en: 'vase', es: 'florero', group: 'v' },
  { id: 'volcano', en: 'volcano', es: 'volcán', group: 'v' },

  { id: 'juice', en: 'juice', es: 'jugo', group: 'j' },
  { id: 'jam', en: 'jam', es: 'mermelada', group: 'j' },
  { id: 'jumper', en: 'jumper', es: 'suéter', group: 'j' },
  { id: 'jump', en: 'jump', es: 'brincar', group: 'j' },
  { id: 'jellyfish', en: 'jellyfish', es: 'medusa', group: 'j' },
];

export const GROUPS: Group[] = [
  { id: 'k', letter: 'K', color: '#ff7a59', edge: '#dc5533' },
  { id: 'w', letter: 'W', color: '#22b8f0', edge: '#0f8fc4' },
  { id: 'v', letter: 'V', color: '#9a6bff', edge: '#7344e0' },
  { id: 'j', letter: 'J', color: '#ffb627', edge: '#df8f00' },
];

/** El Gran reto y la galería usan las 17 palabras. */
export const ALL_ID = 'todas';
export const ALL_COLOR = '#ff5ca8';
export const ALL_EDGE = '#d33a84';

export type Scope = GroupId | typeof ALL_ID;

export function isScope(value: string): value is Scope {
  return value === ALL_ID || GROUPS.some((g) => g.id === value);
}

export function wordsIn(scope: Scope): Word[] {
  return scope === ALL_ID ? WORDS : WORDS.filter((w) => w.group === scope);
}

export function scopeColors(scope: Scope): { color: string; edge: string } {
  const group = GROUPS.find((g) => g.id === scope);
  return group ? { color: group.color, edge: group.edge } : { color: ALL_COLOR, edge: ALL_EDGE };
}

export function scopeTitle(scope: Scope): string {
  const group = GROUPS.find((g) => g.id === scope);
  return group ? `Letra ${group.letter}` : 'Todas las palabras';
}

import type { LessonItem } from '../../shared/lesson/types';
import { shuffle, type Random } from '../../shared/lesson/utils';
import { WORDS } from '../palabras/words';

export type PositionId = 'next-to' | 'in-front-of' | 'between';

export const POSITIONS: LessonItem[] = [
  { id: 'next-to', en: 'next to', es: 'al lado de' },
  { id: 'in-front-of', en: 'in front of', es: 'delante de' },
  { id: 'between', en: 'between', es: 'entre' },
];

export function positionOf(item: LessonItem): PositionId {
  return item.id as PositionId;
}

/** Objetos que el niño ya conoce de Brincapalabras y que se paran bien en el piso. */
export const OBJECT_IDS = ['van', 'vase', 'juice', 'king', 'kangaroo', 'volcano'] as const;

function nameOf(objectId: string): string {
  return WORDS.find((word) => word.id === objectId)!.en;
}

/**
 * Lugares donde puede pararse la rana en un escenario con dos objetos, A a la izquierda y B a la derecha.
 * Los de "front" quedan más abajo y más grandes: más cerca de quien mira.
 */
export type SpotId = 'left-a' | 'between' | 'right-b' | 'front-a' | 'front-b';

export interface Spot {
  /** Centro horizontal, en % del ancho del escenario. */
  x: number;
  /** Dónde pisa, en % de la altura desde abajo. */
  floor: number;
  /** Ancho de la rana, en % del ancho del escenario. */
  size: number;
  front: boolean;
}

export const OBJECT_X = [30, 70] as const;
export const OBJECT_SIZE = 24;
export const FLOOR = 28;

export const SPOTS: Record<SpotId, Spot> = {
  'left-a': { x: 9.5, floor: FLOOR, size: 17, front: false },
  between: { x: 50, floor: FLOOR, size: 17, front: false },
  'right-b': { x: 90.5, floor: FLOOR, size: 17, front: false },
  'front-a': { x: 30, floor: 7, size: 22, front: true },
  'front-b': { x: 70, floor: 7, size: 22, front: true },
};

/** Un escenario: dos objetos y de cuál se habla (A = 0, B = 1). En "between" se habla de los dos. */
export interface Scene {
  objects: [string, string];
  position: PositionId;
  ref: 0 | 1;
}

/** El lugar que se dibuja en las escenas de la lección: uno solo, sin ambigüedad. */
export function spotFor(scene: Pick<Scene, 'position' | 'ref'>): SpotId {
  if (scene.position === 'between') return 'between';
  if (scene.position === 'in-front-of') return scene.ref === 0 ? 'front-a' : 'front-b';
  return scene.ref === 0 ? 'left-a' : 'right-b';
}

/** Lugares que cuentan como correctos en el juego de mover a la rana. */
export function acceptedSpots(scene: Pick<Scene, 'position' | 'ref'>): SpotId[] {
  if (scene.position === 'between') return ['between'];
  if (scene.position === 'in-front-of') return [scene.ref === 0 ? 'front-a' : 'front-b'];
  // Estar entre los dos también es estar al lado de cada uno.
  return scene.ref === 0 ? ['left-a', 'between'] : ['right-b', 'between'];
}

function target(scene: Scene): string {
  const [a, b] = scene.objects.map(nameOf);
  if (scene.position === 'between') return `the ${a} and the ${b}`;
  return `the ${scene.ref === 0 ? a : b}`;
}

function phrase(position: PositionId): string {
  return POSITIONS.find((item) => item.id === position)!.en;
}

/** "The frog is next to the van." */
export function sentence(scene: Scene): string {
  return `The frog is ${phrase(scene.position)} ${target(scene)}.`;
}

/** "Put the frog next to the van!" */
export function command(scene: Scene): string {
  return `Put the frog ${phrase(scene.position)} ${target(scene)}!`;
}

export function randomObjects(random: Random = Math.random): [string, string] {
  const [a, b] = shuffle(OBJECT_IDS, random);
  return [a, b];
}

export function randomScene(position: PositionId, random: Random = Math.random): Scene {
  return { objects: randomObjects(random), position, ref: random() < 0.5 ? 0 : 1 };
}

export const DONDE_COLORS = { color: '#8a5cf6', edge: '#6a3fd8' };
export const LESSON_KEY = 'donde';
export const GAME_KEY = 'donde-mover';

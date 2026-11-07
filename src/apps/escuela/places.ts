import type { LessonItem } from '../../shared/lesson/types';

export type Place = LessonItem;

export const PLACES: Place[] = [
  { id: 'garden', en: 'garden', es: 'jardín' },
  { id: 'restroom', en: 'restroom', es: 'baño' },
  { id: 'principal-office', en: "principal's office", es: 'dirección' },
  { id: 'library', en: 'library', es: 'biblioteca' },
  { id: 'classroom', en: 'classroom', es: 'aula' },
  { id: 'cafeteria', en: 'cafeteria', es: 'comedor' },
];

/** Dónde se guardan las estrellas de la lección y del mapa. */
export const LESSON_KEY = 'escuela';
export const MAP_KEY = 'escuela-mapa';

export const SCHOOL_COLORS = { color: '#3d7bf5', edge: '#2357c9' };

/** Lo que dice la voz en el mapa. */
export function directions(place: Place): string {
  return `Go to the ${place.en}!`;
}

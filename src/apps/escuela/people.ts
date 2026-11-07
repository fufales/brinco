import type { LessonItem } from '../../shared/lesson/types';

/** Las zonas del plano de la escuela; cada lugar ocupa una. */
export type CampusArea = 'garden' | 'cafeteria' | 'classroom' | 'library' | 'restroom' | 'office' | 'entrance';

export interface Person extends LessonItem {
  /** Dónde aparece en el plano de ¿Quién es? */
  area: CampusArea;
}

export const PEOPLE: Person[] = [
  { id: 'principal', en: 'principal', es: 'directora', area: 'office' },
  { id: 'cook', en: 'cook', es: 'cocinero', area: 'cafeteria' },
  { id: 'janitor', en: 'janitor', es: 'conserje', area: 'restroom' },
  { id: 'students', en: 'students', es: 'estudiantes', area: 'garden' },
  { id: 'teacher', en: 'teacher', es: 'maestra', area: 'classroom' },
  { id: 'security-guard', en: 'security guard', es: 'guarda', area: 'entrance' },
  { id: 'secretary', en: 'secretary', es: 'secretario', area: 'office' },
];

/** Dónde se guardan las estrellas de la lección y del juego ¿Quién es? */
export const PEOPLE_LESSON_KEY = 'escuela-personas';
export const WHO_KEY = 'escuela-quien';

/** Lo que dice la voz en ¿Quién es? */
export function findText(person: LessonItem): string {
  return `Find the ${person.en}!`;
}

import type { ComponentType } from 'react';
import type { LessonItem } from '../../shared/lesson/types';
import { PlaceArt } from './illustrations';
import { directions, LESSON_KEY, MAP_KEY, PLACES, SCHOOL_COLORS } from './places';

/**
 * Lo que cambia entre un juego de la escuela y otro. Brincaescuela (lugares) y
 * Brincamigos (personas) comparten las mismas pantallas con distinto tema.
 */
export interface Topic {
  id: 'places' | 'people';
  items: LessonItem[];
  Art: ComponentType<{ id: string; play?: number }>;
  colors: { color: string; edge: string };
  lessonKey: string;
  gameKey: string;
  readCount: number;
  discoverTitle: string;
  discoverHint: string;
  /** Completa "Escucha y toca…" en la lección. */
  pickWhat: string;
  matchTitle: string;
  /** La frase en inglés del juego del plano. */
  say: (item: LessonItem) => string;
  sayVerb: string;
}

export const PLACES_TOPIC: Topic = {
  id: 'places',
  items: PLACES,
  Art: PlaceArt,
  colors: SCHOOL_COLORS,
  lessonKey: LESSON_KEY,
  gameKey: MAP_KEY,
  readCount: 3,
  discoverTitle: 'Lugares de la escuela',
  discoverHint: 'Toca un lugar para oír su nombre',
  pickWhat: 'el lugar',
  matchTitle: 'Une cada lugar con su nombre',
  say: directions,
  sayVerb: 'Go to the',
};

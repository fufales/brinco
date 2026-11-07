import type { ComponentType } from 'react';
import type { LessonItem } from '../../shared/lesson/types';
import { PlaceArt } from './illustrations';
import { PEOPLE, PEOPLE_LESSON_KEY, WHO_KEY, findText } from './people';
import { PersonArt } from './peopleArt';
import { directions, LESSON_KEY, MAP_KEY, PLACES } from './places';

/** Lo que cambia entre aprender lugares y aprender personas; las pantallas son las mismas. */
export interface Topic {
  id: 'places' | 'people';
  items: LessonItem[];
  Art: ComponentType<{ id: string; play?: number }>;
  /** Prefijo de las rutas dentro de Brincaescuela. */
  base: string;
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
  base: '',
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

export const PEOPLE_TOPIC: Topic = {
  id: 'people',
  items: PEOPLE,
  Art: PersonArt,
  base: '/personas',
  lessonKey: PEOPLE_LESSON_KEY,
  gameKey: WHO_KEY,
  readCount: 2,
  discoverTitle: 'Personas de la escuela',
  discoverHint: 'Toca a alguien para oír quién es',
  pickWhat: 'a la persona',
  matchTitle: 'Une cada persona con su nombre',
  say: findText,
  sayVerb: 'Find the',
};

import type { Topic } from '../escuela/topics';
import { AMIGOS_COLORS, findText, PEOPLE, PEOPLE_LESSON_KEY, WHO_KEY } from './people';
import { PersonArt } from './peopleArt';

export const PEOPLE_TOPIC: Topic = {
  id: 'people',
  items: PEOPLE,
  Art: PersonArt,
  colors: AMIGOS_COLORS,
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

import { PEOPLE, findText } from '../../apps/amigos/people';
import { allSceneSpeech, discoverSpeech, POSITIONS, type PositionId } from '../../apps/donde/positions';
import { directions, PLACES } from '../../apps/escuela/places';
import { wordFor } from '../../apps/numeros/numbers';
import { WORDS } from '../../apps/palabras/words';
import { normalizePhrase } from './normalize';

/**
 * Todo lo que la app dice en voz alta. `npm run voices` genera un audio realista de cada frase
 * y las pruebas fallan si alguna se queda sin audio.
 *
 * Al agregar un juego, añade aquí sus frases y corre `npm run voices` (ver CLAUDE.md).
 */
export function allPhrases(): string[] {
  const phrases = [
    // Inicio
    'Hello!',
    // Brincapalabras
    ...WORDS.map((word) => word.en),
    // Brincanúmeros: del 1 al 20, porque al contar se dicen también los del 1 al 10
    ...Array.from({ length: 20 }, (_, index) => wordFor(index + 1)),
    // Brincaescuela
    ...PLACES.map((place) => place.en),
    ...PLACES.map(directions),
    // Brincamigos
    ...PEOPLE.map((person) => person.en),
    ...PEOPLE.map(findText),
    // Brincadónde
    ...POSITIONS.map((item) => item.en),
    ...POSITIONS.map((item) => discoverSpeech(item.id as PositionId)),
    ...allSceneSpeech(),
  ];
  return [...new Set(phrases.map(normalizePhrase))];
}

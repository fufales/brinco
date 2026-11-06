import type { Word } from '../words';

export interface ExerciseResult {
  /** Sin ningún error: cuenta para las estrellas. */
  clean: boolean;
  /** Si es false, el ejercicio vuelve al final de la lección. */
  passed: boolean;
  /** La palabra que se muestra en el aviso; las Parejas no tienen una sola. */
  word?: Word;
  /** Palabras en las que hubo un error. */
  missedIds: string[];
}

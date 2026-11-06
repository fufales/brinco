/** Lo que se practica en una lección: una palabra, un número… */
export interface LessonItem {
  id: string;
  /** En inglés: es lo que dice la voz. */
  en: string;
  /** La pista en español. */
  es: string;
}

export interface ExerciseResult {
  /** Sin ningún error: cuenta para las estrellas. */
  clean: boolean;
  /** Si es false, el ejercicio vuelve al final de la lección. */
  passed: boolean;
  /** Lo que se muestra y se dice en el aviso; algunos ejercicios no tienen uno solo. */
  item?: LessonItem;
  /** El texto del aviso cuando no hay un solo elemento. */
  summary?: string;
  /** Elementos en los que hubo un error. */
  missedIds: string[];
}

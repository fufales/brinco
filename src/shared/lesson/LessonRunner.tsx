import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'motion/react';
import { recordLesson } from '../progress';
import { sfx } from '../sfx';
import { speak } from '../speech';
import { Mascot } from '../ui/Mascot';
import { Sheet } from '../ui/Sheet';
import { CloseIcon, SpeakerIcon, StarIcon } from '../ui/icons';
import { useBlockUpdates } from '../updates';
import { ResultsScreen } from './ResultsScreen';
import type { ExerciseResult, LessonItem } from './types';
import { starsFor } from './utils';
import './lesson.css';

const WORD_AFTER_SFX_MS = 280;
const PRAISE = ['¡Muy bien!', '¡Genial!', '¡Excelente!', '¡Así se hace!', '¡Súper!', '¡Increíble!'];

export interface LessonRunnerProps<E extends { key: string }> {
  /** Dónde se guardan las estrellas de esta lección. */
  progressKey: string;
  accent: { color: string; edge: string };
  build: () => E[];
  itemsOf: (exercise: E) => LessonItem[];
  retry: (exercise: E, attempt: number) => E;
  renderExercise: (exercise: E, onDone: (result: ExerciseResult) => void) => ReactNode;
  /** Cómo se muestra el elemento en el aviso de acierto o error. */
  renderItemText: (item: LessonItem) => ReactNode;
  renderThumb: (item: LessonItem, play: number) => ReactNode;
  oopsTitle?: string;
  onExit: () => void;
}

interface Outcome {
  stars: number;
  clean: number;
  total: number;
  items: LessonItem[];
}

export function LessonRunner<E extends { key: string }>(props: LessonRunnerProps<E>) {
  useBlockUpdates();
  const [round, setRound] = useState(0);
  return <LessonRun key={round} {...props} onRestart={() => setRound((count) => count + 1)} />;
}

function LessonRun<E extends { key: string }>({
  progressKey,
  accent,
  build,
  itemsOf,
  retry,
  renderExercise,
  renderItemText,
  renderThumb,
  oopsTitle = '¡Casi! Es esta:',
  onExit,
  onRestart,
}: LessonRunnerProps<E> & { onRestart: () => void }) {
  const [lesson] = useState(build);
  const [queue, setQueue] = useState<E[]>(lesson);
  const [position, setPosition] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<(ExerciseResult & { praise: string }) | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Cuenta solo el primer intento de cada ejercicio; lo repetido no da estrellas.
  const cleanFirstTries = useRef(0);
  const missedItems = useRef(new Set<string>());
  const retryKeys = useRef(new Set<string>());
  const attempts = useRef(0);
  // El aviso se puede seguir tocando mientras sale de pantalla: un doble toque en
  // "Seguir" saltaría un ejercicio o, al final, se saldría de la lista.
  const canAdvance = useRef(false);

  const exercise = queue[position];
  const isLastExercise = position === queue.length - 1;

  const handleDone = (result: ExerciseResult) => {
    if (result.clean && !retryKeys.current.has(exercise.key)) cleanFirstTries.current += 1;
    result.missedIds.forEach((id) => missedItems.current.add(id));

    if (result.passed) {
      setPassedCount((count) => count + 1);
      setStreak((count) => (result.clean ? count + 1 : 0));
      sfx.correct();
      void confetti({ particleCount: 36, spread: 62, origin: { y: 0.72 }, disableForReducedMotion: true });
    } else {
      setStreak(0);
      sfx.oops();
      attempts.current += 1;
      const again = retry(exercise, attempts.current);
      retryKeys.current.add(again.key);
      setQueue((current) => [...current, again]);
    }

    // Primero termina el sonido de acierto: la palabra debe oírse limpia.
    const { item } = result;
    if (item) window.setTimeout(() => speak(item.en), WORD_AFTER_SFX_MS);

    canAdvance.current = true;
    setFeedback({ ...result, praise: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
  };

  const advance = () => {
    if (!canAdvance.current) return;
    canAdvance.current = false;
    sfx.tap();
    setFeedback(null);

    if (isLastExercise) {
      const items = [...new Map(lesson.flatMap(itemsOf).map((item) => [item.id, item])).values()];
      const clean = cleanFirstTries.current;
      const stars = starsFor(clean, lesson.length);
      const firstTryItems = items.filter((item) => !missedItems.current.has(item.id)).map((item) => item.id);
      recordLesson(progressKey, stars, firstTryItems);
      setOutcome({ stars, clean, total: lesson.length, items });
      return;
    }
    setPosition((current) => current + 1);
  };

  if (outcome) {
    return <ResultsScreen {...outcome} renderThumb={renderThumb} onRestart={onRestart} onExit={onExit} />;
  }

  return (
    <div className="screen lesson" style={{ '--accent': accent.color, '--accent-edge': accent.edge } as CSSProperties}>
      <header className="bar lesson__bar">
        <button className="icon-btn" aria-label="Salir de la lección" onClick={() => setLeaving(true)}>
          <CloseIcon />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={lesson.length} aria-valuenow={passedCount}>
          <motion.div
            className="progress__fill"
            initial={{ width: 0 }}
            animate={{ width: `${(passedCount / lesson.length) * 100}%` }}
            transition={{ type: 'spring', bounce: 0.35 }}
          />
        </div>
        <motion.div key={streak} className="streak" animate={streak > 1 ? { scale: [1, 1.5, 1] } : undefined} aria-label={`${streak} seguidas`}>
          <StarIcon filled={streak > 0} /> {streak}
        </motion.div>
      </header>

      <div className={`lesson__body ${feedback ? 'has-feedback' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={exercise.key}
            className="lesson__slide"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {renderExercise(exercise, handleDone)}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback ${feedback.passed ? 'feedback--good' : 'feedback--oops'}`}
            role="status"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 340 }}
          >
            <div className="feedback__row">
              <motion.div
                className="feedback__frog"
                animate={feedback.passed ? { y: [0, -16, 0], rotate: [0, -6, 6, 0] } : { rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Mascot mood={feedback.passed ? 'cheer' : 'oops'} />
              </motion.div>
              <div className="feedback__text">
                <strong>{feedback.passed ? feedback.praise : oopsTitle}</strong>
                {feedback.item ? (
                  <span>
                    <b>{renderItemText(feedback.item)}</b> · {feedback.item.es}
                  </span>
                ) : (
                  <span>{feedback.summary}</span>
                )}
              </div>
              {feedback.item && (
                <button
                  className="icon-btn feedback__speak"
                  aria-label="Oír otra vez"
                  onClick={() => speak(feedback.item!.en)}
                >
                  <SpeakerIcon />
                </button>
              )}
            </div>
            <button className={`btn btn--wide ${feedback.passed ? '' : 'btn--coral'}`} onClick={advance}>
              Seguir
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={leaving} onClose={() => setLeaving(false)} label="Salir de la lección">
        <div className="leave">
          <div className="leave__frog">
            <Mascot mood="oops" />
          </div>
          <h2>¿Quieres salir?</h2>
          <p>Si sales ahora, esta lección no se guarda.</p>
          <button className="btn btn--wide" onClick={() => setLeaving(false)}>
            Seguir jugando
          </button>
          <button className="btn btn--white btn--wide" onClick={onExit}>
            Salir
          </button>
        </div>
      </Sheet>
    </div>
  );
}

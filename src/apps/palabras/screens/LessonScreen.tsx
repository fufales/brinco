import { useMemo, useRef, useState, type CSSProperties } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'wouter';
import { recordLesson } from '../../../shared/progress';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { Mascot } from '../../../shared/ui/Mascot';
import { Sheet } from '../../../shared/ui/Sheet';
import { CloseIcon, SpeakerIcon, StarIcon } from '../../../shared/ui/icons';
import { ChoiceExercise } from '../exercises/ChoiceExercise';
import { MatchExercise } from '../exercises/MatchExercise';
import { SpellExercise } from '../exercises/SpellExercise';
import type { ExerciseResult } from '../exercises/types';
import { buildLesson, exerciseWords, retryExercise, starsFor, type Exercise } from '../lesson';
import { WordText } from '../WordText';
import { scopeColors, type Scope, type Word } from '../words';
import { ResultsScreen } from './ResultsScreen';

const WORD_AFTER_SFX_MS = 280;
const PRAISE = ['¡Muy bien!', '¡Genial!', '¡Excelente!', '¡Así se hace!', '¡Súper!', '¡Increíble!'];

interface Outcome {
  stars: number;
  clean: number;
  total: number;
  words: Word[];
}

export function LessonScreen({ scope }: { scope: Scope }) {
  const [round, setRound] = useState(0);
  return <LessonRun key={round} scope={scope} onRestart={() => setRound((count) => count + 1)} />;
}

function LessonRun({ scope, onRestart }: { scope: Scope; onRestart: () => void }) {
  const [, navigate] = useLocation();
  const { color, edge } = scopeColors(scope);
  const lesson = useMemo(() => buildLesson(scope), [scope]);

  const [queue, setQueue] = useState<Exercise[]>(lesson);
  const [position, setPosition] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<(ExerciseResult & { praise: string }) | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Cuenta solo el primer intento de cada ejercicio; lo repetido no da estrellas.
  const cleanFirstTries = useRef(0);
  const missedWords = useRef(new Set<string>());
  const attempts = useRef(0);

  const exercise = queue[position];
  const isLastExercise = position === queue.length - 1;

  const handleDone = (result: ExerciseResult) => {
    const isRetry = exercise.key.includes('-retry');
    if (result.clean && !isRetry) cleanFirstTries.current += 1;
    result.missedIds.forEach((id) => missedWords.current.add(id));

    if (result.passed) {
      setPassedCount((count) => count + 1);
      setStreak((count) => (result.clean ? count + 1 : 0));
      sfx.correct();
      void confetti({ particleCount: 36, spread: 62, origin: { y: 0.72 }, disableForReducedMotion: true });
    } else {
      setStreak(0);
      sfx.oops();
      attempts.current += 1;
      setQueue((current) => [...current, retryExercise(exercise, attempts.current)]);
    }

    // Primero termina el sonido de acierto: la palabra debe oírse limpia.
    const { word } = result;
    if (word) window.setTimeout(() => speak(word.en), WORD_AFTER_SFX_MS);

    setFeedback({ ...result, praise: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
  };

  const advance = () => {
    sfx.tap();
    setFeedback(null);

    if (isLastExercise) {
      const words = [...new Map(lesson.flatMap(exerciseWords).map((word) => [word.id, word])).values()];
      const clean = cleanFirstTries.current;
      const stars = starsFor(clean, lesson.length);
      const firstTryWords = words.filter((word) => !missedWords.current.has(word.id)).map((word) => word.id);
      recordLesson(scope, stars, firstTryWords);
      setOutcome({ stars, clean, total: lesson.length, words });
      return;
    }
    setPosition((current) => current + 1);
  };

  if (outcome) {
    return (
      <ResultsScreen
        {...outcome}
        onRestart={onRestart}
        onExit={() => navigate('/')}
      />
    );
  }

  return (
    <div className="screen lesson" style={{ '--accent': color, '--accent-edge': edge } as CSSProperties}>
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
            {exercise.kind === 'match' ? (
              <MatchExercise exercise={exercise} onDone={handleDone} />
            ) : exercise.kind === 'spell' ? (
              <SpellExercise exercise={exercise} onDone={handleDone} />
            ) : (
              <ChoiceExercise exercise={exercise} onDone={handleDone} />
            )}
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
                <strong>{feedback.passed ? feedback.praise : '¡Casi! Es esta:'}</strong>
                {feedback.word ? (
                  <span>
                    <b>
                      <WordText text={feedback.word.en} />
                    </b>{' '}
                    · {feedback.word.es}
                  </span>
                ) : (
                  <span>¡Todas las parejas!</span>
                )}
              </div>
              {feedback.word && (
                <button
                  className="icon-btn feedback__speak"
                  aria-label="Oír la palabra otra vez"
                  onClick={() => speak(feedback.word!.en)}
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
          <button className="btn btn--white btn--wide" onClick={() => navigate('/')}>
            Salir
          </button>
        </div>
      </Sheet>
    </div>
  );
}

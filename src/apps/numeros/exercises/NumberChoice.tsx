import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { SpeakerIcon } from '../../../shared/ui/icons';
import type { NumberExercise } from '../lesson';
import type { NumberItem } from '../numbers';
import { NumberTile } from '../parts';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'listen' | 'read' }>;
  onDone: (result: ExerciseResult) => void;
};

export function NumberChoice({ exercise, onDone }: Props) {
  const { kind, item, options } = exercise;
  const [picked, setPicked] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (kind !== 'listen') return;
    const timer = window.setTimeout(() => {
      speak(item.en);
      setPulse((count) => count + 1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [kind, item.en]);

  const pick = (option: NumberItem) => {
    if (picked) return;
    setPicked(option.id);
    const clean = option.id === item.id;
    onDone({ clean, passed: clean, item, missedIds: clean ? [] : [item.id] });
  };

  return (
    <div className="exercise">
      <h2 className="exercise__title">{kind === 'listen' ? 'Escucha y toca el número' : 'Lee y toca el número'}</h2>

      {kind === 'listen' ? (
        <motion.button
          key={pulse}
          className="speaker"
          aria-label="Oír el número otra vez"
          animate={pulse > 0 ? { scale: [1, 1.14, 1] } : undefined}
          transition={{ duration: 0.4 }}
          onClick={() => {
            speak(item.en);
            setPulse((count) => count + 1);
          }}
        >
          <SpeakerIcon />
        </motion.button>
      ) : (
        <p className="prompt-word" lang="en">
          {item.en}
        </p>
      )}

      <div className="choices">
        {options.map((option) => {
          const isAnswer = option.id === item.id;
          const isPicked = option.id === picked;
          const state = !picked ? '' : isAnswer ? 'is-right' : isPicked ? 'is-wrong' : 'is-faded';
          return (
            <motion.button
              key={option.id}
              className={`choice ${state}`}
              aria-label={`Opción ${option.value}`}
              disabled={picked !== null}
              whileTap={picked ? undefined : { scale: 0.94 }}
              animate={state === 'is-wrong' ? { x: [0, -10, 10, -7, 7, 0] } : state === 'is-right' ? { scale: [1, 1.08, 1] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onPointerDown={() => {
                if (!picked) sfx.tap();
              }}
              onClick={() => pick(option)}
            >
              <NumberTile value={option.value} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

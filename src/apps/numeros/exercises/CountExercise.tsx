import { useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import type { NumberExercise } from '../lesson';
import { wordFor, type NumberItem } from '../numbers';
import { NumberTile } from '../parts';
import { TenFrames } from '../TenFrames';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'count' }>;
  onDone: (result: ExerciseResult) => void;
};

export function CountExercise({ exercise, onDone }: Props) {
  const { item, options } = exercise;
  const extras = item.value - 10;
  const [counted, setCounted] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const countMore = () => {
    const next = Math.min(counted + 1, extras);
    setCounted(next);
    sfx.pop();
    speak(wordFor(10 + next));
  };

  const pick = (option: NumberItem) => {
    if (picked) return;
    setPicked(option.id);
    const clean = option.id === item.id;
    onDone({ clean, passed: clean, item, missedIds: clean ? [] : [item.id] });
  };

  return (
    <div className="exercise exercise--count">
      <h2 className="exercise__title">¿Cuántos hay?</h2>
      <p className="exercise__hint">Toca el marco de abajo para contar</p>

      <TenFrames
        value={item.value}
        counted={counted}
        onTapTen={() => {
          sfx.pop();
          speak('ten');
        }}
        onTapMore={countMore}
      />

      <div className="num-options">
        {options.map((option) => {
          const isAnswer = option.id === item.id;
          const isPicked = option.id === picked;
          const state = !picked ? '' : isAnswer ? 'is-right' : isPicked ? 'is-wrong' : 'is-faded';
          return (
            <motion.button
              key={option.id}
              className={`choice num-option ${state}`}
              aria-label={`Opción ${option.value}`}
              disabled={picked !== null}
              whileTap={picked ? undefined : { scale: 0.94 }}
              animate={state === 'is-wrong' ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
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

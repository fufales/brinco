import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { SpeakerIcon } from '../../../shared/ui/icons';
import type { NumberExercise } from '../lesson';
import { wordFor } from '../numbers';
import { colorOf } from '../parts';
import { TenFrames } from '../TenFrames';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'build' }>;
  onDone: (result: ExerciseResult) => void;
};

const SHAKE = { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } };

function equation(count: number): string {
  if (count === 0) return 'Empieza con +10';
  return count > 10 ? `10 + ${count - 10} = ${count}` : String(count);
}

export function BuildExercise({ exercise, onDone }: Props) {
  const { item } = exercise;
  const [count, setCount] = useState(0);
  const [staggerFrom, setStaggerFrom] = useState(0);
  const [tooMany, setTooMany] = useState(0);
  const missed = useRef(false);
  const done = count === item.value;

  useEffect(() => {
    const timer = window.setTimeout(() => speak(item.en), 350);
    return () => window.clearTimeout(timer);
  }, [item.en]);

  const add = (amount: number) => {
    if (done) return;
    const next = count + amount;

    // Solo +10 se puede pasar: tiembla, no se suma y vuelve a decir la meta.
    if (next > item.value) {
      missed.current = true;
      sfx.oops();
      setTooMany((times) => times + 1);
      speak(item.en);
      return;
    }

    sfx.pop();
    setStaggerFrom(count);
    setCount(next);
    if (next === item.value) {
      onDone({ clean: !missed.current, passed: true, item, missedIds: missed.current ? [item.id] : [] });
    } else {
      speak(wordFor(next));
    }
  };

  return (
    <div className="exercise exercise--build">
      <h2 className="exercise__title">Construye el número</h2>

      <div className="build__goal">
        <button className="speaker speaker--inline" aria-label="Oír el número otra vez" onClick={() => speak(item.en)}>
          <SpeakerIcon />
        </button>
        <span className="build__target" style={{ color: colorOf(item.value) }}>
          {item.value}
        </span>
        <span className="build__word" lang="en">
          {item.en}
        </span>
      </div>

      <TenFrames value={count} staggerFrom={staggerFrom} />

      <p className="build__equation">{equation(count)}</p>

      {!done && (
        <div className="build__buttons">
          <motion.button
            key={tooMany}
            className="btn btn--sky build__add"
            aria-label="Sumar diez"
            animate={tooMany > 0 ? SHAKE : undefined}
            onClick={() => add(10)}
          >
            +10
          </motion.button>
          <button className="btn btn--coral build__add" aria-label="Sumar uno" onClick={() => add(1)}>
            +1
          </button>
        </div>
      )}
    </div>
  );
}

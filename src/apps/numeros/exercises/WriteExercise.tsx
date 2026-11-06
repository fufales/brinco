import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { SpeakerIcon } from '../../../shared/ui/icons';
import type { NumberExercise } from '../lesson';
import { HoppingFrog, LilyPad } from '../parts';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'write' }>;
  onDone: (result: ExerciseResult) => void;
};

/** Dónde está cada hoja y dónde pisa la rana, en % del agua. */
const PAD_X = [29, 71];
const FROG_ON_PAD_Y = 38;
const FROG_START = { x: 9, y: 96 };
const LANDING_MS = 420;
const SHAKE = { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } };

export function WriteExercise({ exercise, onDone }: Props) {
  const { item, tiles } = exercise;
  const digits = String(item.value).split('');
  const [filled, setFilled] = useState(0);
  const [used, setUsed] = useState<number[]>([]);
  const [hops, setHops] = useState(0);
  const [wrong, setWrong] = useState<{ index: number; count: number } | null>(null);
  const missed = useRef(false);
  const landing = useRef(0);
  const done = filled === digits.length;

  useEffect(() => {
    const timer = window.setTimeout(() => speak(item.en), 350);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(landing.current);
    };
  }, [item.en]);

  const tap = (digit: string, index: number) => {
    if (done || used.includes(index)) return;

    // Cada error se corrige ahí mismo: la cifra tiembla y no se coloca.
    if (digit !== digits[filled]) {
      missed.current = true;
      sfx.oops();
      setWrong((current) => ({ index, count: (current?.count ?? 0) + 1 }));
      return;
    }

    sfx.hop();
    const nextFilled = filled + 1;
    setFilled(nextFilled);
    setUsed((current) => [...current, index]);
    setHops((count) => count + 1);
    if (nextFilled === digits.length) {
      window.clearTimeout(landing.current);
      landing.current = window.setTimeout(() => {
        onDone({ clean: !missed.current, passed: true, item, missedIds: missed.current ? [item.id] : [] });
      }, LANDING_MS);
    }
  };

  return (
    <div className="exercise exercise--write">
      <h2 className="exercise__title">Escribe el número</h2>

      <div className="write__goal">
        <button className="speaker speaker--inline" aria-label="Oír el número otra vez" onClick={() => speak(item.en)}>
          <SpeakerIcon />
        </button>
        <span className="write__word" lang="en">
          {item.en}
        </span>
      </div>

      <div className="water write__pads">
        {digits.map((digit, index) => (
          <span key={index} className="write__pad" style={{ left: `${PAD_X[index]}%` }}>
            <LilyPad done={index < filled} />
            {index < filled ? (
              <motion.span
                className="write__digit"
                initial={{ scale: 0.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                {digit}
              </motion.span>
            ) : (
              <span className={`write__empty ${index === filled ? 'is-next' : ''}`} />
            )}
          </span>
        ))}
        <HoppingFrog
          x={filled === 0 ? FROG_START.x : PAD_X[filled - 1]}
          y={filled === 0 ? FROG_START.y : FROG_ON_PAD_Y}
          hops={hops}
        />
      </div>

      {!done && (
        <div className="spell__tiles">
          {tiles.map((digit, index) => {
            const isUsed = used.includes(index);
            const isWrong = wrong?.index === index;
            return (
              <motion.button
                key={isWrong ? `${index}-${wrong.count}` : index}
                className={`letter-tile ${isUsed ? 'is-used' : ''}`}
                disabled={isUsed}
                aria-label={`Cifra ${digit}`}
                animate={isWrong ? SHAKE : undefined}
                onClick={() => tap(digit, index)}
              >
                {digit}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { SpeakerIcon } from '../../../shared/ui/icons';
import { WordArt } from '../illustrations';
import type { Exercise } from '../lesson';
import type { ExerciseResult } from '../../../shared/lesson/types';

type Props = {
  exercise: Extract<Exercise, { kind: 'spell' }>;
  onDone: (result: ExerciseResult) => void;
};

export function SpellExercise({ exercise, onDone }: Props) {
  const { word, tiles } = exercise;
  const [filled, setFilled] = useState(0);
  const [used, setUsed] = useState<number[]>([]);
  const [shake, setShake] = useState<{ index: number; count: number } | null>(null);
  const missed = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => speak(word.en), 350);
    return () => window.clearTimeout(timer);
  }, [word.en]);

  const tap = (letter: string, index: number) => {
    if (filled >= word.en.length || used.includes(index)) return;

    // Cada error se corrige ahí mismo: la letra tiembla y no se coloca.
    if (letter !== word.en[filled]) {
      missed.current = true;
      sfx.oops();
      setShake((current) => ({ index, count: (current?.count ?? 0) + 1 }));
      return;
    }

    sfx.pop();
    const nextFilled = filled + 1;
    setFilled(nextFilled);
    setUsed((current) => [...current, index]);
    if (nextFilled === word.en.length) {
      onDone({
        clean: !missed.current,
        passed: true,
        item: word,
        missedIds: missed.current ? [word.id] : [],
      });
    }
  };

  return (
    <div className="exercise exercise--spell">
      <h2 className="exercise__title">Arma la palabra</h2>

      <div className="spell__art">
        <WordArt id={word.id} play={filled === word.en.length ? 1 : 0} />
        <button className="speaker speaker--small" aria-label="Oír la palabra otra vez" onClick={() => speak(word.en)}>
          <SpeakerIcon />
        </button>
      </div>

      <div className="spell__slots" lang="en" style={{ '--count': word.en.length } as CSSProperties}>
        {word.en.split('').map((letter, index) => (
          <span key={index} className={`slot ${index < filled ? 'is-filled' : ''} ${index === filled ? 'is-next' : ''}`}>
            {index < filled && (
              <motion.span initial={{ scale: 0.3, y: 18 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.6 }}>
                {letter}
              </motion.span>
            )}
          </span>
        ))}
      </div>

      <div className="spell__tiles" lang="en">
        {tiles.map((letter, index) => {
          const isUsed = used.includes(index);
          const isShaking = shake?.index === index;
          return (
            <motion.button
              key={isShaking ? `${index}-${shake.count}` : index}
              className={`letter-tile ${isUsed ? 'is-used' : ''}`}
              disabled={isUsed}
              aria-label={`Letra ${letter}`}
              animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
              transition={{ duration: 0.35 }}
              onClick={() => tap(letter, index)}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

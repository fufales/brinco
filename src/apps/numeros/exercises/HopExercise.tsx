import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import type { NumberExercise } from '../lesson';
import { HoppingFrog, LilyPad, NumberTile } from '../parts';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'hop' }>;
  onDone: (result: ExerciseResult) => void;
};

/** Posición de cada hoja, en % del tablero; la rana sale de abajo. */
const SPOTS = [
  { x: 20, y: 74 },
  { x: 74, y: 70 },
  { x: 46, y: 46 },
  { x: 16, y: 26 },
  { x: 80, y: 30 },
  { x: 48, y: 12 },
];
const START = { x: 50, y: 96 };
const LANDING_MS = 480;
const SHAKE = { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } };

export function HopExercise({ exercise, onDone }: Props) {
  const { items } = exercise;
  const ordered = useMemo(() => [...items].sort((a, b) => a.value - b.value), [items]);
  const [reached, setReached] = useState(0);
  const [frogAt, setFrogAt] = useState(START);
  const [hops, setHops] = useState(0);
  const [wrong, setWrong] = useState<{ id: string; count: number } | null>(null);
  const missed = useRef(new Set<string>());
  const landing = useRef(0);

  useEffect(() => () => window.clearTimeout(landing.current), []);

  const tap = (index: number) => {
    const item = items[index];
    const nextItem = ordered[reached];
    if (!nextItem || item.value < nextItem.value) return;

    if (item.id !== nextItem.id) {
      missed.current.add(item.id);
      sfx.oops();
      setWrong((current) => ({ id: item.id, count: (current?.count ?? 0) + 1 }));
      return;
    }

    sfx.hop();
    speak(item.en);
    setFrogAt(SPOTS[index]);
    setHops((count) => count + 1);
    const nextReached = reached + 1;
    setReached(nextReached);
    if (nextReached === items.length) {
      window.clearTimeout(landing.current);
      landing.current = window.setTimeout(() => {
        onDone({
          clean: missed.current.size === 0,
          passed: true,
          summary: '¡La rana llegó a la meta!',
          missedIds: [...missed.current],
        });
      }, LANDING_MS);
    }
  };

  return (
    <div className="exercise">
      <h2 className="exercise__title">Toca de menor a mayor</h2>

      <div className="hop__slots" aria-hidden="true">
        {ordered.map((item, index) => (
          <span key={item.id} className={`hop__slot ${index < reached ? 'is-filled' : ''} ${index === reached ? 'is-next' : ''}`}>
            {index < reached && (
              <motion.span initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}>
                {item.value}
              </motion.span>
            )}
          </span>
        ))}
      </div>

      <div className="water hop__board">
        {items.map((item, index) => {
          const done = ordered.findIndex((other) => other.id === item.id) < reached;
          const isWrong = wrong?.id === item.id;
          return (
            <span key={item.id} className="hop__spot" style={{ left: `${SPOTS[index].x}%`, top: `${SPOTS[index].y}%` }}>
              <motion.button
                key={isWrong ? wrong.count : 0}
                className={`hop__pad ${done ? 'is-done' : ''}`}
                aria-label={`Número ${item.value}`}
                disabled={done}
                animate={isWrong ? SHAKE : undefined}
                whileTap={done ? undefined : { scale: 0.92 }}
                onClick={() => tap(index)}
              >
                <LilyPad done={done} />
                <NumberTile value={item.value} />
              </motion.button>
            </span>
          );
        })}
        <HoppingFrog x={frogAt.x} y={frogAt.y} hops={hops} />
      </div>
    </div>
  );
}

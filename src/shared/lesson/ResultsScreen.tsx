import { useEffect, useState, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { sfx } from '../sfx';
import { speak } from '../speech';
import { Mascot } from '../ui/Mascot';
import { StarIcon } from '../ui/icons';
import type { LessonItem } from './types';

const STAR_DELAY_MS = 420;

const TITLES: Record<number, string> = {
  1: '¡Bien hecho!',
  2: '¡Muy bien!',
  3: '¡Perfecto!',
};

export function ResultsScreen({
  stars,
  clean,
  total,
  items,
  renderThumb,
  onRestart,
  onExit,
}: {
  stars: number;
  clean: number;
  total: number;
  items: LessonItem[];
  renderThumb: (item: LessonItem, play: number) => ReactNode;
  onRestart: () => void;
  onExit: () => void;
}) {
  const [played, setPlayed] = useState<Record<string, number>>({});

  useEffect(() => {
    const timers = [
      ...Array.from({ length: stars }, (_, index) =>
        window.setTimeout(() => sfx.star(index), 300 + index * STAR_DELAY_MS),
      ),
      window.setTimeout(() => {
        sfx.win();
        void confetti({ particleCount: 140, spread: 95, origin: { y: 0.45 }, disableForReducedMotion: true });
      }, 300 + stars * STAR_DELAY_MS),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stars]);

  return (
    <div className="screen results">
      <div className="scroll results__body">
        <motion.div
          className="results__frog"
          animate={{ y: [0, -26, 0], scaleY: [1, 1.06, 0.92, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.6 }}
        >
          <Mascot mood="cheer" />
        </motion.div>

        <h1>{TITLES[stars]}</h1>

        <div className="results__stars" aria-label={`${stars} de 3 estrellas`}>
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              initial={{ scale: index < stars ? 0 : 1, rotate: index < stars ? -90 : 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index < stars ? 0.3 + (index * STAR_DELAY_MS) / 1000 : 0, type: 'spring', bounce: 0.6 }}
            >
              <StarIcon filled={index < stars} />
            </motion.span>
          ))}
        </div>

        <p className="results__score">
          {clean} de {total} a la primera
        </p>

        <p className="results__hint">Toca para oír otra vez</p>
        <div className="results__words">
          {items.map((item) => (
            <button
              key={item.id}
              className="results__word"
              lang="en"
              onClick={() => {
                speak(item.en);
                setPlayed((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
              }}
            >
              <span className="results__word-art">{renderThumb(item, played[item.id] ?? 0)}</span>
              {item.en}
            </button>
          ))}
        </div>
      </div>

      <div className="results__actions">
        <button className="btn btn--wide" onClick={onExit}>
          Seguir
        </button>
        <button className="btn btn--white btn--wide" onClick={onRestart}>
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}

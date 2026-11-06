import { useMemo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { sfx } from '../sfx';
import { speak } from '../speech';
import type { ExerciseResult, LessonItem } from './types';
import { shuffle } from './utils';

const SHAKE = { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } };

interface Selection {
  side: 'left' | 'right';
  id: string;
}

/** Une cada elemento de la izquierda (imagen, número…) con su palabra en inglés. */
export function MatchBoard({
  title,
  items,
  renderLeft,
  leftLabel,
  onDone,
}: {
  title: string;
  items: LessonItem[];
  renderLeft: (item: LessonItem, done: boolean) => ReactNode;
  leftLabel: (item: LessonItem) => string;
  onDone: (result: ExerciseResult) => void;
}) {
  const [leftOrder, rightOrder] = useMemo(() => [shuffle(items), shuffle(items)], [items]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{ left: string; right: string; count: number } | null>(null);
  const missed = useRef(new Set<string>());

  const say = (id: string) => speak(items.find((item) => item.id === id)!.en);

  const choose = (side: Selection['side'], id: string) => {
    if (matched.includes(id)) return;

    if (!selected || selected.side === side) {
      sfx.tap();
      setSelected({ side, id });
      // Tocar la izquierda dice la palabra: así también se practica oyendo.
      if (side === 'left') say(id);
      return;
    }

    const leftId = side === 'left' ? id : selected.id;
    const rightId = side === 'right' ? id : selected.id;
    setSelected(null);

    if (leftId !== rightId) {
      sfx.oops();
      missed.current.add(leftId);
      missed.current.add(rightId);
      setWrong((current) => ({ left: leftId, right: rightId, count: (current?.count ?? 0) + 1 }));
      return;
    }

    sfx.pop();
    say(leftId);
    const nextMatched = [...matched, leftId];
    setMatched(nextMatched);
    if (nextMatched.length === items.length) {
      onDone({
        clean: missed.current.size === 0,
        passed: true,
        summary: '¡Todas las parejas!',
        missedIds: [...missed.current],
      });
    }
  };

  const attempt = wrong?.count ?? 0;

  return (
    <div className="exercise">
      <h2 className="exercise__title">{title}</h2>
      <div className="match" style={{ gridTemplateRows: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {leftOrder.map((item, row) => {
          const done = matched.includes(item.id);
          const right = rightOrder[row];
          const rightDone = matched.includes(right.id);
          return [
            <motion.button
              key={`left-${item.id}-${wrong?.left === item.id ? attempt : 0}`}
              className={`match__cell ${done ? 'is-done' : ''} ${selected?.side === 'left' && selected.id === item.id ? 'is-selected' : ''}`}
              aria-label={leftLabel(item)}
              disabled={done}
              whileTap={{ scale: 0.95 }}
              animate={wrong?.left === item.id ? SHAKE : undefined}
              onClick={() => choose('left', item.id)}
            >
              {renderLeft(item, done)}
            </motion.button>,
            <motion.button
              key={`right-${right.id}-${wrong?.right === right.id ? attempt : 0}`}
              className={`match__cell match__cell--text ${rightDone ? 'is-done' : ''} ${selected?.side === 'right' && selected.id === right.id ? 'is-selected' : ''}`}
              lang="en"
              disabled={rightDone}
              whileTap={{ scale: 0.95 }}
              animate={wrong?.right === right.id ? SHAKE : undefined}
              onClick={() => choose('right', right.id)}
            >
              {right.en}
            </motion.button>,
          ];
        })}
      </div>
    </div>
  );
}

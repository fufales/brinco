import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { WordArt } from '../illustrations';
import { shuffle, type Exercise } from '../lesson';
import type { ExerciseResult } from './types';

type Props = {
  exercise: Extract<Exercise, { kind: 'match' }>;
  onDone: (result: ExerciseResult) => void;
};

const SHAKE = { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } };

interface Selection {
  side: 'art' | 'text';
  id: string;
}

export function MatchExercise({ exercise, onDone }: Props) {
  const { words } = exercise;
  const [artOrder, textOrder] = useMemo(() => [shuffle(words), shuffle(words)], [words]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{ art: string; text: string; count: number } | null>(null);
  const missed = useRef(new Set<string>());

  const choose = (side: Selection['side'], id: string) => {
    if (matched.includes(id)) return;

    if (!selected || selected.side === side) {
      sfx.tap();
      setSelected({ side, id });
      // Tocar la imagen dice la palabra: así también se practica oyendo.
      if (side === 'art') speak(words.find((word) => word.id === id)!.en);
      return;
    }

    const artId = side === 'art' ? id : selected.id;
    const textId = side === 'text' ? id : selected.id;
    setSelected(null);

    if (artId !== textId) {
      sfx.oops();
      missed.current.add(artId);
      missed.current.add(textId);
      setWrong((current) => ({ art: artId, text: textId, count: (current?.count ?? 0) + 1 }));
      return;
    }

    sfx.pop();
    speak(words.find((word) => word.id === artId)!.en);
    const nextMatched = [...matched, artId];
    setMatched(nextMatched);
    if (nextMatched.length === words.length) {
      onDone({
        clean: missed.current.size === 0,
        passed: true,
        missedIds: [...missed.current],
      });
    }
  };

  const attempt = wrong?.count ?? 0;

  return (
    <div className="exercise">
      <h2 className="exercise__title">Une cada imagen con su palabra</h2>
      <div className="match" style={{ gridTemplateRows: `repeat(${words.length}, minmax(0, 1fr))` }}>
        {artOrder.map((word, row) => {
          const done = matched.includes(word.id);
          const text = textOrder[row];
          const textDone = matched.includes(text.id);
          return [
            <motion.button
              key={`art-${word.id}-${wrong?.art === word.id ? attempt : 0}`}
              className={`match__cell ${done ? 'is-done' : ''} ${selected?.side === 'art' && selected.id === word.id ? 'is-selected' : ''}`}
              aria-label={`Imagen de ${word.es}`}
              disabled={done}
              whileTap={{ scale: 0.95 }}
              animate={wrong?.art === word.id ? SHAKE : undefined}
              onClick={() => choose('art', word.id)}
            >
              <WordArt id={word.id} play={done ? 1 : 0} />
            </motion.button>,
            <motion.button
              key={`text-${text.id}-${wrong?.text === text.id ? attempt : 0}`}
              className={`match__cell match__cell--text ${textDone ? 'is-done' : ''} ${selected?.side === 'text' && selected.id === text.id ? 'is-selected' : ''}`}
              lang="en"
              disabled={textDone}
              whileTap={{ scale: 0.95 }}
              animate={wrong?.text === text.id ? SHAKE : undefined}
              onClick={() => choose('text', text.id)}
            >
              {text.en}
            </motion.button>,
          ];
        })}
      </div>
    </div>
  );
}

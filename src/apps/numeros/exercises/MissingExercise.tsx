import { useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { sfx } from '../../../shared/sfx';
import type { NumberExercise } from '../lesson';
import type { NumberItem } from '../numbers';
import { HoppingFrog, LilyPad, NumberTile } from '../parts';

type Props = {
  exercise: Extract<NumberExercise, { kind: 'missing' }>;
  onDone: (result: ExerciseResult) => void;
};

/** La hoja `index` de 5, en % del ancho de la fila. */
function padX(index: number): number {
  return 10 + index * 20;
}

export function MissingExercise({ exercise, onDone }: Props) {
  const { item, line, options } = exercise;
  const blank = line.indexOf(item.value);
  const firstVisible = blank === 0 ? 1 : 0;
  const [picked, setPicked] = useState<string | null>(null);
  const [frogIndex, setFrogIndex] = useState(firstVisible);
  const [hops, setHops] = useState(0);

  const pick = (option: NumberItem) => {
    if (picked) return;
    setPicked(option.id);
    const clean = option.id === item.id;
    if (clean) {
      sfx.hop();
      setFrogIndex(blank);
      setHops((count) => count + 1);
    }
    onDone({ clean, passed: clean, item, missedIds: clean ? [] : [item.id] });
  };

  return (
    <div className="exercise exercise--missing">
      <h2 className="exercise__title">¿Qué número falta?</h2>

      <div className="water line">
        {line.map((value, index) => {
          const isBlank = index === blank;
          return (
            <span key={value} className="line__pad" style={{ left: `${padX(index)}%` }}>
              <LilyPad done={isBlank && picked !== null} />
              {isBlank && !picked ? (
                <span className="line__blank">?</span>
              ) : (
                <motion.span
                  className="line__number"
                  initial={isBlank ? { scale: 0.3 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                >
                  <NumberTile value={value} />
                </motion.span>
              )}
            </span>
          );
        })}
        <HoppingFrog x={padX(frogIndex)} y={34} hops={hops} />
      </div>

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

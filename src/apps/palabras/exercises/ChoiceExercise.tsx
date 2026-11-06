import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { sfx } from '../../../shared/sfx';
import { speak } from '../../../shared/speech';
import { SpeakerIcon } from '../../../shared/ui/icons';
import { WordArt } from '../illustrations';
import type { Exercise } from '../lesson';
import { WordText } from '../WordText';
import type { Word } from '../words';
import type { ExerciseResult } from './types';

type Props = {
  exercise: Extract<Exercise, { kind: 'listen' | 'read' }>;
  onDone: (result: ExerciseResult) => void;
};

export function ChoiceExercise({ exercise, onDone }: Props) {
  const { kind, word, options } = exercise;
  const [picked, setPicked] = useState<string | null>(null);
  const [speakerPulse, setSpeakerPulse] = useState(0);

  useEffect(() => {
    if (kind !== 'listen') return;
    const timer = window.setTimeout(() => {
      speak(word.en);
      setSpeakerPulse((count) => count + 1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [kind, word.en]);

  const pick = (option: Word) => {
    if (picked) return;
    setPicked(option.id);
    const clean = option.id === word.id;
    onDone({ clean, passed: clean, word, missedIds: clean ? [] : [word.id] });
  };

  const replay = () => {
    speak(word.en);
    setSpeakerPulse((count) => count + 1);
  };

  return (
    <div className="exercise">
      <h2 className="exercise__title">{kind === 'listen' ? 'Escucha y toca la imagen' : 'Lee y toca la imagen'}</h2>

      {kind === 'listen' ? (
        <motion.button
          key={speakerPulse}
          className="speaker"
          aria-label="Oír la palabra otra vez"
          animate={speakerPulse > 0 ? { scale: [1, 1.14, 1] } : undefined}
          transition={{ duration: 0.4 }}
          onClick={replay}
        >
          <SpeakerIcon />
        </motion.button>
      ) : (
        <p className="prompt-word">
          <WordText text={word.en} />
        </p>
      )}

      <div className="choices">
        {options.map((option) => {
          const isAnswer = option.id === word.id;
          const isPicked = option.id === picked;
          const state = !picked ? '' : isAnswer ? 'is-right' : isPicked ? 'is-wrong' : 'is-faded';
          return (
            <motion.button
              key={option.id}
              className={`choice ${state}`}
              aria-label={`Opción ${option.es}`}
              disabled={picked !== null}
              whileTap={picked ? undefined : { scale: 0.94 }}
              animate={state === 'is-wrong' ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onPointerDown={() => {
                if (!picked) sfx.tap();
              }}
              onClick={() => pick(option)}
            >
              <WordArt id={option.id} play={picked && isAnswer ? 1 : 0} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

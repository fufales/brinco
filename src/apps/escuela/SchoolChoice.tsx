import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult, LessonItem } from '../../shared/lesson/types';
import { sfx } from '../../shared/sfx';
import { speak } from '../../shared/speech';
import { SpeakerIcon } from '../../shared/ui/icons';
import type { SchoolExercise } from './lesson';
import type { Topic } from './topics';

type Props = {
  topic: Topic;
  exercise: Extract<SchoolExercise, { kind: 'listen' | 'read' }>;
  onDone: (result: ExerciseResult) => void;
};

export function SchoolChoice({ topic, exercise, onDone }: Props) {
  const { kind, item, options } = exercise;
  const { Art } = topic;
  const [picked, setPicked] = useState<string | null>(null);
  const [speakerPulse, setSpeakerPulse] = useState(0);

  useEffect(() => {
    if (kind !== 'listen') return;
    const timer = window.setTimeout(() => {
      speak(item.en);
      setSpeakerPulse((count) => count + 1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [kind, item.en]);

  const pick = (option: LessonItem) => {
    if (picked) return;
    setPicked(option.id);
    const clean = option.id === item.id;
    onDone({ clean, passed: clean, item, missedIds: clean ? [] : [item.id] });
  };

  const replay = () => {
    speak(item.en);
    setSpeakerPulse((count) => count + 1);
  };

  return (
    <div className="exercise">
      <h2 className="exercise__title">
        {kind === 'listen' ? 'Escucha' : 'Lee'} y toca {topic.pickWhat}
      </h2>

      {kind === 'listen' ? (
        <motion.button
          key={speakerPulse}
          className="speaker"
          aria-label="Oír otra vez"
          animate={speakerPulse > 0 ? { scale: [1, 1.14, 1] } : undefined}
          transition={{ duration: 0.4 }}
          onClick={replay}
        >
          <SpeakerIcon />
        </motion.button>
      ) : (
        <p className="prompt-word place-prompt" lang="en">
          {item.en}
        </p>
      )}

      <div className="choices">
        {options.map((option) => {
          const isAnswer = option.id === item.id;
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
              <Art id={option.id} play={picked && isAnswer ? 1 : 0} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ExerciseResult } from '../../shared/lesson/types';
import { sfx } from '../../shared/sfx';
import { speak } from '../../shared/speech';
import { SpeakerIcon } from '../../shared/ui/icons';
import type { DondeExercise } from './lesson';
import { POSITIONS, sentence, type PositionId } from './positions';
import { SceneView } from './Scene';

type Props = {
  exercise: Extract<DondeExercise, { kind: 'listen' | 'read' }>;
  onDone: (result: ExerciseResult) => void;
};

/** La frase con la posición resaltada: "The frog is <next to> the van." */
export function HighlightedSentence({ text, phrase }: { text: string; phrase: string }) {
  const [before, after] = text.split(phrase);
  return (
    <span lang="en">
      {before}
      <mark className="donde-mark">{phrase}</mark>
      {after}
    </span>
  );
}

export function DondeChoice({ exercise, onDone }: Props) {
  const { kind, item, scene, options } = exercise;
  const said = sentence(scene);
  const [picked, setPicked] = useState<PositionId | null>(null);
  const [speakerPulse, setSpeakerPulse] = useState(0);

  useEffect(() => {
    if (kind !== 'listen') return;
    const timer = window.setTimeout(() => {
      speak(said);
      setSpeakerPulse((count) => count + 1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [kind, said]);

  const pick = (option: PositionId) => {
    if (picked) return;
    setPicked(option);
    const clean = option === item.id;
    onDone({ clean, passed: clean, item, missedIds: clean ? [] : [item.id] });
  };

  const replay = () => {
    speak(said);
    setSpeakerPulse((count) => count + 1);
  };

  return (
    <div className="exercise">
      <h2 className="exercise__title">{kind === 'listen' ? 'Escucha y toca dónde está la rana' : 'Lee y toca dónde está la rana'}</h2>

      {kind === 'listen' ? (
        <motion.button
          key={speakerPulse}
          className="speaker"
          aria-label="Oír la frase otra vez"
          animate={speakerPulse > 0 ? { scale: [1, 1.14, 1] } : undefined}
          transition={{ duration: 0.4 }}
          onClick={replay}
        >
          <SpeakerIcon />
        </motion.button>
      ) : (
        <p className="donde-sentence">
          <HighlightedSentence text={said} phrase={item.en} />
        </p>
      )}

      <div className="choices choices--scenes">
        {options.map((option) => {
          const isAnswer = option === item.id;
          const isPicked = option === picked;
          const state = !picked ? '' : isAnswer ? 'is-right' : isPicked ? 'is-wrong' : 'is-faded';
          const label = POSITIONS.find((position) => position.id === option)!.es;
          return (
            <motion.button
              key={option}
              className={`choice choice--scene ${state}`}
              aria-label={`La rana ${label} los objetos`}
              disabled={picked !== null}
              whileTap={picked ? undefined : { scale: 0.96 }}
              animate={state === 'is-wrong' ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onPointerDown={() => {
                if (!picked) sfx.tap();
              }}
              onClick={() => pick(option)}
            >
              <SceneView scene={{ ...scene, position: option }} play={picked && isAnswer ? 1 : 0} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

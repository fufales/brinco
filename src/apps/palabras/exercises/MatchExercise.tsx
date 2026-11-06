import { MatchBoard } from '../../../shared/lesson/MatchBoard';
import type { ExerciseResult } from '../../../shared/lesson/types';
import { WordArt } from '../illustrations';
import type { Exercise } from '../lesson';

type Props = {
  exercise: Extract<Exercise, { kind: 'match' }>;
  onDone: (result: ExerciseResult) => void;
};

export function MatchExercise({ exercise, onDone }: Props) {
  return (
    <MatchBoard
      title="Une cada imagen con su palabra"
      items={exercise.words}
      renderLeft={(word, done) => <WordArt id={word.id} play={done ? 1 : 0} />}
      leftLabel={(word) => `Imagen de ${word.es}`}
      onDone={onDone}
    />
  );
}

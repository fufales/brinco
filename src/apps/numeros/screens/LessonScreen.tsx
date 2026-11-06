import { useLocation } from 'wouter';
import { LessonRunner } from '../../../shared/lesson/LessonRunner';
import { MatchBoard } from '../../../shared/lesson/MatchBoard';
import { CountExercise } from '../exercises/CountExercise';
import { HopExercise } from '../exercises/HopExercise';
import { MissingExercise } from '../exercises/MissingExercise';
import { NumberChoice } from '../exercises/NumberChoice';
import { WriteExercise } from '../exercises/WriteExercise';
import { buildNumberLesson, exerciseNumbers, retryNumberExercise } from '../lesson';
import { progressKey, scopeInfo, type NumberScope } from '../numbers';
import { NumberTile, numberOf } from '../parts';

export function LessonScreen({ scope }: { scope: NumberScope }) {
  const [, navigate] = useLocation();
  return (
    <LessonRunner
      progressKey={progressKey(scope)}
      accent={scopeInfo(scope)}
      build={() => buildNumberLesson(scope)}
      itemsOf={exerciseNumbers}
      retry={retryNumberExercise}
      oopsTitle="¡Casi! Es este:"
      renderExercise={(exercise, onDone) => {
        switch (exercise.kind) {
          case 'listen':
          case 'read':
            return <NumberChoice exercise={exercise} onDone={onDone} />;
          case 'count':
            return <CountExercise exercise={exercise} onDone={onDone} />;
          case 'write':
            return <WriteExercise exercise={exercise} onDone={onDone} />;
          case 'missing':
            return <MissingExercise exercise={exercise} onDone={onDone} />;
          case 'hop':
            return <HopExercise exercise={exercise} onDone={onDone} />;
          case 'match':
            return (
              <MatchBoard
                title="Une cada número con su palabra"
                items={exercise.items}
                renderLeft={(item) => <NumberTile value={numberOf(item).value} />}
                leftLabel={(item) => `Número ${numberOf(item).value}`}
                onDone={onDone}
              />
            );
        }
      }}
      renderItemText={(item) => (
        <span lang="en">
          {numberOf(item).value} {item.en}
        </span>
      )}
      renderThumb={(item) => <NumberTile value={numberOf(item).value} />}
      onExit={() => navigate('/')}
    />
  );
}

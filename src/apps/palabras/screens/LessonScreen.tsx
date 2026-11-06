import { useLocation } from 'wouter';
import { LessonRunner } from '../../../shared/lesson/LessonRunner';
import { ChoiceExercise } from '../exercises/ChoiceExercise';
import { MatchExercise } from '../exercises/MatchExercise';
import { SpellExercise } from '../exercises/SpellExercise';
import { WordArt } from '../illustrations';
import { buildLesson, exerciseWords, retryExercise } from '../lesson';
import { WordText } from '../WordText';
import { scopeColors, type Scope } from '../words';

export function LessonScreen({ scope }: { scope: Scope }) {
  const [, navigate] = useLocation();
  return (
    <LessonRunner
      progressKey={scope}
      accent={scopeColors(scope)}
      build={() => buildLesson(scope)}
      itemsOf={exerciseWords}
      retry={retryExercise}
      renderExercise={(exercise, onDone) =>
        exercise.kind === 'match' ? (
          <MatchExercise exercise={exercise} onDone={onDone} />
        ) : exercise.kind === 'spell' ? (
          <SpellExercise exercise={exercise} onDone={onDone} />
        ) : (
          <ChoiceExercise exercise={exercise} onDone={onDone} />
        )
      }
      renderItemText={(item) => <WordText text={item.en} />}
      renderThumb={(item, play) => <WordArt id={item.id} play={play} />}
      onExit={() => navigate('/')}
    />
  );
}

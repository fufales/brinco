import { useLocation } from 'wouter';
import { LessonRunner } from '../../../shared/lesson/LessonRunner';
import { MatchBoard } from '../../../shared/lesson/MatchBoard';
import { PlaceArt } from '../illustrations';
import { buildSchoolLesson, exercisePlaces, retrySchoolExercise } from '../lesson';
import { PlaceChoice } from '../PlaceChoice';
import { LESSON_KEY, SCHOOL_COLORS } from '../places';

export function LessonScreen() {
  const [, navigate] = useLocation();
  return (
    <LessonRunner
      progressKey={LESSON_KEY}
      accent={SCHOOL_COLORS}
      build={() => buildSchoolLesson()}
      itemsOf={exercisePlaces}
      retry={retrySchoolExercise}
      oopsTitle="¡Casi! Es este:"
      renderExercise={(exercise, onDone) =>
        exercise.kind === 'match' ? (
          <MatchBoard
            title="Une cada lugar con su nombre"
            items={exercise.places}
            renderLeft={(place, done) => <PlaceArt id={place.id} play={done ? 1 : 0} />}
            leftLabel={(place) => `Dibujo de ${place.es}`}
            onDone={onDone}
          />
        ) : (
          <PlaceChoice exercise={exercise} onDone={onDone} />
        )
      }
      renderItemText={(item) => <span lang="en">{item.en}</span>}
      renderThumb={(item, play) => <PlaceArt id={item.id} play={play} />}
      onExit={() => navigate('/')}
    />
  );
}

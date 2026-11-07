import { useLocation } from 'wouter';
import { LessonRunner } from '../../../shared/lesson/LessonRunner';
import { MatchBoard } from '../../../shared/lesson/MatchBoard';
import { buildSchoolLesson, exerciseItems, retrySchoolExercise } from '../lesson';
import { SchoolChoice } from '../SchoolChoice';
import type { Topic } from '../topics';

export function LessonScreen({ topic }: { topic: Topic }) {
  const [, navigate] = useLocation();
  const { Art } = topic;
  return (
    <LessonRunner
      progressKey={topic.lessonKey}
      accent={topic.colors}
      build={() => buildSchoolLesson(topic.items, topic.readCount)}
      itemsOf={exerciseItems}
      retry={retrySchoolExercise}
      oopsTitle="¡Casi! Es este:"
      renderExercise={(exercise, onDone) =>
        exercise.kind === 'match' ? (
          <MatchBoard
            title={topic.matchTitle}
            items={exercise.items}
            renderLeft={(item, done) => <Art id={item.id} play={done ? 1 : 0} />}
            leftLabel={(item) => `Dibujo de ${item.es}`}
            onDone={onDone}
          />
        ) : (
          <SchoolChoice topic={topic} exercise={exercise} onDone={onDone} />
        )
      }
      renderItemText={(item) => <span lang="en">{item.en}</span>}
      renderThumb={(item, play) => <Art id={item.id} play={play} />}
      onExit={() => navigate('/')}
    />
  );
}

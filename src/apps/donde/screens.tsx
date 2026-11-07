import { useLocation } from 'wouter';
import { DiscoverGrid } from '../../shared/lesson/DiscoverGrid';
import { LessonRunner } from '../../shared/lesson/LessonRunner';
import { MatchBoard } from '../../shared/lesson/MatchBoard';
import { DondeChoice } from './DondeChoice';
import { buildDondeLesson, exercisePositions, retryDondeExercise } from './lesson';
import {
  DISCOVER_EXAMPLES as EXAMPLES,
  discoverSpeech,
  DONDE_COLORS,
  LESSON_KEY,
  POSITIONS,
  type PositionId,
} from './positions';
import { SceneView } from './Scene';

/** En Descubre la voz dice la palabra y luego la frase; la tarjeta muestra solo la palabra. */
const DISCOVER_ITEMS = POSITIONS.map((item) => ({
  ...item,
  phrase: item.en,
  en: discoverSpeech(item.id as PositionId),
}));

export function DiscoverScreen() {
  const [, navigate] = useLocation();
  return (
    <DiscoverGrid
      title="¿Dónde está la rana?"
      hint="Toca una tarjeta y mira a dónde brinca"
      items={DISCOVER_ITEMS}
      accent={DONDE_COLORS}
      renderArt={(item, plays) => <SceneView scene={EXAMPLES[item.id as PositionId]} play={plays} />}
      renderWord={(item) => <span lang="en">{item.phrase}</span>}
      onBack={() => navigate('/')}
      onPlay={() => navigate('/leccion')}
    />
  );
}

export function LessonScreen() {
  const [, navigate] = useLocation();
  return (
    <LessonRunner
      progressKey={LESSON_KEY}
      accent={DONDE_COLORS}
      build={() => buildDondeLesson()}
      itemsOf={exercisePositions}
      retry={retryDondeExercise}
      oopsTitle="¡Casi! Es así:"
      renderExercise={(exercise, onDone) =>
        exercise.kind === 'match' ? (
          <MatchBoard
            title="Une cada escena con su frase"
            items={exercise.items}
            renderLeft={(item, done) => (
              <SceneView scene={{ objects: exercise.objects, position: item.id as PositionId, ref: exercise.ref }} play={done ? 1 : 0} />
            )}
            leftLabel={(item) => `Escena: la rana ${item.es} los objetos`}
            onDone={onDone}
          />
        ) : (
          <DondeChoice exercise={exercise} onDone={onDone} />
        )
      }
      renderItemText={(item) => <span lang="en">{item.en}</span>}
      renderThumb={(item, play) => <SceneView scene={EXAMPLES[item.id as PositionId]} play={play} />}
      onExit={() => navigate('/')}
    />
  );
}

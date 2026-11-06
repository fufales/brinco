import { useLocation } from 'wouter';
import { DiscoverGrid } from '../../../shared/lesson/DiscoverGrid';
import { WordArt } from '../illustrations';
import { WordText } from '../WordText';
import { ALL_ID, scopeColors, scopeTitle, wordsIn, type Scope } from '../words';
import { TabBar } from './TabBar';

export function DiscoverScreen({ scope }: { scope: Scope }) {
  const [, navigate] = useLocation();
  return (
    <DiscoverGrid
      title={scopeTitle(scope)}
      hint="Toca una imagen para oír la palabra"
      items={wordsIn(scope)}
      accent={scopeColors(scope)}
      renderArt={(word, plays) => <WordArt id={word.id} play={plays} />}
      renderWord={(word) => <WordText text={word.en} />}
      onBack={() => navigate('/')}
      onPlay={() => navigate(`/${scope}/leccion`)}
      footer={scope === ALL_ID ? <TabBar active="words" /> : undefined}
    />
  );
}

import { useLocation } from 'wouter';
import { DiscoverGrid } from '../../../shared/lesson/DiscoverGrid';
import { SCHOOL_COLORS } from '../places';
import type { Topic } from '../topics';

export function DiscoverScreen({ topic }: { topic: Topic }) {
  const [, navigate] = useLocation();
  const { Art } = topic;
  return (
    <DiscoverGrid
      title={topic.discoverTitle}
      hint={topic.discoverHint}
      items={topic.items}
      accent={SCHOOL_COLORS}
      renderArt={(item, plays) => <Art id={item.id} play={plays} />}
      renderWord={(item) => <span lang="en">{item.en}</span>}
      onBack={() => navigate('/')}
      onPlay={() => navigate(`${topic.base}/leccion`)}
    />
  );
}

import { useLocation } from 'wouter';
import { DiscoverGrid } from '../../../shared/lesson/DiscoverGrid';
import { PlaceArt } from '../illustrations';
import { PLACES, SCHOOL_COLORS } from '../places';

export function DiscoverScreen() {
  const [, navigate] = useLocation();
  return (
    <DiscoverGrid
      title="Lugares de la escuela"
      hint="Toca un lugar para oír su nombre"
      items={PLACES}
      accent={SCHOOL_COLORS}
      renderArt={(place, plays) => <PlaceArt id={place.id} play={plays} />}
      renderWord={(place) => <span lang="en">{place.en}</span>}
      onBack={() => navigate('/')}
      onPlay={() => navigate('/leccion')}
    />
  );
}

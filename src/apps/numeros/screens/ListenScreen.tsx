import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { DiscoverGrid } from '../../../shared/lesson/DiscoverGrid';
import { TabBar } from '../../../shared/ui/TabBar';
import { numbersIn, scopeInfo, type NumberItem, type NumberScope } from '../numbers';
import { colorOf } from '../parts';
import { TenFrames } from '../TenFrames';
import { NUMBER_TABS } from './tabs';

function NumberCardArt({ item, plays }: { item: NumberItem; plays: number }) {
  return (
    <span className="num-card">
      <motion.span
        key={plays}
        className="num-card__value"
        style={{ color: colorOf(item.value) }}
        animate={plays > 0 ? { scale: [1, 1.25, 0.95, 1.05, 1] } : undefined}
        transition={{ duration: 0.55 }}
      >
        {item.value}
      </motion.span>
      <TenFrames value={item.value} size="mini" staggerFrom={10} replay={plays} />
      <span className="num-card__sum">10 + {item.value - 10}</span>
    </span>
  );
}

export function ListenScreen({ scope }: { scope: NumberScope }) {
  const [, navigate] = useLocation();
  const info = scopeInfo(scope);
  return (
    <DiscoverGrid
      title={scope === 'todos' ? 'Del 11 al 20' : `Del ${info.from} al ${info.to}`}
      hint="Toca un número para oírlo"
      items={numbersIn(scope)}
      accent={info}
      renderArt={(item, plays) => <NumberCardArt item={item} plays={plays} />}
      renderWord={(item) => <span lang="en">{item.en}</span>}
      onBack={() => navigate('/')}
      onPlay={() => navigate(`/${scope}/leccion`)}
      footer={scope === 'todos' ? <TabBar tabs={NUMBER_TABS} active="numbers" /> : undefined}
    />
  );
}

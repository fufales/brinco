import { TabBar as SharedTabBar, type Tab } from '../../../shared/ui/TabBar';
import { GridIcon, MapIcon } from '../../../shared/ui/icons';
import { ALL_ID } from '../words';

const TABS: Tab[] = [
  { id: 'map', label: 'Camino', Icon: MapIcon, path: '/' },
  { id: 'words', label: 'Palabras', Icon: GridIcon, path: `/${ALL_ID}/descubrir` },
];

export function TabBar({ active }: { active: 'map' | 'words' }) {
  return <SharedTabBar tabs={TABS} active={active} />;
}

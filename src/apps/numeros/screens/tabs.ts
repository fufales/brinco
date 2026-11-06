import type { Tab } from '../../../shared/ui/TabBar';
import { GridIcon, MapIcon } from '../../../shared/ui/icons';

export const NUMBER_TABS: Tab[] = [
  { id: 'map', label: 'Charca', Icon: MapIcon, path: '/' },
  { id: 'numbers', label: 'Números', Icon: GridIcon, path: '/todos/escuchar' },
];

import { useLocation } from 'wouter';
import { sfx } from '../../../shared/sfx';
import { GridIcon, MapIcon } from '../../../shared/ui/icons';
import { ALL_ID } from '../words';

export function TabBar({ active }: { active: 'map' | 'words' }) {
  const [, navigate] = useLocation();
  const tabs = [
    { id: 'map', label: 'Camino', Icon: MapIcon, path: '/' },
    { id: 'words', label: 'Palabras', Icon: GridIcon, path: `/${ALL_ID}/descubrir` },
  ];

  return (
    <nav className="tabs">
      {tabs.map(({ id, label, Icon, path }) => (
        <button
          key={id}
          className={`tabs__item ${active === id ? 'is-active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => {
            if (active === id) return;
            sfx.tap();
            navigate(path);
          }}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}

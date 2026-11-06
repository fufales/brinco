import type { ComponentType } from 'react';
import { useLocation } from 'wouter';
import '../lesson/lesson.css';
import { sfx } from '../sfx';

export interface Tab {
  id: string;
  label: string;
  Icon: ComponentType;
  path: string;
}

export function TabBar({ tabs, active }: { tabs: Tab[]; active: string }) {
  const [, navigate] = useLocation();

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

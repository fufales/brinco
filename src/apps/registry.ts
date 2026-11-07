import { lazy, type ComponentType } from 'react';
import type { State } from '../shared/progress';
import { escuelaSummary, SchoolIcon } from './escuela/summary';
import { NumerosIcon, numerosSummary } from './numeros/summary';
import { PalabrasIcon, palabrasSummary } from './palabras/summary';

export interface MiniApp {
  id: string;
  title: string;
  tagline: string;
  /** Ruta donde vive la app; dentro de ella maneja sus propias pantallas. */
  path: string;
  color: string;
  edge: string;
  Icon: ComponentType;
  Component: ComponentType;
  /** Avance que muestra la tarjeta en el inicio, de 0 a 1. */
  summary: (state: State) => { label: string; value: number };
}

/** Para agregar una app nueva: crea su carpeta en src/apps/ y añade aquí una entrada. */
export const APPS: MiniApp[] = [
  {
    id: 'palabras',
    title: 'Brincapalabras',
    tagline: 'Palabras en inglés',
    path: '/palabras',
    color: '#ff7a59',
    edge: '#dc5533',
    Icon: PalabrasIcon,
    Component: lazy(() => import('./palabras/PalabrasApp')),
    summary: palabrasSummary,
  },
  {
    id: 'numeros',
    title: 'Brincanúmeros',
    tagline: 'Del 11 al 20 en inglés',
    path: '/numeros',
    color: '#17b8a6',
    edge: '#0c8f80',
    Icon: NumerosIcon,
    Component: lazy(() => import('./numeros/NumerosApp')),
    summary: numerosSummary,
  },
  {
    id: 'escuela',
    title: 'Brincaescuela',
    tagline: 'Lugares de la escuela en inglés',
    path: '/escuela',
    color: '#3d7bf5',
    edge: '#2357c9',
    Icon: SchoolIcon,
    Component: lazy(() => import('./escuela/EscuelaApp')),
    summary: escuelaSummary,
  },
];

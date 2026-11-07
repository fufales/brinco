import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { sfx } from '../shared/sfx';
import { Mascot } from '../shared/ui/Mascot';
import { BackIcon } from '../shared/ui/icons';
import { currentPhone, isInstalled, type Phone } from './platform';
import { promptInstall, useCanPromptInstall } from './prompt';
import './install.css';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx={12} cy={12} r={9} {...stroke} />
    <path d="M15.5 8.5 L13.4 13.4 L8.5 15.5 L10.6 10.6 Z" fill="currentColor" stroke="none" />
  </svg>
);
const ChromeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx={12} cy={12} r={9} {...stroke} />
    <circle cx={12} cy={12} r={3.5} {...stroke} />
    <path d="M12 8.5 H20 M9 13.8 L5 6.8 M15 13.8 L11 20.8" {...stroke} />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 9 H6 V21 H18 V9 H16 M12 3 V14 M8.5 6.5 L12 3 L15.5 6.5" {...stroke} />
  </svg>
);
const AddIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x={4} y={4} width={16} height={16} rx={4} {...stroke} />
    <path d="M12 8 V16 M8 12 H16" {...stroke} />
  </svg>
);
const ToggleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x={2.5} y={7} width={19} height={10} rx={5} {...stroke} />
    <circle cx={16.5} cy={12} r={3} fill="currentColor" stroke="none" />
  </svg>
);
const DotsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx={12} cy={5} r={2} fill="currentColor" />
    <circle cx={12} cy={12} r={2} fill="currentColor" />
    <circle cx={12} cy={19} r={2} fill="currentColor" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x={6.5} y={2.5} width={11} height={19} rx={2.5} {...stroke} />
    <path d="M12 7 V14 M9 11 L12 14 L15 11" {...stroke} />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5 L10 17 L19 7" {...stroke} strokeWidth={3} />
  </svg>
);

interface Step {
  Icon: () => ReactNode;
  text: ReactNode;
}

const IOS_STEPS: Step[] = [
  { Icon: CompassIcon, text: <>Abre esta página en <b>Safari</b>, el navegador de la brújula azul.</> },
  {
    Icon: ShareIcon,
    text: (
      <>
        Toca el botón <b>Compartir</b>: el cuadrito con una flecha hacia arriba. Si no lo ves, toca primero los <b>tres puntos</b> de abajo.
      </>
    ),
  },
  { Icon: AddIcon, text: <>Toca <b>«Agregar a inicio»</b>. Si no aparece, búscalo en <b>«Ver más»</b>.</> },
  { Icon: ToggleIcon, text: <>Deja encendido <b>«Abrir como app web»</b> y toca <b>Agregar</b>.</> },
  { Icon: CheckIcon, text: <>¡Listo! Busca la ranita de Brinco en tu pantalla de inicio.</> },
];

const ANDROID_STEPS: Step[] = [
  { Icon: ChromeIcon, text: <>Abre esta página en <b>Chrome</b>.</> },
  { Icon: DotsIcon, text: <>Toca el menú de los <b>tres puntitos</b>, arriba a la derecha.</> },
  { Icon: PhoneIcon, text: <>Toca <b>«Instalar app»</b> o <b>«Agregar a pantalla principal»</b>.</> },
  { Icon: AddIcon, text: <>Confirma tocando <b>Instalar</b>.</> },
  { Icon: CheckIcon, text: <>¡Listo! Busca la ranita de Brinco entre tus apps.</> },
];

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="install__steps">
      {steps.map((step, index) => (
        <motion.li
          key={index}
          className="install__step"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.06, type: 'spring', bounce: 0.35 }}
        >
          <span className="install__num">{index + 1}</span>
          <span className="install__icon">
            <step.Icon />
          </span>
          <span className="install__text">{step.text}</span>
        </motion.li>
      ))}
    </ol>
  );
}

export function InstallPage() {
  const [, navigate] = useLocation();
  const detected = currentPhone();
  const [tab, setTab] = useState<Exclude<Phone, 'other'>>(detected === 'android' ? 'android' : 'ios');
  const canPrompt = useCanPromptInstall();
  const installed = isInstalled();

  return (
    <div className="screen install">
      <header className="bar">
        <button className="icon-btn" aria-label="Volver al inicio" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <h1 className="bar__title">Instalar Brinco</h1>
        <span className="install__spacer" />
      </header>

      <div className="scroll install__body">
        <div className="install__intro">
          <span className="install__frog" aria-hidden="true">
            <Mascot mood={installed ? 'cheer' : 'wave'} />
          </span>
          {installed ? (
            <p>
              <strong>¡Brinco ya está instalada!</strong>
              <br />
              La abriste desde la pantalla de inicio.
            </p>
          ) : (
            <p>
              <strong>Pon a Brinco en tu teléfono</strong>
              <br />
              Queda como una app más, con su ícono de ranita.
            </p>
          )}
        </div>

        {!installed && (
          <>
            {canPrompt && (
              <button
                className="btn btn--wide install__now"
                onClick={() => {
                  sfx.tap();
                  void promptInstall();
                }}
              >
                Instalar Brinco
              </button>
            )}

            <div className="install__tabs" role="tablist" aria-label="Tipo de teléfono">
              {(
                [
                  ['ios', 'iPhone'],
                  ['android', 'Android'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  className={tab === id ? 'is-on' : ''}
                  onClick={() => {
                    sfx.tap();
                    setTab(id);
                  }}
                >
                  {label}
                  {detected === id && <small> (este)</small>}
                </button>
              ))}
            </div>

            <Steps key={tab} steps={tab === 'ios' ? IOS_STEPS : ANDROID_STEPS} />
            {tab === 'ios' && <p className="install__note">En iPhone solo se puede instalar desde Safari, no desde Chrome ni otras apps.</p>}
          </>
        )}

        <section className="install__perks">
          <h2>¿Para qué instalarla?</h2>
          <ul>
            <li>Se ve en pantalla completa, sin las barras del navegador.</li>
            <li>Funciona aunque no haya internet.</li>
            <li>Se actualiza sola cuando hay juegos nuevos.</li>
          </ul>
          <p className="install__note">
            El progreso se guarda en el teléfono. Si borras el ícono de Brinco, también se borran las estrellas ganadas en ese teléfono.
          </p>
        </section>
      </div>
    </div>
  );
}

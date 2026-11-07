import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { resetProgress, updateSettings, useProgress } from '../progress';
import { NORMAL_RATE, speak } from '../speech';
import { APP_VERSION, checkForUpdate, triggerUpdate, type CheckResult } from '../updates';
import { Sheet } from './Sheet';
import { useEnglishVoices } from './VoiceNotice';
import { SpeakerIcon } from './icons';
import './settings.css';

const SPEEDS = [
  { label: 'Lenta', rate: 0.65 },
  { label: 'Normal', rate: NORMAL_RATE },
  { label: 'Rápida', rate: 1 },
];

const CHECK_MESSAGES: Record<CheckResult, string> = {
  latest: 'Ya tienes la última versión.',
  found: '¡Hay una versión nueva! Actualizando…',
  failed: 'No se pudo buscar. Revisa la conexión.',
  unavailable: 'Las actualizaciones no están disponibles aquí.',
};

function displayMode(): string {
  const modes = ['standalone', 'fullscreen', 'minimal-ui', 'browser'];
  return modes.find((mode) => matchMedia(`(display-mode: ${mode})`).matches) ?? 'otro';
}

/** Las medidas reales: con una captura de Ajustes se puede diagnosticar un teléfono a distancia. */
function measureScreen(): string {
  const app = document.querySelector('.frame')?.getBoundingClientRect();
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)';
  document.body.append(probe);
  const { paddingTop, paddingBottom } = getComputedStyle(probe);
  probe.remove();
  return [
    `Pantalla ${screen.width}×${screen.height}`,
    `Ventana ${innerWidth}×${innerHeight}`,
    `App ${Math.round(app?.width ?? 0)}×${Math.round(app?.height ?? 0)}`,
    `Zona segura ${parseInt(paddingTop)}/${parseInt(paddingBottom)}`,
    `Modo ${displayMode()}${document.documentElement.classList.contains('installed-app') ? ' (app)' : ''}`,
  ].join(' · ');
}

function VersionRow() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [measures] = useState(measureScreen);

  const check = async () => {
    setChecking(true);
    setResult(null);
    const r = await checkForUpdate();
    setResult(r);
    if (r === 'found') {
      // Sí hay update → activarlo ahora mismo
      triggerUpdate();
    }
    setChecking(false);
  };

  return (
    <div className="settings__version">
      <div className="settings__version-text">
        <strong>Versión {APP_VERSION}</strong>
        {result && <small role="status">{CHECK_MESSAGES[result]}</small>}
        <small className="settings__measures">{measures}</small>
      </div>
      <button className="settings__check" disabled={checking} onClick={check}>
        {checking ? 'Buscando…' : 'Buscar actualización'}
      </button>
    </div>
  );
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useProgress();
  const voices = useEnglishVoices();
  const [confirmReset, setConfirmReset] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!open) setConfirmReset(false);
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} label="Ajustes para papás">
      <h2 className="settings__title">Ajustes para papás</h2>

      <label className="settings__field">
        <span>Voz de respaldo del teléfono</span>
        <select
          value={settings.voiceURI ?? ''}
          onChange={(event) => updateSettings({ voiceURI: event.target.value || null })}
        >
          <option value="">Automática{voices[0] ? ` (${voices[0].name})` : ''}</option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </label>
      <button className="btn btn--sky btn--wide settings__test" onClick={() => speak('kangaroo')}>
        <SpeakerIcon /> Probar voz
      </button>

      <div className="settings__field">
        <span>Velocidad</span>
        <div className="settings__segments" role="radiogroup" aria-label="Velocidad">
          {SPEEDS.map((speed) => (
            <button
              key={speed.label}
              role="radio"
              aria-checked={settings.rate === speed.rate}
              className={settings.rate === speed.rate ? 'is-on' : ''}
              onClick={() => updateSettings({ rate: speed.rate })}
            >
              {speed.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="settings__switch"
        role="switch"
        aria-checked={settings.sfx}
        onClick={() => updateSettings({ sfx: !settings.sfx })}
      >
        <span>Efectos de sonido</span>
        <span className={`settings__knob ${settings.sfx ? 'is-on' : ''}`} />
      </button>

      <button
        className={`btn btn--wide ${confirmReset ? 'btn--coral' : 'btn--white'}`}
        onClick={() => {
          if (confirmReset) {
            resetProgress();
            onClose();
          } else {
            setConfirmReset(true);
          }
        }}
      >
        {confirmReset ? '¿Seguro? Toca otra vez' : 'Borrar el progreso'}
      </button>

      <button
        className="btn btn--white btn--wide"
        onClick={() => {
          onClose();
          navigate('~/instalar');
        }}
      >
        Cómo instalar en el teléfono
      </button>

      <VersionRow />

      <button className="btn btn--grape btn--wide" onClick={onClose}>
        Listo
      </button>
    </Sheet>
  );
}

import { useEffect, useState } from 'react';
import { resetProgress, updateSettings, useProgress } from '../progress';
import { NORMAL_RATE, speak } from '../speech';
import { Sheet } from './Sheet';
import { useEnglishVoices } from './VoiceNotice';
import { SpeakerIcon } from './icons';
import './settings.css';

const SPEEDS = [
  { label: 'Lenta', rate: 0.65 },
  { label: 'Normal', rate: NORMAL_RATE },
  { label: 'Rápida', rate: 1 },
];

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useProgress();
  const voices = useEnglishVoices();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!open) setConfirmReset(false);
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} label="Ajustes para papás">
      <h2 className="settings__title">Ajustes para papás</h2>

      <label className="settings__field">
        <span>Voz en inglés</span>
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

      <button className="btn btn--grape btn--wide" onClick={onClose}>
        Listo
      </button>
    </Sheet>
  );
}

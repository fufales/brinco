import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { justUpdatedTo, triggerUpdate } from '../updates';
import { Mascot } from './Mascot';

const VISIBLE_MS = 4000;

/**
 * Toast que avisa de una actualización.
 *
 * Modo 1 — "Nueva versión disponible": aparece cuando el SW detectó un update
 *   pendiente. Muestra botón "Actualizar ahora" para que el usuario active
 *   skipWaiting manualmente.
 *
 * Modo 2 — "Actualizado a vX.Y.Z": aparece DESPUÉS de que la app se recargó
 *   con una versión nueva. Auto-desaparece tras VISIBLE_MS ms.
 */
export function UpdateToast() {
  const version = justUpdatedTo();
  const [updateReady, setUpdateReady] = useState(false);
  const [justUpdated, setJustUpdated] = useState(version !== null);

  // Escuchar evento personalizado desde updates.ts cuando hay update pendiente
  useEffect(() => {
    const handler = () => setUpdateReady(true);
    window.addEventListener('brinco:update-ready', handler);
    return () => window.removeEventListener('brinco:update-ready', handler);
  }, []);

  // Auto-dismiss del toast de "actualizado"
  useEffect(() => {
    if (!justUpdated) return;
    const timer = window.setTimeout(() => setJustUpdated(false), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [justUpdated]);

  const handleUpdate = () => {
    const applied = triggerUpdate();
    if (applied) {
      setUpdateReady(false);
    }
  };

  const show = updateReady || justUpdated;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`update-toast ${updateReady ? 'update-toast--ready' : ''}`}
          role="status"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <span className="update-toast__frog">
            <Mascot mood={updateReady ? 'happy' : 'cheer'} />
          </span>
          {updateReady ? (
            <>
              <span className="update-toast__text">¡Nueva versión disponible!</span>
              <button className="update-toast__btn" onClick={handleUpdate}>
                Actualizar ahora
              </button>
            </>
          ) : (
            `¡Brinco se actualizó a la versión ${version}!`
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

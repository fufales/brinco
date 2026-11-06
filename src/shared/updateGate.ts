/**
 * Decide cuándo aplicar una versión ya descargada: en cuanto esté lista,
 * salvo que alguna pantalla la esté bloqueando.
 */
export function createUpdateGate(apply: () => void) {
  let blockers = 0;
  let ready = false;
  let applied = false;

  const tryApply = () => {
    if (!ready || blockers > 0 || applied) return;
    applied = true;
    apply();
  };

  return {
    markReady() {
      ready = true;
      tryApply();
    },

    /** Bloquea hasta llamar a la función que devuelve. */
    block() {
      blockers += 1;
      let released = false;
      return () => {
        if (released) return;
        released = true;
        blockers -= 1;
        // Al pasar de una actividad a otra, React suelta el bloqueo viejo y pone
        // el nuevo en el mismo ciclo: esperar evita recargar justo en ese hueco.
        queueMicrotask(tryApply);
      };
    },
  };
}

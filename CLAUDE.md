# Reglas del proyecto Brinco

## Voces realistas (obligatorio en cada juego nuevo)

Todo lo que la app dice en inglés se reproduce desde audios realistas pregenerados, no con la voz robótica del teléfono.

Al crear o cambiar un juego:

1. Registra cada frase nueva que dirá la app en `src/shared/voice/phrases.ts` (`allPhrases()`). Incluye las frases armadas con datos, como "Go to the library!".
2. Corre `npm run voices`. Genera con OpenRouter (`elevenlabs/eleven-v4`, voz `sarah`) solo las frases que aún no tienen audio, las guarda en `public/voice/` y actualiza `src/shared/voice/manifest.json`.
3. Sube los mp3 y el manifiesto junto con el juego.
4. `npm test` falla si alguna frase se queda sin audio (`tests/voices.test.ts`), y sin pruebas no sale ningún lanzamiento.

## La clave de OpenRouter es solo para desarrollo

- Vive únicamente en `.env.local` (`OPENROUTER_API_KEY=…`), que git ignora. El repositorio es público: nunca la escribas en código, documentación, commits, CI ni en el build.
- La app publicada solo reproduce los mp3; nunca llama al modelo.
- `tests/voices.test.ts` falla si encuentra una clave `sk-or-…` en el repositorio.

## Otras convenciones

- Todo el texto para niños y papás va en español; lo que se aprende va en inglés.
- Cada juego vive en `src/apps/<juego>/` y se registra en `src/apps/registry.ts`.
- Los lanzamientos se hacen desde `main` con `npm version patch|minor`.

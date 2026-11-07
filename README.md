<p align="center">
  <img src="public/logo.svg" alt="Brinco" width="420" />
</p>

<p align="center"><strong>Mini apps para que los niños aprendan jugando, hechas para el celular.</strong></p>

<p align="center">
  <img src="docs/inicio.jpg" alt="Pantalla de inicio con la ranita Brinco" width="200" />
  <img src="docs/mapa.jpg" alt="Camino de islas por letra" width="200" />
  <img src="docs/descubrir.jpg" alt="Tarjetas que dicen la palabra al tocarlas" width="200" />
  <img src="docs/parejas.jpg" alt="Ejercicio de unir imágenes con palabras" width="200" />
</p>

## Brincapalabras, la primera app

Practica 17 palabras en inglés, agrupadas por su letra inicial. Al tocar una imagen, el navegador dice la palabra en inglés. Si se toca otra vez, la repite más lento.

| Letra | Palabras |
|---|---|
| **K** | kangaroo (canguro), kite (cometa), keys (llaves), king (rey) |
| **W** | water (agua), walk (caminar), week (semana) |
| **V** | van (buseta), vest (chaleco), violin (violín), vase (florero), volcano (volcán) |
| **J** | juice (jugo), jam (mermelada), jumper (suéter), jump (brincar), jellyfish (medusa) |

Cada lección mezcla cuatro ejercicios: escuchar y tocar, leer y tocar, unir parejas y armar la palabra. No hay vidas ni castigos: un error recibe una respuesta amable y el ejercicio vuelve al final.

## Brincanúmeros

Practica los números del 11 al 20 en inglés. Cada número se presenta como **diez y algunos más**, con marcos de diez.

<p align="center">
  <img src="docs/numeros-escuchar.jpg" alt="Tarjetas de números con marcos de diez" width="200" />
  <img src="docs/numeros-escribir.jpg" alt="Escribir un número tocando sus cifras" width="200" />
  <img src="docs/numeros-brincar.jpg" alt="La rana salta por las hojas en orden" width="200" />
  <img src="docs/numeros-luciernagas.jpg" alt="Atrapar luciérnagas con números" width="200" />
</p>

- **Escucha y toca** y **Lee y toca:** oír o leer el número y encontrarlo.
- **Cuenta:** contar desde diez tocando el marco.
- **Escribe el número:** oírlo y tocar sus cifras, mientras la rana salta a cada hoja.
- **Brinca en orden** y **¿Qué número falta?:** la rana salta por las hojas de nenúfar.
- **Une las parejas:** cada número con su palabra.
- **Atrapa las luciérnagas:** un minijuego en el que la rana atrapa con la lengua el número que oye.

## Brincaescuela

Practica seis lugares de la escuela en inglés: garden (jardín), restroom (baño), principal's office (dirección), library (biblioteca), classroom (aula) y cafeteria (comedor).

<p align="center">
  <img src="docs/escuela-inicio.jpg" alt="Portada de Brincaescuela con sus tres actividades" width="200" />
  <img src="docs/escuela-mapa.jpg" alt="Plano de la escuela con la rana en la entrada" width="200" />
</p>

- **Descubre:** tocar cada lugar para oír su nombre.
- **Lección:** escuchar y tocar, leer y tocar, y unir parejas.
- **¿Dónde está?:** la voz dice, por ejemplo, "Go to the library!" y la rana salta al lugar que el niño toca en el plano de la escuela.

## Brincamigos

Practica en inglés siete personas de la escuela: principal (directora), cook (cocinero), janitor (conserje), students (estudiantes), teacher (maestra), security guard (guarda) y secretary (secretario).

<p align="center">
  <img src="docs/amigos-inicio.jpg" alt="Portada de Brincamigos con sus tres actividades" width="200" />
  <img src="docs/amigos-quien.jpg" alt="Cada persona de la escuela en su lugar del plano" width="200" />
</p>

- **Descubre:** tocar a cada persona para oír quién es.
- **Lección:** escuchar y tocar, leer y tocar, y unir parejas.
- **¿Quién es?:** cada persona está en su lugar del plano, como el cocinero en el comedor. La voz dice "Find the cook!" y el niño la toca.

Brincaescuela y Brincamigos comparten las pantallas de `src/apps/escuela/`; cada uno pasa su propio tema (`topics.ts` y `amigos/topic.ts`).

## Publicarla en un servidor

Es un sitio estático, así que no necesita base de datos ni configuración.

1. Descarga `brinco-web.zip` desde [la última versión](https://github.com/fufales/brinco/releases/latest).
2. Descomprímelo y sube su contenido a cualquier carpeta de tu servidor.
3. Abre esa dirección en el celular.

Con HTTPS, además se puede instalar en la pantalla de inicio y usar sin conexión.

## Lanzar una versión

Desde `main`, sin cambios pendientes:

```bash
npm version patch
```

Usa `patch` para arreglos, `minor` para funciones nuevas y `major` para cambios grandes. El comando corre las pruebas, sube la versión, crea el commit y el tag, y hace push. Con ese tag, CI crea el Release que el servidor despliega. Un push normal a `main` no llega a los teléfonos.

Cada Release trae `brinco-web.zip` y `brinco-web.zip.sha256`. Antes de descomprimir en el servidor, conviene verificar el paquete:

```bash
sha256sum -c brinco-web.zip.sha256
```

La app instalada busca versiones nuevas al abrirse, al volver a primer plano y cada 15 minutos. La descarga en segundo plano y se actualiza sola en cuanto el niño sale de una actividad, sin perder el progreso. La versión actual se ve en **Ajustes**, donde también se puede buscar una actualización a mano.

Si hay un CDN delante del servidor, no debe cachear `sw.js` ni `index.html`: retrasaría las actualizaciones.

## Sobre la voz

La app usa la voz del propio dispositivo (`speechSynthesis`) y elige la mejor voz en inglés americano que encuentre, así que el sonido puede variar según el teléfono. Los papás pueden cambiar la voz y la velocidad en **Ajustes**, con el engrane de la pantalla de inicio.

## Desarrollo

Necesitas Node 22 o más reciente.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

El resultado queda en `dist/`.

### Agregar otra app

1. Crea su carpeta en `src/apps/`.
2. Añade una entrada en [`src/apps/registry.ts`](src/apps/registry.ts). Ya aparece sola en el inicio, con su propia ruta.
3. En las pantallas que no se deben interrumpir, llama a `useBlockUpdates()`: las actualizaciones esperarán a que se cierren.

El código común está en `src/shared/`: voz, sonidos, progreso, botones y la mascota. En `src/shared/lesson/` está lo necesario para armar lecciones: `LessonRunner`, `DiscoverGrid`, `MatchBoard` y la pantalla de resultados.

## Privacidad

No hay cuentas, analíticas ni llamadas a servicios externos. El progreso se guarda solo en el dispositivo.

## Licencia

Código e ilustraciones bajo [licencia MIT](LICENSE). La fuente [Fredoka](https://fonts.google.com/specimen/Fredoka) usa la licencia SIL Open Font.

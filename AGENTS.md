# Kids Science Studio

Pipeline local para producir videos educativos de ciencia para niños en español. El video se construye exclusivamente con motion graphics programados en React y Remotion: formas, SVG y texto. No se usan footage ni imágenes generadas por IA.

**Regla de arquitectura:** cada video se define al 100 % en `content/episodes/<slug>/script.json` eligiendo escenas del catálogo cerrado de `src/scenes/registry.ts`. Nunca se escribe animación específica para un episodio. El código de escenas y componentes es reutilizable; el contenido, el orden, la duración y las cues pertenecen al JSON.

## Entorno

- WSL2 Ubuntu 24.04; Node.js 20+ mediante nvm (`.nvmrc` fija 24.14.1), npm y FFmpeg/ffprobe.
- Para Chrome Headless Shell en Ubuntu 24.04, instalar los paquetes de la [lista oficial de Remotion](https://www.remotion.dev/docs/miscellaneous/linux-dependencies#ubuntu-2404).
- `source ~/.nvm/nvm.sh && nvm use` (si la configuración global de npm interfiere, usar `nvm use --delete-prefix`).
- `npm ci`, `npm run lint`, `npm run render:test`.

## Estructura

- `src/theme.ts`: paleta, tipografía Fredoka, escala, radios, sombras y medidas comunes.
- `src/components/`: piezas visuales reutilizables: Tierra, Luna, flecha, órbita, estrellas, subtítulos y tarjetas.
- `src/scenes/registry.ts`: catálogo cerrado, esquemas de props, descripciones y ejemplos. `catalog-scenes.tsx` contiene las implementaciones genéricas.
- `src/schema.ts`: esquema Zod del episodio; `src/timeline.ts`: duración, transiciones y cues.
- `src/compositions/EpisodeComposition.tsx`: composición genérica registrada en `src/Root.tsx`.
- `content/episodes/<slug>/script.json`: único origen del video; `audio/` y `timings/` para futuros resultados de voz y alineamiento.
- `docs/scene-catalog.md`: documento para el LLM planificador, generado por `npm run docs:catalog` desde el registro.
- `scripts/`: automatización de render.
- `out/`: renders locales, excluidos de Git.

## Convenciones

- Formato predeterminado: 1920 × 1080, 30 fps. La duración se calcula por escena: `timing` > `durationSec` > palabras / 2.3 (mínimo 3 s); las transiciones solapan 12 fotogramas.
- Animaciones deterministas basadas en `useCurrentFrame()` y `useVideoConfig()`, sin temporizadores ni aleatoriedad no fijada.
- Texto grande, formas redondeadas y paleta viva para niños. Mantener los elementos dentro del área segura del cuadro.
- Parametrizar escenas con props y declararlas en el registro. Para nuevos episodios, editar solo `script.json`.
- Guardar audios pesados en `content/episodes/<slug>/audio/`; están excluidos de Git. Los timings JSON pueden versionarse.
- Coqui XTTS v2 y WhisperX son integraciones futuras; no están conectadas en la prueba inicial.

## Reglas de contenido

- La precisión científica tiene prioridad sobre la estética. Las representaciones esquemáticas deben preservar las relaciones causales y geométricas relevantes. La órbita cenital de 8 segundos es una velocidad de animación, no el periodo lunar real.
- Usar escala infantil: títulos de al menos 96 px, subtítulos de al menos 48 px, formas legibles y contraste alto.
- Todo color, tipografía, tamaño, radio y sombra visual debe venir de `src/theme.ts`. No usar fuentes del sistema ni valores visuales hardcodeados en componentes.
- Toda escena nueva debe reutilizar los componentes existentes de `src/components/` y ampliar esa biblioteca cuando haga falta una pieza nueva.
- La Luna nunca se superpone con la Tierra en la vista cenital. La capa de marea siempre muestra dos abultamientos opuestos alineados con la Luna.
- Los movimientos secundarios (rotación terrestre, estrellas, agua) son continuos. Usar los presets de `src/theme.ts` para entradas, escalonado, transiciones y cámara.

## Comandos

- `npm run dev`: abre Remotion Studio.
- `npm run validate -- <slug>`: valida y muestra la duración.
- `npm run render:episode -- <slug>`: genera `out/<slug>.mp4`.
- `npm run stills -- <slug>`: genera un PNG del punto medio de cada escena en `out/<slug>/stills/`.
- `npm run docs:catalog`: regenera la documentación del catálogo tras modificar el registro.
- `npm run render:test`: genera `out/test.mp4` usando el episodio de muestra `mareas`.
- `npm run render -- Episode <ruta.mp4>`: render genérico mediante `scripts/render.sh`.
- `npm run lint`: ESLint y TypeScript.

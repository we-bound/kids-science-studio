# Kids Science Studio

Pipeline local para producir videos educativos de ciencia para niños en español. El video se construye exclusivamente con motion graphics programados en React y Remotion: formas, SVG y texto. No se usan footage ni imágenes generadas por IA.

## Entorno

- WSL2 Ubuntu 24.04; Node.js 20+ mediante nvm (`.nvmrc` fija 24.14.1), npm y FFmpeg/ffprobe.
- Para Chrome Headless Shell en Ubuntu 24.04, instalar los paquetes de la [lista oficial de Remotion](https://www.remotion.dev/docs/miscellaneous/linux-dependencies#ubuntu-2404).
- `source ~/.nvm/nvm.sh && nvm use` (si la configuración global de npm interfiere, usar `nvm use --delete-prefix`).
- `npm ci`, `npm run lint`, `npm run render:test`.

## Estructura

- `src/theme.ts`: paleta, tipografía Fredoka, escala, radios, sombras y medidas comunes.
- `src/components/`: piezas visuales reutilizables: `Earth`, `Moon`, `ForceArrow`, `OrbitPath`, `StarField`, `Title`, `Caption`.
- `src/scenes/`: escenas parametrizables, actualmente `TidesScene`.
- `src/compositions/`: videos completos registrados en `src/Root.tsx`.
- `content/episodes/<slug>/script.json`: guion y metadatos; `audio/` y `timings/` para futuros resultados de voz y alineamiento.
- `scripts/`: automatización de render.
- `out/`: renders locales, excluidos de Git.

## Convenciones

- Formato predeterminado: 1920 × 1080, 30 fps. La prueba dura 300 fotogramas (10 segundos).
- Animaciones deterministas basadas en `useCurrentFrame()` y `useVideoConfig()`, sin temporizadores ni aleatoriedad no fijada.
- Texto grande, formas redondeadas y paleta viva para niños. Mantener los elementos dentro del área segura del cuadro.
- Parametrizar escenas con props; registrar cada composición en `src/Root.tsx`.
- Guardar audios pesados en `content/episodes/<slug>/audio/`; están excluidos de Git. Los timings JSON pueden versionarse.
- Coqui XTTS v2 y WhisperX son integraciones futuras; no están conectadas en la prueba inicial.

## Reglas de contenido

- La precisión científica tiene prioridad sobre la estética. Las representaciones esquemáticas deben preservar las relaciones causales y geométricas relevantes. La órbita de 8 segundos es una velocidad de animación, no el periodo lunar real.
- Usar escala infantil: títulos de al menos 96 px, subtítulos de al menos 48 px, formas legibles y contraste alto.
- Todo color, tipografía, tamaño, radio y sombra visual debe venir de `src/theme.ts`. No usar fuentes del sistema ni valores visuales hardcodeados en componentes.
- Toda escena nueva debe reutilizar los componentes existentes de `src/components/` y ampliar esa biblioteca cuando haga falta una pieza nueva.

## Comandos

- `npm run dev`: abre Remotion Studio.
- `npm run render:test`: genera `out/test.mp4` por CLI.
- `npm run render -- <CompositionId> <ruta.mp4>`: render genérico mediante `scripts/render.sh`.
- `npm run lint`: ESLint y TypeScript.

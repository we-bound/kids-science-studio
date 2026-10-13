# Kids Science Studio

Videos educativos de ciencia para niños, hechos con motion graphics en Remotion y TypeScript. Cada video se define por completo en `content/episodes/<slug>/script.json` con escenas del [catálogo](docs/scene-catalog.md).

## Preparación (WSL2 Ubuntu 24.04)

Instala FFmpeg y las [dependencias de Chrome Headless Shell](https://www.remotion.dev/docs/miscellaneous/linux-dependencies#ubuntu-2404). En Ubuntu 24.04:

```bash
sudo apt-get install -y ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libasound2t64 \
  libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 \
  libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0
```

Usa la versión de Node en `.nvmrc`:

```bash
source ~/.nvm/nvm.sh
nvm use
npm ci
```

Si `nvm use` indica que `~/.npmrc` contiene `prefix`, usa `nvm use --delete-prefix` o corrige esa configuración.

## Desarrollo y render

```bash
npm run dev
npm run lint
npm run validate -- mareas
npm run render:episode -- mareas
npm run stills -- mareas
```

El episodio de muestra queda en `out/mareas.mp4` (1920 × 1080, 30 fps). Los PNG de revisión quedan en `out/mareas/stills/`. `npm run render:test` genera `out/test.mp4` con el mismo guion.

Para crear otro episodio, copiá la estructura de `content/episodes/mareas/script.json`, elegí escenas documentadas en el catálogo y validá el JSON. No se agrega código por episodio. Tras ampliar el registro de escenas, ejecutá `npm run docs:catalog`.

Las carpetas `content/episodes/<slug>/audio/` y `timings/` están preparadas para conectar Coqui XTTS v2 y WhisperX más adelante.

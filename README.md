# Kids Science Studio

Videos educativos de ciencia para niños, hechos con motion graphics en Remotion y TypeScript. La composición inicial muestra a la Tierra y la Luna orbitando en 10 segundos.

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
npm run render:test
```

El render de prueba queda en `out/test.mp4` (1920 × 1080, 30 fps, 10 s). Para otra composición: `npm run render -- TidesTest out/otro.mp4`.

Las carpetas `content/episodes/<slug>/audio/` y `timings/` están preparadas para conectar Coqui XTTS v2 y WhisperX más adelante.

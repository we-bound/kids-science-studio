# Catálogo cerrado de escenas

El planificador solo puede elegir los `type` de este documento. Cada episodio se define en `content/episodes/<slug>/script.json`; no se escribe código por episodio.

## Formato del episodio

```json
{
  "title": "¿Por qué hay mareas?",
  "language": "es",
  "scenes": [
    {
      "id": "pregunta",
      "type": "TitleScene",
      "narration": "Hoy veremos por qué cambia el nivel del mar.",
      "props": {
        "heading": "¿Por qué hay mareas?"
      },
      "durationSec": 5
    }
  ]
}
```

`title` y `language` son obligatorios. `scenes` debe tener al menos una escena. Cada `id` debe ser único y usar minúsculas, números y guiones. El validador rechaza campos desconocidos y tipos fuera del catálogo. Mantén títulos y labels breves (máximo 36 caracteres), puntos de lista de hasta 72 caracteres y narraciones aptas para niños de 7 a 10 años.

## Formato de una escena

```json
{
  "id": "id-unico",
  "type": "TitleScene",
  "narration": "Texto hablado.",
  "props": {
    "heading": "Título"
  },
  "durationSec": 5
}
```

`durationSec` es opcional. Prioridad de duración: `timing.endSec - timing.startSec`, luego `durationSec`, luego palabras de `narration` / 2.3 con mínimo de 3 s. Entre escenas hay un fundido de 12 fotogramas que solapa su duración.

`timing` opcional: `{ "startSec": 0, "endSec": 5, "words": [{ "word": "Hola", "start": 0, "end": 0.4 }] }`. Los tiempos de palabras corresponden al clip de narración de esa escena; alimentarán subtítulos karaoke.

`cues` opcional: `[{ "atWord": "atrae", "action": "showArrow" }]`. Acciones válidas: `startOrbit` en OrbitScene; `showArrow` en ForceArrowScene y TideScene; `showTide` en TideScene; `reveal` en KeyPointsScene y RecapScene. La palabra debe aparecer en `narration`; cada acción se usa como máximo una vez por escena.

Sin `timing`, CaptionLayer muestra la narración completa y estima el momento de la cue por la posición de `atWord` en la frase. Con `timing`, resalta la palabra activa y dispara la cue en su tiempo exacto. La órbita de 8 s es una velocidad de demostración, no el periodo real de la Luna.

## Escenas disponibles

### TitleScene

Presenta la pregunta central con Tierra y Luna en movimiento.

Cues permitidas: ninguna.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `heading` | Sí | Pregunta o título grande del episodio. | `"¿Por qué hay mareas?"` |
| `subheading` | No | Una línea de contexto opcional. | `"La Luna mueve los océanos"` |
| `showEarth` | No | Mostrar Tierra y Luna detrás del título (por defecto, sí). | `true` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "titlescene",
  "type": "TitleScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "heading": "¿Por qué hay mareas?",
    "subheading": "La Luna mueve los océanos",
    "showEarth": true
  }
}
```

### OrbitScene

Órbita circular cenital. La Luna permanece separada de la Tierra.

Cues permitidas: `startOrbit`.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `label` | Sí | Mensaje breve sobre la órbita. | `"La Luna gira alrededor de la Tierra"` |
| `orbitSeconds` | No | Segundos de una vuelta visual; es velocidad didáctica, no periodo real. | `8` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "orbitscene",
  "type": "OrbitScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "label": "La Luna gira alrededor de la Tierra",
    "orbitSeconds": 8
  }
}
```

### ForceArrowScene

Flecha móvil desde la Tierra hacia la Luna para mostrar la atracción gravitatoria.

Cues permitidas: `showArrow`.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `label` | Sí | Explicación breve de la fuerza. | `"La gravedad de la Luna atrae el agua"` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "forcearrowscene",
  "type": "ForceArrowScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "label": "La gravedad de la Luna atrae el agua"
  }
}
```

### TideScene

Dos abultamientos de agua opuestos, alineados con la Luna y con suave ondulación.

Cues permitidas: `showTide`, `showArrow`.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `label` | Sí | Explicación breve del efecto de marea. | `"El océano se abulta en dos lados"` |
| `showArrow` | No | Mostrar la flecha de atracción (por defecto, sí). | `true` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "tidescene",
  "type": "TideScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "label": "El océano se abulta en dos lados",
    "showArrow": true
  }
}
```

### KeyPointsScene

Presenta de dos a cuatro ideas, reveladas en secuencia.

Cues permitidas: `reveal`.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `heading` | Sí | Título del bloque de ideas. | `"Dos lugares, dos mareas"` |
| `points` | Sí | Lista de 2 a 4 frases cortas, en orden. | `["Un lado mira a la Luna","El otro está en el lado opuesto"]` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "keypointsscene",
  "type": "KeyPointsScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "heading": "Dos lugares, dos mareas",
    "points": [
      "Un lado mira a la Luna",
      "El otro está en el lado opuesto"
    ]
  }
}
```

### ComparisonScene

Compara dos conceptos en columnas, cada una con título y explicación.

Cues permitidas: ninguna.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `heading` | Sí | Pregunta o título comparativo. | `"¿Qué cambia?"` |
| `left` | Sí | Columna izquierda: { title, body }. | `{"title":"Marea alta","body":"El nivel del mar sube."}` |
| `right` | Sí | Columna derecha: { title, body }. | `{"title":"Marea baja","body":"El nivel del mar baja."}` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "comparisonscene",
  "type": "ComparisonScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "heading": "¿Qué cambia?",
    "left": {
      "title": "Marea alta",
      "body": "El nivel del mar sube."
    },
    "right": {
      "title": "Marea baja",
      "body": "El nivel del mar baja."
    }
  }
}
```

### RecapScene

Cierre con dos o tres ideas clave y mensaje final.

Cues permitidas: `reveal`.

| Prop | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `heading` | Sí | Título de cierre. | `"¡Ahora lo sabes!"` |
| `points` | Sí | Dos o tres ideas que el niño debe recordar. | `["La Luna atrae el océano","Hay dos abultamientos"]` |
| `cameraMotion` | No | Zoom y paneo lentos (por defecto, sí). | Omitir |

Ejemplo de escena:

```json
{
  "id": "recapscene",
  "type": "RecapScene",
  "narration": "Narración breve que acompaña la escena.",
  "props": {
    "heading": "¡Ahora lo sabes!",
    "points": [
      "La Luna atrae el océano",
      "Hay dos abultamientos"
    ]
  }
}
```

import { z } from "zod";

const cameraMotion = z.boolean().optional();
const shortText = z.string().trim().min(1).max(36);
const pointText = z.string().trim().min(1).max(72);
const bodyText = z.string().trim().min(1).max(180);

export const sceneRegistry = {
  TitleScene: {
    description: "Presenta la pregunta central con Tierra y Luna en movimiento.",
    actions: [],
    propsSchema: z.object({ heading: shortText, subheading: shortText.optional(), showEarth: z.boolean().optional(), cameraMotion }).strict(),
    propsDocs: {
      heading: "Pregunta o título grande del episodio.",
      subheading: "Una línea de contexto opcional.",
      showEarth: "Mostrar Tierra y Luna detrás del título (por defecto, sí).",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { heading: "¿Por qué hay mareas?", subheading: "La Luna mueve los océanos", showEarth: true },
  },
  OrbitScene: {
    description: "Órbita circular cenital. La Luna permanece separada de la Tierra.",
    actions: ["startOrbit"],
    propsSchema: z.object({ label: shortText, orbitSeconds: z.number().min(4).max(30).optional(), cameraMotion }).strict(),
    propsDocs: {
      label: "Mensaje breve sobre la órbita.",
      orbitSeconds: "Segundos de una vuelta visual; es velocidad didáctica, no periodo real.",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { label: "La Luna gira alrededor de la Tierra", orbitSeconds: 8 },
  },
  ForceArrowScene: {
    description: "Flecha móvil desde la Tierra hacia la Luna para mostrar la atracción gravitatoria.",
    actions: ["showArrow"],
    propsSchema: z.object({ label: shortText, cameraMotion }).strict(),
    propsDocs: {
      label: "Explicación breve de la fuerza.",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { label: "La gravedad de la Luna atrae el agua" },
  },
  TideScene: {
    description: "Dos abultamientos de agua opuestos, alineados con la Luna y con suave ondulación.",
    actions: ["showTide", "showArrow"],
    propsSchema: z.object({ label: shortText, showArrow: z.boolean().optional(), cameraMotion }).strict(),
    propsDocs: {
      label: "Explicación breve del efecto de marea.",
      showArrow: "Mostrar la flecha de atracción (por defecto, sí).",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { label: "El océano se abulta en dos lados", showArrow: true },
  },
  KeyPointsScene: {
    description: "Presenta de dos a cuatro ideas, reveladas en secuencia.",
    actions: ["reveal"],
    propsSchema: z.object({ heading: shortText, points: z.array(pointText).min(2).max(4), cameraMotion }).strict(),
    propsDocs: {
      heading: "Título del bloque de ideas.",
      points: "Lista de 2 a 4 frases cortas, en orden.",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { heading: "Dos lugares, dos mareas", points: ["Un lado mira a la Luna", "El otro está en el lado opuesto"] },
  },
  ComparisonScene: {
    description: "Compara dos conceptos en columnas, cada una con título y explicación.",
    actions: [],
    propsSchema: z.object({ heading: shortText, left: z.object({ title: shortText, body: bodyText }).strict(), right: z.object({ title: shortText, body: bodyText }).strict(), cameraMotion }).strict(),
    propsDocs: {
      heading: "Pregunta o título comparativo.",
      left: "Columna izquierda: { title, body }.",
      right: "Columna derecha: { title, body }.",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { heading: "¿Qué cambia?", left: { title: "Marea alta", body: "El nivel del mar sube." }, right: { title: "Marea baja", body: "El nivel del mar baja." } },
  },
  RecapScene: {
    description: "Cierre con dos o tres ideas clave y mensaje final.",
    actions: ["reveal"],
    propsSchema: z.object({ heading: shortText, points: z.array(pointText).min(2).max(3), cameraMotion }).strict(),
    propsDocs: {
      heading: "Título de cierre.",
      points: "Dos o tres ideas que el niño debe recordar.",
      cameraMotion: "Zoom y paneo lentos (por defecto, sí).",
    },
    example: { heading: "¡Ahora lo sabes!", points: ["La Luna atrae el océano", "Hay dos abultamientos"] },
  },
} as const;

export type SceneType = keyof typeof sceneRegistry;

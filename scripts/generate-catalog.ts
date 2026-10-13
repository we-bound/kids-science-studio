import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { sceneRegistry } from "../src/scenes/registry";

const lines = [
  "# Catálogo cerrado de escenas",
  "",
  "El planificador solo puede elegir los `type` de este documento. Cada episodio se define en `content/episodes/<slug>/script.json`; no se escribe código por episodio.",
  "",
  "## Formato del episodio",
  "",
  "```json",
  JSON.stringify({ title: "¿Por qué hay mareas?", language: "es", scenes: [{ id: "pregunta", type: "TitleScene", narration: "Hoy veremos por qué cambia el nivel del mar.", props: { heading: "¿Por qué hay mareas?" }, durationSec: 5 }] }, null, 2),
  "```",
  "",
  "`title` y `language` son obligatorios. `scenes` debe tener al menos una escena. Cada `id` debe ser único y usar minúsculas, números y guiones. El validador rechaza campos desconocidos y tipos fuera del catálogo. Mantén títulos y labels breves (máximo 36 caracteres), puntos de lista de hasta 72 caracteres y narraciones aptas para niños de 7 a 10 años.",
  "",
  "## Formato de una escena",
  "",
  "```json",
  JSON.stringify({ id: "id-unico", type: "TitleScene", narration: "Texto hablado.", props: { heading: "Título" }, durationSec: 5 }, null, 2),
  "```",
  "",
  "`durationSec` es opcional. Prioridad de duración: `timing.endSec - timing.startSec`, luego `durationSec`, luego palabras de `narration` / 2.3 con mínimo de 3 s. Entre escenas hay un fundido de 12 fotogramas que solapa su duración.",
  "",
  "`timing` opcional: `{ \"startSec\": 0, \"endSec\": 5, \"words\": [{ \"word\": \"Hola\", \"start\": 0, \"end\": 0.4 }] }`. Los tiempos de palabras corresponden al clip de narración de esa escena; alimentarán subtítulos karaoke.",
  "",
  "`cues` opcional: `[{ \"atWord\": \"atrae\", \"action\": \"showArrow\" }]`. Acciones válidas: `startOrbit` en OrbitScene; `showArrow` en ForceArrowScene y TideScene; `showTide` en TideScene; `reveal` en KeyPointsScene y RecapScene. La palabra debe aparecer en `narration`; cada acción se usa como máximo una vez por escena.",
  "",
  "Sin `timing`, CaptionLayer muestra la narración completa y estima el momento de la cue por la posición de `atWord` en la frase. Con `timing`, resalta la palabra activa y dispara la cue en su tiempo exacto. La órbita de 8 s es una velocidad de demostración, no el periodo real de la Luna.",
  "",
  "## Escenas disponibles",
  "",
];

for (const [type, entry] of Object.entries(sceneRegistry)) {
  entry.propsSchema.parse(entry.example);
  const required = new Set(entry.propsSchema.safeParse({}).error?.issues.map((issue) => String(issue.path[0])) ?? []);
  lines.push(`### ${type}`, "", entry.description, "", `Cues permitidas: ${entry.actions.length ? entry.actions.map((action) => `\`${action}\``).join(", ") : "ninguna"}.`, "", "| Prop | Obligatoria | Descripción | Ejemplo |", "| --- | --- | --- | --- |");
  for (const [prop, description] of Object.entries(entry.propsDocs)) {
    const value = (entry.example as Record<string, unknown>)[prop];
    lines.push(`| \`${prop}\` | ${required.has(prop) ? "Sí" : "No"} | ${description} | ${value === undefined ? "Omitir" : `\`${JSON.stringify(value)}\``} |`);
  }
  lines.push("", "Ejemplo de escena:", "", "```json", JSON.stringify({ id: type.toLowerCase(), type, narration: "Narración breve que acompaña la escena.", props: entry.example }, null, 2), "```", "");
}

mkdirSync(resolve("docs"), { recursive: true });
const target = resolve("docs/scene-catalog.md");
writeFileSync(target, `${lines.join("\n").trimEnd()}\n`);
console.log(`Generado ${target}`);

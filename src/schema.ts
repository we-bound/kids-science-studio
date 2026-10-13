import { z } from "zod";
import { sceneRegistry } from "./scenes/registry";

const wordTimingSchema = z.object({
  word: z.string().trim().min(1),
  start: z.number().nonnegative(),
  end: z.number().positive(),
}).strict().superRefine((word, ctx) => {
  if (word.end <= word.start) ctx.addIssue({ code: "custom", path: ["end"], message: "debe ser mayor que start" });
});

export const timingSchema = z.object({
  startSec: z.number().nonnegative(),
  endSec: z.number().positive(),
  words: z.array(wordTimingSchema).min(1),
}).strict().superRefine((timing, ctx) => {
  if (timing.endSec <= timing.startSec) ctx.addIssue({ code: "custom", path: ["endSec"], message: "debe ser mayor que startSec" });
  timing.words.forEach((word, index) => {
    if (word.start < timing.startSec || word.end > timing.endSec) ctx.addIssue({ code: "custom", path: ["words", index], message: "la palabra debe quedar dentro de startSec y endSec" });
    if (index > 0 && word.start < timing.words[index - 1].end) ctx.addIssue({ code: "custom", path: ["words", index, "start"], message: "las palabras deben estar ordenadas y no solaparse" });
  });
});

const common = {
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, "usar minúsculas, números y guiones"),
  narration: z.string().trim().min(1),
  durationSec: z.number().positive().optional(),
  timing: timingSchema.optional(),
  cues: z.array(z.object({
    atWord: z.string().trim().min(1),
    action: z.enum(["reveal", "startOrbit", "showTide", "showArrow"]),
  }).strict()).optional(),
};

export const sceneSchema = z.discriminatedUnion("type", [
  z.object({ ...common, type: z.literal("TitleScene"), props: sceneRegistry.TitleScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("OrbitScene"), props: sceneRegistry.OrbitScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("ForceArrowScene"), props: sceneRegistry.ForceArrowScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("TideScene"), props: sceneRegistry.TideScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("KeyPointsScene"), props: sceneRegistry.KeyPointsScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("ComparisonScene"), props: sceneRegistry.ComparisonScene.propsSchema }).strict(),
  z.object({ ...common, type: z.literal("RecapScene"), props: sceneRegistry.RecapScene.propsSchema }).strict(),
]);

export const episodeSchema = z.object({
  title: z.string().trim().min(1),
  language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, "usar código como es o es-AR"),
  scenes: z.array(sceneSchema).min(1),
}).strict().superRefine((episode, ctx) => {
  const ids = new Set<string>();
  episode.scenes.forEach((scene, index) => {
    if (ids.has(scene.id)) ctx.addIssue({ code: "custom", path: ["scenes", index, "id"], message: "id repetido" });
    ids.add(scene.id);
    const usedActions = new Set<string>();
    scene.cues?.forEach((cue, cueIndex) => {
      if (!(sceneRegistry[scene.type].actions as readonly string[]).includes(cue.action)) {
        ctx.addIssue({ code: "custom", path: ["scenes", index, "cues", cueIndex, "action"], message: `${cue.action} no está disponible en ${scene.type}` });
      }
      if (usedActions.has(cue.action)) {
        ctx.addIssue({ code: "custom", path: ["scenes", index, "cues", cueIndex, "action"], message: "esta acción ya tiene una cue en la escena" });
      }
      usedActions.add(cue.action);
      if (scene.type === "TideScene" && scene.props.showArrow === false && cue.action === "showArrow") {
        ctx.addIssue({ code: "custom", path: ["scenes", index, "cues", cueIndex, "action"], message: "showArrow requiere props.showArrow: true" });
      }
      const words = scene.narration.toLocaleLowerCase("es").replace(/[¿?¡!.,:;]/g, "").split(/\s+/);
      if (!words.includes(cue.atWord.toLocaleLowerCase("es").replace(/[¿?¡!.,:;]/g, ""))) {
        ctx.addIssue({ code: "custom", path: ["scenes", index, "cues", cueIndex, "atWord"], message: "la palabra no aparece en narration" });
      }
      if (scene.timing && !scene.timing.words.some((word) => word.word.toLocaleLowerCase("es").replace(/[¿?¡!.,:;]/g, "") === cue.atWord.toLocaleLowerCase("es").replace(/[¿?¡!.,:;]/g, ""))) {
        ctx.addIssue({ code: "custom", path: ["scenes", index, "cues", cueIndex, "atWord"], message: "la palabra no aparece en timing.words" });
      }
    });
  });
});

export type Episode = z.infer<typeof episodeSchema>;
export type EpisodeScene = Episode["scenes"][number];

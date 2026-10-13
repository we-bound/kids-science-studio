import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ZodError } from "zod";
import { episodeSchema, type Episode } from "../src/schema";

export const episodePath = (slug: string): string => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Slug inválido: ${slug}. Usá minúsculas, números y guiones.`);
  }
  return resolve(process.cwd(), "content", "episodes", slug, "script.json");
};

export const loadEpisode = (slug: string): Episode => {
  const path = episodePath(slug);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`No se pudo leer ${path}: ${message}`);
  }
  const result = episodeSchema.safeParse(raw);
  if (result.success) return result.data;

  const issues = result.error instanceof ZodError ? result.error.issues : [];
  const lines = issues.map((issue) => {
    const index = issue.path[0] === "scenes" && typeof issue.path[1] === "number" ? issue.path[1] : null;
    const scene = index === null ? null : (raw as { scenes?: { id?: string }[] }).scenes?.[index];
    const location = index === null ? issue.path.join(".") : `escena ${index + 1}${scene?.id ? ` (${scene.id})` : ""} → ${issue.path.slice(2).join(".")}`;
    return `- ${location || "episodio"}: ${issue.message}`;
  });
  throw new Error(`Guion inválido: ${path}\n${lines.join("\n")}`);
};

export const requiredSlug = (): string => {
  const slug = process.argv[2];
  if (!slug) throw new Error("Falta el slug. Ejemplo: npm run validate -- mareas");
  return slug;
};

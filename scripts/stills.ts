import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEpisode, requiredSlug } from "./episode-utils";
import { sceneMidpoints } from "../src/timeline";

try {
  const slug = requiredSlug();
  const episode = loadEpisode(slug);
  const directory = resolve("out", slug, "stills");
  mkdirSync(directory, { recursive: true });
  const manifest = resolve(directory, ".generated-stills.json");
  const midpoints = sceneMidpoints(episode);
  const currentIds = new Set(midpoints.map(({ id }) => id));
  if (existsSync(manifest)) {
    const previousIds = JSON.parse(readFileSync(manifest, "utf8")) as string[];
    for (const id of previousIds) {
      if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`ID inválido en el manifiesto de stills: ${id}`);
      const oldPath = resolve(directory, `${id}.png`);
      if (!currentIds.has(id) && existsSync(oldPath)) unlinkSync(oldPath);
    }
  }
  for (const { id, frame } of midpoints) {
    const output = resolve(directory, `${id}.png`);
    const result = spawnSync(resolve("node_modules/.bin/remotion"), [
      "still", "src/index.ts", "Episode", output,
      "--frame", String(frame), "--props", JSON.stringify({ episode }),
    ], { stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Falló el still de ${id} (fotograma ${frame}).`);
    console.log(`${id}: fotograma ${frame} → ${output}`);
  }
  writeFileSync(manifest, JSON.stringify([...currentIds], null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

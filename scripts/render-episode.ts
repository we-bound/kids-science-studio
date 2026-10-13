import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEpisode, requiredSlug } from "./episode-utils";

try {
  const slug = requiredSlug();
  const episode = loadEpisode(slug);
  mkdirSync(resolve("out"), { recursive: true });
  const result = spawnSync(resolve("node_modules/.bin/remotion"), [
    "render", "src/index.ts", "Episode", `out/${slug}.mp4`,
    "--codec", "h264", "--props", JSON.stringify({ episode }),
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

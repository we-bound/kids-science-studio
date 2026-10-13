import { loadEpisode, requiredSlug } from "./episode-utils";
import { episodeFrames, FPS, sceneDurationSec } from "../src/timeline";

try {
  const slug = requiredSlug();
  const episode = loadEpisode(slug);
  console.log(`Válido: ${slug} — ${episode.scenes.length} escenas — ${(episodeFrames(episode, FPS) / FPS).toFixed(2)} s`);
  episode.scenes.forEach((scene, index) => {
    console.log(`  ${index + 1}. ${scene.id} (${scene.type}): ${sceneDurationSec(scene).toFixed(2)} s`);
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

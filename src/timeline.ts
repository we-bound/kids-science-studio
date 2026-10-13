import type { Episode, EpisodeScene } from "./schema";
import { theme } from "./theme";

export const FPS = 30;

export const sceneDurationSec = (scene: EpisodeScene): number => {
  if (scene.timing) return scene.timing.endSec - scene.timing.startSec;
  if (scene.durationSec !== undefined) return scene.durationSec;
  return Math.max(3, scene.narration.trim().split(/\s+/).length / 2.3);
};

export const sceneFrames = (scene: EpisodeScene, fps = FPS): number =>
  Math.max(1, Math.ceil(sceneDurationSec(scene) * fps));

export const transitionFrames = (episode: Episode, fps = FPS): number => {
  const shortest = Math.min(...episode.scenes.map((scene) => sceneFrames(scene, fps)));
  return Math.min(theme.timing.transitionFrames, Math.max(0, shortest - 1));
};

export const episodeFrames = (episode: Episode, fps = FPS): number =>
  episode.scenes.reduce((sum, scene) => sum + sceneFrames(scene, fps), 0)
  - Math.max(0, episode.scenes.length - 1) * transitionFrames(episode, fps);

export const sceneMidpoints = (episode: Episode, fps = FPS): { id: string; frame: number }[] => {
  const overlap = transitionFrames(episode, fps);
  let start = 0;
  return episode.scenes.map((scene) => {
    const frames = sceneFrames(scene, fps);
    const midpoint = { id: scene.id, frame: start + Math.floor(frames / 2) };
    start += frames - overlap;
    return midpoint;
  });
};

const normalize = (word: string) => word.toLocaleLowerCase("es").replace(/[¿?¡!.,:;]/g, "");

export const cueFrame = (scene: EpisodeScene, action: NonNullable<EpisodeScene["cues"]>[number]["action"], fps = FPS): number | null => {
  const cue = scene.cues?.find((candidate) => candidate.action === action);
  if (!cue) return null;
  if (scene.timing) {
    const timed = scene.timing.words.find((word) => normalize(word.word) === normalize(cue.atWord));
    if (timed) return Math.max(0, Math.round((timed.start - scene.timing.startSec) * fps));
  }
  const words = scene.narration.trim().split(/\s+/);
  const index = words.findIndex((word) => normalize(word) === normalize(cue.atWord));
  return Math.max(0, Math.round(index / words.length * sceneFrames(scene, fps)));
};

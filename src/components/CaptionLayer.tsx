import { useCurrentFrame, useVideoConfig } from "remotion";
import type { EpisodeScene } from "../schema";
import { theme } from "../theme";
import { Caption } from "./Caption";

export type CaptionLayerProps = { scene: EpisodeScene };

export const CaptionLayer: React.FC<CaptionLayerProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!scene.timing) return <Caption text={scene.narration} />;

  const now = scene.timing.startSec + frame / fps;
  return (
    <Caption>
      {scene.timing.words.map((word, index) => (
        <span key={`${index}-${word.start}`} style={{
          color: now >= word.start && now < word.end ? theme.colors.pink : theme.colors.ink,
          display: "inline-block",
          marginRight: `${theme.size.wordGapEm}em`,
        }}>
          {word.word}
        </span>
      ))}
    </Caption>
  );
};

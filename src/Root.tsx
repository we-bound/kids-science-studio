import { Composition } from "remotion";
import sample from "../content/episodes/mareas/script.json";
import { EpisodeComposition } from "./compositions/EpisodeComposition";
import { episodeSchema } from "./schema";
import { episodeFrames, FPS } from "./timeline";

const sampleEpisode = episodeSchema.parse(sample);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode"
      component={EpisodeComposition}
      defaultProps={{ episode: sampleEpisode }}
      calculateMetadata={({ props }) => ({
        durationInFrames: episodeFrames(episodeSchema.parse(props.episode), FPS),
      })}
      durationInFrames={episodeFrames(sampleEpisode, FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

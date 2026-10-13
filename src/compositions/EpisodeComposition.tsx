import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import type { Episode } from "../schema";
import { sceneFrames, transitionFrames } from "../timeline";
import { SceneRenderer } from "../scenes/catalog-scenes";

export type EpisodeCompositionProps = { episode: Episode };

export const EpisodeComposition: React.FC<EpisodeCompositionProps> = ({ episode }) => {
  const overlap = transitionFrames(episode);
  return <TransitionSeries>
    {episode.scenes.map((scene, index) => <Fragment key={scene.id}>
      {index > 0 && overlap > 0 && <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: overlap })} />}
      <TransitionSeries.Sequence durationInFrames={sceneFrames(scene)} name={`${index + 1}. ${scene.id}`}>
        <SceneRenderer scene={scene} durationFrames={sceneFrames(scene)} />
      </TransitionSeries.Sequence>
    </Fragment>)}
  </TransitionSeries>;
};

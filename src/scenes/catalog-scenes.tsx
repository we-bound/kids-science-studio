import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionLayer } from "../components/CaptionLayer";
import { InfoCard } from "../components/InfoCard";
import { SceneShell } from "../components/SceneShell";
import { SpaceVisual } from "../components/SpaceVisual";
import { Title } from "../components/Title";
import type { EpisodeScene } from "../schema";
import { cueFrame } from "../timeline";
import { theme } from "../theme";

type OfType<T extends EpisodeScene["type"]> = Extract<EpisodeScene, { type: T }>;

export const TitleScene: React.FC<{ scene: OfType<"TitleScene"> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: theme.timing.entry });
  return <>
    {scene.props.showEarth !== false && <SpaceVisual scene={scene} />}
    <Title text={scene.props.heading} />
    {scene.props.subheading && <div style={{
      position: "absolute", top: theme.layout.titleTop + theme.type.title + theme.size.subheadingGap,
      left: theme.layout.titleSide, right: theme.layout.titleSide,
      textAlign: "center", fontSize: theme.size.cardBody, color: theme.colors.star,
      opacity: entry, transform: `translateY(${(1 - entry) * theme.timing.titleEntranceDistance}px)`,
    }}>{scene.props.subheading}</div>}
  </>;
};

export const OrbitScene: React.FC<{ scene: OfType<"OrbitScene"> }> = ({ scene }) => <>
  <SpaceVisual scene={scene} orbitSeconds={scene.props.orbitSeconds} />
  <Title text={scene.props.label} />
</>;

export const ForceArrowScene: React.FC<{ scene: OfType<"ForceArrowScene"> }> = ({ scene }) => <>
  <SpaceVisual scene={scene} showArrow />
  <Title text={scene.props.label} />
</>;

export const TideScene: React.FC<{ scene: OfType<"TideScene"> }> = ({ scene }) => <>
  <SpaceVisual scene={scene} showTide showArrow={scene.props.showArrow !== false} />
  <Title text={scene.props.label} />
</>;

const PointList: React.FC<{ scene: EpisodeScene; points: string[] }> = ({ scene, points }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = cueFrame(scene, "reveal", fps) ?? 0;
  return <div style={{ position: "absolute", top: theme.size.listTop, left: theme.size.listSide, right: theme.size.listSide }}>
    {points.map((point, index) => {
      const entry = spring({ frame: frame - reveal - index * theme.timing.staggerFrames, fps, config: theme.timing.entry });
      return <div key={`${index}-${point}`} style={{
        marginBottom: theme.size.listGap / 2, padding: `${theme.size.listPadY}px ${theme.size.listPadX}px`,
        borderRadius: theme.radius.caption, background: theme.colors.captionBackground,
        boxShadow: theme.shadow.card, color: theme.colors.ink,
        fontSize: theme.size.listFont, opacity: entry,
        transform: `translateX(${(1 - entry) * theme.timing.titleEntranceDistance}px)`,
      }}><span style={{ color: theme.colors.pink, marginRight: theme.size.bulletGap }}>●</span>{point}</div>;
    })}
  </div>;
};

export const KeyPointsScene: React.FC<{ scene: OfType<"KeyPointsScene"> }> = ({ scene }) => <>
  <Title text={scene.props.heading} />
  <PointList scene={scene} points={scene.props.points} />
</>;

export const ComparisonScene: React.FC<{ scene: OfType<"ComparisonScene"> }> = ({ scene }) => <>
  <Title text={scene.props.heading} />
  <div style={{
    position: "absolute", top: theme.size.cardTop, left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: theme.size.cardGap,
  }}>
    <InfoCard title={scene.props.left.title} body={scene.props.left.body} index={0} />
    <InfoCard title={scene.props.right.title} body={scene.props.right.body} index={1} />
  </div>
</>;

export const RecapScene: React.FC<{ scene: OfType<"RecapScene"> }> = ({ scene }) => <>
  <Title text={scene.props.heading} />
  <PointList scene={scene} points={scene.props.points} />
</>;

const assertNever = (scene: never): never => {
  throw new Error(`Escena no implementada: ${JSON.stringify(scene)}`);
};

export const SceneRenderer: React.FC<{ scene: EpisodeScene; durationFrames: number }> = ({ scene, durationFrames }) => {
  const content = (() => {
    switch (scene.type) {
      case "TitleScene": return <TitleScene scene={scene} />;
      case "OrbitScene": return <OrbitScene scene={scene} />;
      case "ForceArrowScene": return <ForceArrowScene scene={scene} />;
      case "TideScene": return <TideScene scene={scene} />;
      case "KeyPointsScene": return <KeyPointsScene scene={scene} />;
      case "ComparisonScene": return <ComparisonScene scene={scene} />;
      case "RecapScene": return <RecapScene scene={scene} />;
      default: return assertNever(scene);
    }
  })();
  return <SceneShell cameraMotion={scene.props.cameraMotion} durationFrames={durationFrames}>
    {content}
    <CaptionLayer scene={scene} />
  </SceneShell>;
};

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { EpisodeScene } from "../schema";
import { cueFrame } from "../timeline";
import { theme } from "../theme";
import { Earth } from "./Earth";
import { ForceArrow } from "./ForceArrow";
import { Moon } from "./Moon";
import { OrbitPath } from "./OrbitPath";

export type SpaceVisualProps = {
  scene: EpisodeScene;
  showArrow?: boolean;
  showTide?: boolean;
  orbitSeconds?: number;
};

export const SpaceVisual: React.FC<SpaceVisualProps> = ({
  scene, showArrow = false, showTide = false, orbitSeconds = theme.timing.orbitSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { centerX, centerY } = theme.layout;
  const startOrbit = cueFrame(scene, "startOrbit", fps) ?? 0;
  const orbitFrame = Math.max(0, frame - startOrbit);
  const angle = -Math.PI / 4 + orbitFrame / fps / orbitSeconds * Math.PI * 2;
  const moonX = centerX + Math.cos(angle) * theme.size.orbitRadius;
  const moonY = centerY + Math.sin(angle) * theme.size.orbitRadius;
  const orbitOpacity = interpolate(frame, [0, theme.timing.orbitFadeFrames], [0, 1], { extrapolateRight: "clamp" });
  const tideStart = cueFrame(scene, "showTide", fps) ?? 0;
  const arrowStart = cueFrame(scene, "showArrow", fps) ?? 0;
  const tideOpacity = interpolate(frame, [tideStart, tideStart + theme.timing.fadeFrames], [0, 1], { extrapolateRight: "clamp" });
  const arrowOpacity = interpolate(frame, [arrowStart, arrowStart + theme.timing.fadeFrames], [0, 1], { extrapolateRight: "clamp" });
  const arrowStartRadius = theme.size.earth / 2 + theme.size.forceStroke;
  const arrowEndRadius = theme.size.orbitRadius - theme.size.moon / 2 - theme.size.forceHead;

  return (
    <>
      <OrbitPath centerX={centerX} centerY={centerY} opacity={orbitOpacity} />
      <Earth centerX={centerX} centerY={centerY} tideOn={showTide} tideAngle={angle} tideOpacity={tideOpacity} />
      {showArrow && <ForceArrow
        startX={centerX + Math.cos(angle) * arrowStartRadius}
        startY={centerY + Math.sin(angle) * arrowStartRadius}
        endX={centerX + Math.cos(angle) * arrowEndRadius}
        endY={centerY + Math.sin(angle) * arrowEndRadius}
        opacity={arrowOpacity}
      />}
      <Moon centerX={moonX} centerY={moonY} />
    </>
  );
};

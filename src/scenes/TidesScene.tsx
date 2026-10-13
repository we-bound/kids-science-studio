import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { Earth } from "../components/Earth";
import { ForceArrow } from "../components/ForceArrow";
import { Moon } from "../components/Moon";
import { OrbitPath } from "../components/OrbitPath";
import { StarField } from "../components/StarField";
import { Title } from "../components/Title";
import { theme } from "../theme";

export type TidesSceneProps = {
  title: string;
  caption: string;
  tideOn?: boolean;
};

export const TidesScene: React.FC<TidesSceneProps> = ({ title, caption, tideOn = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { centerX, centerY } = theme.layout;
  const { orbitRadiusX, orbitRadiusY } = theme.size;
  const orbitAngle = -Math.PI / 3 + (frame / fps / theme.timing.orbitSeconds) * Math.PI * 2;
  const moonX = centerX + Math.cos(orbitAngle) * orbitRadiusX;
  const moonY = centerY + Math.sin(orbitAngle) * orbitRadiusY;
  const inFront = Math.sin(orbitAngle) >= 0;
  const direction = Math.atan2(moonY - centerY, moonX - centerX);
  const distance = Math.hypot(moonX - centerX, moonY - centerY);
  const endDistance = distance - theme.size.moon * (inFront ? theme.size.moonFrontScale : theme.size.moonBackScale) / 2 - theme.size.forceHead;
  // When the projected Moon overlaps Earth, keep the arrow directed toward it.
  // Earth occludes the portion of the arrow that lies behind its disc.
  const startDistance = Math.min(theme.size.earth / 2 + theme.size.forceStroke, endDistance - theme.size.forceHead);
  const orbitOpacity = interpolate(frame, [0, theme.timing.orbitFadeFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 55%, ${theme.colors.backgroundGlow}, ${theme.colors.background})`,
      overflow: "hidden",
      fontFamily: theme.type.family,
    }}>
      <StarField />
      <OrbitPath centerX={centerX} centerY={centerY} opacity={orbitOpacity} />
      {!inFront && <Moon centerX={moonX} centerY={moonY} inFront={false} />}
      <ForceArrow
        startX={centerX + Math.cos(direction) * startDistance}
        startY={centerY + Math.sin(direction) * startDistance}
        endX={centerX + Math.cos(direction) * endDistance}
        endY={centerY + Math.sin(direction) * endDistance}
      />
      <Earth centerX={centerX} centerY={centerY} tideOn={tideOn} tideAngle={direction} />
      {inFront && <Moon centerX={moonX} centerY={moonY} inFront />}
      <Title text={title} />
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

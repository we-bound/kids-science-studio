import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { StarField } from "./StarField";

export type SceneShellProps = { cameraMotion?: boolean; durationFrames: number; children: React.ReactNode };

export const SceneShell: React.FC<SceneShellProps> = ({ cameraMotion = true, durationFrames, children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, durationFrames));
  const zoom = cameraMotion ? 1 + theme.timing.cameraZoom * progress : 1;
  const panX = cameraMotion ? theme.timing.cameraPanX * progress : 0;
  const panY = cameraMotion ? theme.timing.cameraPanY * progress : 0;
  const opacity = interpolate(frame, [0, theme.timing.fadeFrames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 55%, ${theme.colors.backgroundGlow}, ${theme.colors.background})`,
      overflow: "hidden",
      fontFamily: theme.type.family,
    }}>
      <AbsoluteFill style={{ opacity, transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}>
        <StarField />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

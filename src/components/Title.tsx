import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: {
    damping: theme.timing.titleSpringDamping,
    stiffness: theme.timing.titleSpringStiffness,
  } });
  const opacity = interpolate(frame, [0, theme.timing.titleFadeFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: theme.layout.titleTop,
        left: theme.layout.titleSide,
        right: theme.layout.titleSide,
        textAlign: "center",
        fontFamily: theme.type.family,
        fontSize: theme.type.title,
        fontWeight: theme.type.weight,
        letterSpacing: theme.type.letterSpacing,
        color: theme.colors.white,
        textShadow: theme.shadow.title,
        opacity,
        transform: `translateY(${(1 - entrance) * -theme.timing.titleEntranceDistance}px) scale(${0.8 + entrance * 0.2})`,
      }}
    >
      {text}
    </div>
  );
};

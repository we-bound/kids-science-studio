import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: 100,
        right: 100,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: 100,
        fontWeight: 900,
        letterSpacing: -3,
        color: "#ffffff",
        textShadow: "0 8px 0 #17669e, 0 15px 30px #142b5980",
        opacity,
        transform: `translateY(${(1 - entrance) * -100}px) scale(${0.8 + entrance * 0.2})`,
      }}
    >
      {text}
    </div>
  );
};

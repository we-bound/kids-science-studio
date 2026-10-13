import { theme } from "../theme";
import { interpolate, useCurrentFrame } from "remotion";

export type CaptionProps = { text?: string; children?: React.ReactNode };

export const Caption: React.FC<CaptionProps> = ({ text, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, theme.timing.fadeFrames], [0, 1], { extrapolateRight: "clamp" });
  return (
  <div
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: theme.layout.captionBottom,
      padding: `${theme.size.captionPadY}px ${theme.size.captionPadX}px`,
      minWidth: theme.size.captionMinWidth,
      maxWidth: theme.size.captionMaxWidth,
      borderRadius: theme.radius.caption,
      backgroundColor: theme.colors.captionBackground,
      color: theme.colors.ink,
      fontFamily: theme.type.family,
      fontSize: theme.type.caption,
      fontWeight: theme.type.weight,
      textAlign: "center",
      boxShadow: theme.shadow.caption,
      opacity,
    }}
  >
    {children ?? text}
  </div>
  );
};

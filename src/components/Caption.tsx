import { theme } from "../theme";

export type CaptionProps = { text: string };

export const Caption: React.FC<CaptionProps> = ({ text }) => (
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
    }}
  >
    {text}
  </div>
);

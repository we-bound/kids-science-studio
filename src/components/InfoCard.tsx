import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type InfoCardProps = {
  title: string;
  body: string;
  index: number;
};

export const InfoCard: React.FC<InfoCardProps> = ({ title, body, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame: frame - index * theme.timing.staggerFrames, fps, config: theme.timing.entry });
  return (
    <div style={{
      width: theme.size.cardWidth,
      minHeight: theme.size.cardMinHeight,
      padding: theme.size.cardPadding,
      borderRadius: theme.size.cardRadius,
      background: theme.colors.captionBackground,
      boxShadow: theme.shadow.card,
      opacity: entry,
      transform: `translateY(${(1 - entry) * theme.timing.titleEntranceDistance}px)`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: theme.size.cardTitle, fontWeight: theme.type.weight, color: theme.colors.orange }}>{title}</div>
      <div style={{ fontSize: theme.size.cardBody, color: theme.colors.ink, marginTop: theme.size.cardPadding / 2 }}>{body}</div>
    </div>
  );
};

import { theme } from "../theme";

export type ForceArrowProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity?: number;
};

export const ForceArrow: React.FC<ForceArrowProps> = ({ startX, startY, endX, endY, opacity = 1 }) => {
  const { colors, size } = theme;
  const angle = Math.atan2(endY - startY, endX - startX);
  const head = size.forceHead;

  return (
    <svg
      aria-label="Flecha de atracción desde la Tierra hacia la Luna"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", opacity }}
    >
      <line
        x1={startX} y1={startY} x2={endX} y2={endY}
        stroke={colors.orange} strokeWidth={size.forceStroke} strokeLinecap="round"
      />
      <path
        d={`M ${endX - Math.cos(angle - Math.PI / 4) * head} ${endY - Math.sin(angle - Math.PI / 4) * head} L ${endX} ${endY} L ${endX - Math.cos(angle + Math.PI / 4) * head} ${endY - Math.sin(angle + Math.PI / 4) * head}`}
        fill="none" stroke={colors.pink} strokeWidth={size.forceStroke}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
};

import { theme } from "../theme";

export type OrbitPathProps = {
  centerX: number;
  centerY: number;
  opacity?: number;
};

export const OrbitPath: React.FC<OrbitPathProps> = ({ centerX, centerY, opacity = 1 }) => {
  const { colors, size } = theme;
  return (
    <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <ellipse
        cx={centerX} cy={centerY} rx={size.orbitRadius} ry={size.orbitRadius}
        fill="none" stroke={colors.orbit} strokeOpacity="0.65"
        strokeWidth={size.orbitStroke} strokeDasharray={size.orbitDash}
      />
    </svg>
  );
};

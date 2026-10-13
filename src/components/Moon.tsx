import { theme } from "../theme";

export type MoonProps = {
  centerX: number;
  centerY: number;
};

export const Moon: React.FC<MoonProps> = ({ centerX, centerY }) => {
  const { colors, size, shadow, vector } = theme;
  const diameter = size.moon;

  return (
    <svg
      aria-label="Luna"
      width={diameter}
      height={diameter}
      viewBox={vector.moonViewBox}
      style={{
        position: "absolute",
        left: centerX - diameter / 2,
        top: centerY - diameter / 2,
        filter: `drop-shadow(${shadow.moon})`,
      }}
    >
      <defs>
        <radialGradient id="moon-fill" cx="32%" cy="24%" r="76%">
          <stop offset="0%" stopColor={colors.moonLight} />
          <stop offset="67%" stopColor={colors.moon} />
          <stop offset="100%" stopColor={colors.moonDark} />
        </radialGradient>
      </defs>
      <circle cx={vector.moonCenter} cy={vector.moonCenter} r={vector.moonRadius} fill="url(#moon-fill)" stroke={colors.moonLight} strokeWidth={size.earthOutline} />
      {vector.moonCraters.map((crater) => (
        <circle key={`${crater.x}-${crater.y}`} cx={crater.x} cy={crater.y} r={crater.radius} fill={colors.moonCrater} fillOpacity={crater.opacity} />
      ))}
    </svg>
  );
};

import { theme } from "../theme";

export type EarthProps = {
  centerX: number;
  centerY: number;
  tideOn?: boolean;
  tideAngle?: number;
};

export const Earth: React.FC<EarthProps> = ({
  centerX,
  centerY,
  tideOn = false,
  tideAngle = 0,
}) => {
  const { colors, size, shadow, vector, shapes } = theme;
  const earthLeft = centerX - size.earth / 2;
  const earthTop = centerY - size.earth / 2;

  return (
    <>
      {tideOn && (
        <svg
          aria-label="Dos abultamientos de marea alineados con la Luna"
          width={size.tideMajor + size.tideLobe}
          height={size.tideMajor + size.tideLobe}
          viewBox={vector.tideViewBox}
          style={{
            position: "absolute",
            left: centerX - (size.tideMajor + size.tideLobe) / 2,
            top: centerY - (size.tideMajor + size.tideLobe) / 2,
            transform: `rotate(${tideAngle}rad)`,
          }}
        >
          <ellipse
            rx={size.tideMajor / 2}
            ry={size.tideMinor / 2}
            fill={colors.tide}
            fillOpacity="0.48"
            stroke={colors.tideStroke}
            strokeWidth={size.tideOutline}
          />
          <circle cx={size.tideMajor / 2 - size.tideLobe / 3} cy="0" r={size.tideLobe / 2} fill={colors.tide} fillOpacity="0.48" />
          <circle cx={-size.tideMajor / 2 + size.tideLobe / 3} cy="0" r={size.tideLobe / 2} fill={colors.tide} fillOpacity="0.48" />
        </svg>
      )}
      <svg
        aria-label="Tierra con océanos y continentes"
        width={size.earth}
        height={size.earth}
        viewBox={vector.earthViewBox}
        style={{
          position: "absolute",
          left: earthLeft,
          top: earthTop,
          filter: `drop-shadow(${shadow.earth})`,
        }}
      >
        <defs>
          <radialGradient id="earth-ocean" cx="35%" cy="25%" r="78%">
            <stop offset="0%" stopColor={colors.oceanLight} />
            <stop offset="55%" stopColor={colors.ocean} />
            <stop offset="100%" stopColor={colors.oceanDark} />
          </radialGradient>
          <clipPath id="earth-clip"><circle cx={vector.earthCenter} cy={vector.earthCenter} r={vector.earthRadius} /></clipPath>
        </defs>
        <circle cx={vector.earthCenter} cy={vector.earthCenter} r={vector.earthRadius} fill="url(#earth-ocean)" />
        <g clipPath="url(#earth-clip)" strokeLinejoin="round">
          <path d={shapes.continentA} fill={colors.land} />
          <path d={shapes.continentALight} fill={colors.landLight} />
          <path d={shapes.continentB} fill={colors.landBrown} />
          <path d={shapes.continentC} fill={colors.land} />
          <path d={shapes.continentD} fill={colors.landBrown} />
          <path d={shapes.continentE} fill={colors.landLight} />
          <path d={shapes.continentCLight} fill={colors.landLight} />
        </g>
        <circle cx={vector.earthCenter} cy={vector.earthCenter} r={vector.earthRadius} fill="none" stroke={colors.tideStroke} strokeOpacity="0.7" strokeWidth={size.earthOutline} />
      </svg>
    </>
  );
};

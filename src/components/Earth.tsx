import { theme } from "../theme";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type EarthProps = {
  centerX: number;
  centerY: number;
  tideOn?: boolean;
  tideAngle?: number;
  tideOpacity?: number;
};

export const Earth: React.FC<EarthProps> = ({
  centerX,
  centerY,
  tideOn = false,
  tideAngle = 0,
  tideOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { colors, size, shadow, vector, shapes } = theme;
  const earthLeft = centerX - size.earth / 2;
  const earthTop = centerY - size.earth / 2;
  const wave = Math.sin((frame / fps) * Math.PI * 2 * theme.timing.tideWaveCyclesPerSec) * size.tideWaveAmplitude;
  const rotation = (frame / fps) * theme.timing.earthRotationDegPerSec;

  return (
    <>
      {tideOn && (
        <svg
          aria-label="Dos abultamientos de marea alineados con la Luna"
          width={size.tideCanvas}
          height={size.tideCanvas}
          viewBox={vector.tideViewBox}
          style={{
            position: "absolute",
            left: centerX - size.tideCanvas / 2,
            top: centerY - size.tideCanvas / 2,
            transform: `rotate(${tideAngle}rad)`,
            opacity: tideOpacity,
          }}
        >
          <ellipse
            rx={size.tideMajor / 2 + wave}
            ry={size.tideMinor / 2 - wave / 2}
            fill={colors.tide}
            fillOpacity="0.76"
            stroke={colors.tideStroke}
            strokeWidth={size.tideOutline}
          />
          <circle cx={size.tideMajor / 2 - size.tideLobe / 3 + wave} cy="0" r={size.tideLobe / 2} fill={colors.tide} fillOpacity="0.68" />
          <circle cx={-size.tideMajor / 2 + size.tideLobe / 3 - wave} cy="0" r={size.tideLobe / 2} fill={colors.tide} fillOpacity="0.68" />
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
          <linearGradient id="earth-night" x1="0" x2="1"><stop offset="0%" stopColor={colors.background} stopOpacity="0" /><stop offset="100%" stopColor={colors.background} stopOpacity="0.62" /></linearGradient>
        </defs>
        <circle cx={vector.earthCenter} cy={vector.earthCenter} r={vector.earthRadius} fill="url(#earth-ocean)" />
        <g clipPath="url(#earth-clip)" strokeLinejoin="round" transform={`rotate(${rotation} ${vector.earthCenter} ${vector.earthCenter})`}>
          <path d={shapes.continentA} fill={colors.land} />
          <path d={shapes.continentALight} fill={colors.landLight} />
          <path d={shapes.continentB} fill={colors.landBrown} />
          <path d={shapes.continentC} fill={colors.land} />
          <path d={shapes.continentD} fill={colors.landBrown} />
          <path d={shapes.continentE} fill={colors.landLight} />
          <path d={shapes.continentCLight} fill={colors.landLight} />
        </g>
        <g clipPath="url(#earth-clip)"><rect x={vector.earthCenter} y="0" width={size.earthNightWidth} height={size.earth} fill="url(#earth-night)" /></g>
        <circle cx={vector.earthCenter} cy={vector.earthCenter} r={vector.earthRadius} fill="none" stroke={colors.tideStroke} strokeOpacity="0.9" strokeWidth={size.earthOutline} />
      </svg>
    </>
  );
};

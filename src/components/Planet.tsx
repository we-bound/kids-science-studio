import type { CSSProperties } from "react";

type PlanetProps = {
  name: string;
  size: number;
  color: string;
  shadowColor: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

export const Planet: React.FC<PlanetProps> = ({
  name,
  size,
  color,
  shadowColor,
  style,
  children,
}) => (
  <div
    aria-label={name}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 34% 28%, #ffffff88 0%, ${color} 38%, ${shadowColor} 100%)`,
      boxShadow: `0 22px 0 ${shadowColor}66, 0 30px 60px #132c5270`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

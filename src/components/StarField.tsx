import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

export type StarFieldProps = {
  positions?: readonly (readonly [number, number])[];
};

export const StarField: React.FC<StarFieldProps> = ({ positions = theme.layout.starPositions }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {positions.map(([x, y], index) => (
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute", left: x, top: y,
            width: theme.size.star, height: theme.size.star,
            borderRadius: theme.radius.round,
            background: theme.colors.star,
            opacity: 0.38 + 0.42 * Math.sin(frame / theme.timing.starTwinkleFrames + index) ** 2,
          }}
        />
      ))}
    </>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow } from "../components/Arrow";
import { Caption } from "../components/Caption";
import { Planet } from "../components/Planet";
import { Title } from "../components/Title";

type TidesSceneProps = {
  title: string;
  caption: string;
};

const stars = [
  [170, 320], [340, 720], [540, 300], [1540, 300], [1770, 590],
  [270, 920], [1630, 860], [1170, 270], [680, 840],
];

export const TidesScene: React.FC<TidesSceneProps> = ({ title, caption }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const angle = (frame / durationInFrames) * Math.PI * 2 - Math.PI / 3;
  const moonX = 960 + Math.cos(angle) * 440;
  const moonY = 615 + Math.sin(angle) * 220;
  const orbitOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 65%, #2d81b7 0%, #185385 55%, #123b69 100%)",
        overflow: "hidden",
      }}
    >
      {stars.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: x, top: y, width: 11, height: 11,
            borderRadius: "50%", background: "#fff3ac", opacity: 0.45 + 0.35 * Math.sin(frame / 18 + i) ** 2,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute", left: 520, top: 395, width: 880, height: 440,
          border: "5px dashed #a9dff288", borderRadius: "50%", opacity: orbitOpacity,
        }}
      />
      <div style={{ position: "absolute", left: 800, top: 455 }}>
        <Planet name="Tierra" size={320} color="#31a9ec" shadowColor="#136ab4">
          <div style={{
            width: 220, height: 105, border: "17px solid #7be8f4", borderRadius: "50%",
            transform: `rotate(${angle * 180 / Math.PI}deg)`, opacity: 0.95,
          }} />
        </Planet>
      </div>
      <div style={{ position: "absolute", left: moonX - 72, top: moonY - 72 }}>
        <Planet name="Luna" size={144} color="#d9e2eb" shadowColor="#849aaf">
          <div style={{ position: "absolute", left: 38, top: 44, width: 20, height: 20, borderRadius: "50%", background: "#a9bacb" }} />
          <div style={{ position: "absolute", left: 84, top: 70, width: 27, height: 27, borderRadius: "50%", background: "#a9bacb" }} />
        </Planet>
      </div>
      <div style={{ position: "absolute", left: 570, top: 570, opacity: 0.9 }}><Arrow width={125} /></div>
      <div style={{ position: "absolute", left: 1225, top: 570, opacity: 0.9 }}><Arrow width={125} rotation={180} /></div>
      <Title text={title} />
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

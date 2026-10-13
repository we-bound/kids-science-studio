import { Composition } from "remotion";
import { TidesTest } from "./compositions/TidesTest";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TidesTest"
      component={TidesTest}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

type ArrowProps = {
  color?: string;
  width?: number;
  rotation?: number;
};

export const Arrow: React.FC<ArrowProps> = ({
  color = "#ffcf5a",
  width = 160,
  rotation = 0,
}) => (
  <svg
    width={width}
    height={width / 3}
    viewBox="0 0 160 54"
    style={{ transform: `rotate(${rotation}deg)`, overflow: "visible" }}
    aria-hidden="true"
  >
    <path
      d="M8 27h122m-27-20 27 20-27 20"
      fill="none"
      stroke={color}
      strokeWidth="13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

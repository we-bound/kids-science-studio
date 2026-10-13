export const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: 370,
      right: 370,
      bottom: 70,
      padding: "20px 36px",
      borderRadius: 40,
      backgroundColor: "#ffffff",
      color: "#174d79",
      fontFamily: "Arial, sans-serif",
      fontSize: 42,
      fontWeight: 800,
      textAlign: "center",
      boxShadow: "0 12px 0 #b9e5ef",
    }}
  >
    {text}
  </div>
);

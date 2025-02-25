import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#808080",
  backgroundColor = "#1F2937",
}) => {
  // Calculate dimensions based on size
  const lineWidth = size * 0.1;
  const lineHeight = size * 0.3;
  const centerOffset = size * 0.5;

  // Define styles
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    background: backgroundColor,
    minHeight: "100px",
  };

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
  };

  // Create the spinner lines
  const lines = Array.from({ length: 8 }).map((_, index) => {
    const rotation = index * 45;
    const opacity = 0.1 + index * 0.1;
    const delay = -1.2 + index * 0.15;

    const lineStyle: React.CSSProperties = {
      position: "absolute",
      width: `${lineWidth}px`,
      height: `${lineHeight}px`,
      backgroundColor: color,
      borderRadius: `${lineWidth / 2}px`,
      left: "50%",
      top: "0",
      marginLeft: `-${lineWidth / 2}px`,
      transformOrigin: `${lineWidth / 2}px ${centerOffset}px`,
      transform: `rotate(${rotation}deg)`,
      opacity: opacity,
      animation: "spinner-line-fade 1.2s linear infinite",
      animationDelay: `${delay}s`,
    };

    return <div key={index} style={lineStyle} />;
  });

  return (
    <>
      {/* Define the animation in a style tag */}
      <style>
        {`
          @keyframes spinner-line-fade {
            0%, 100% {
              opacity: 0.1;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={wrapperStyle} role="status" aria-label="Loading">
        {lines}
      </div>
    </>
  );
};

export { Spinner };

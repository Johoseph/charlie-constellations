import { useMemo } from "react";
import { keyframes, styled } from "goober";

const GalaxyWrapper = styled("div")`
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #121251 0, black 100%);
  position: absolute;
  top: 0;
`;

const twinkle = keyframes`
  0%   { opacity: 1; }
  30%  { opacity: 1; }
  70%  { opacity: 0; }
  100% { opacity: 1; }
`;

const Star = styled("div")`
  width: 1px;
  height: 1px;
  border-radius: 2px;
  box-shadow: 0 0 1px 1px white;
  animation: ${twinkle} 3s ease-in-out infinite;
  position: absolute;
`;

export const Galaxy = () => {
  const pointsToStars = () => {
    // Get pos from map
    const markers = Array.from(document.querySelectorAll(".marker-base"));

    return markers.map((marker) => {
      const { top, left, height, width } = marker.getBoundingClientRect();

      return <Star style={{ top: top + height / 2, left: left + width / 2 }} />;
    });
  };

  return <GalaxyWrapper>{pointsToStars()}</GalaxyWrapper>;
};

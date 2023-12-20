import { keyframes, styled } from "goober";
import { points } from "../config/points";

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
`;

export const Galaxy = () => {
  return (
    <GalaxyWrapper>
      {points.map((point) => (
        <Star key={point.day} />
      ))}
    </GalaxyWrapper>
  );
};

import { keyframes, styled } from "goober";

const GalaxyWrapper = styled("div")`
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #121251 0, black 100%);
  position: absolute;
  top: 0;
`;

interface StarProps {
  day: number;
}

const twinkle = (day: number) => keyframes`
  0% { opacity: 1; }
  20% { opacity: ${day % 4 === 0 ? 0.5 : 1}; }
  40% { opacity: ${day % 4 === 1 ? 0.5 : 1}; }
  60% { opacity: ${day % 4 === 2 ? 0.5 : 1}; }
  80% { opacity: ${day % 4 === 3 ? 0.5 : 1}; }
  100% { opacity: 1; }
`;

const Star = styled("div")<StarProps>`
  width: 1px;
  height: 0px;
  border-radius: 2px;
  box-shadow: 0 0 3px ${(props) => (props.day % 2 ? 2 : 3)}px white;
  position: absolute;

  ${(props) =>
    props.day
      ? `animation: ${twinkle(props.day)} 6s ease-in-out infinite;`
      : ""}
`;

export const Galaxy = () => {
  const pointsToStars = () => {
    // Get pos from map
    const markers = Array.from(document.querySelectorAll(".marker-base"));

    return markers.map((marker, index) => {
      const { top, left, height, width } = marker.getBoundingClientRect();

      return (
        <Star
          key={index}
          style={{ top: top + height / 2, left: left + width / 2 }}
          day={index + 1}
        />
      );
    });
  };

  return <GalaxyWrapper>{pointsToStars()}</GalaxyWrapper>;
};

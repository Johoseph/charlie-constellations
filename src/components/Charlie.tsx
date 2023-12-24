import { styled } from "goober";
import charlie from "../assets/charlie.png";

interface CharlieProps {
  showCharlie: boolean;
}

const ImageWrap = styled("img")<{ _opacity: number }>`
  opacity: ${(props) => props._opacity};

  transition: opacity 500ms linear;

  position: absolute;
  pointer-events: none;
  transform: rotate(12deg);
`;

export const Charlie = ({ showCharlie }: CharlieProps) => {
  const positionCharlie = () => {
    // Use top-left (16) point for left/top
    // Use top (16) + bottom (8) point for height
    const star16 = document.querySelector(
      ".c11n-star[data-day='16']"
    ) as HTMLDivElement;
    const star8 = document.querySelector(
      ".c11n-star[data-day='8']"
    ) as HTMLDivElement;

    // Not showing, don't need to calculate yet
    if (!star16 || !star8) return {};

    const { left: star16Left, top: star16Top } = star16.getBoundingClientRect();
    const { top: star8Top } = star8.getBoundingClientRect();

    const height = star8Top - star16Top;

    return {
      left: star16Left - 140,
      top: star16Top,
      height,
    };
  };

  return (
    <ImageWrap
      _opacity={showCharlie ? 1 : 0}
      style={positionCharlie()}
      src={charlie}
    />
  );
};

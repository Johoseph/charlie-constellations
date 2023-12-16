import { styled } from "goober";
import palette from "../config/palette";
import { HoverConfig } from "../types";

const HoverDiv = styled("div")`
  position: absolute;
  z-index: 750;
  font-size: 2rem;
  pointer-events: none;

  left: ${(props: { _left: number; _top: number; _opacity: number }) =>
    props._left}px;
  top: ${(props) => props._top}px;
  opacity: ${(props) => props._opacity};

  transition: opacity ease-in-out 200ms;
`;

export const DayHover = ({ dayHover }: { dayHover: HoverConfig }) => {
  return (
    <HoverDiv
      _left={dayHover.left}
      _top={dayHover.top}
      _opacity={dayHover.showing ? 1 : 0}
      className={`${palette[(dayHover.day - 1) % palette.length]}-text`}
    >
      {dayHover.day}
    </HoverDiv>
  );
};

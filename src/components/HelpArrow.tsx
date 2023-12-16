import { styled } from "goober";
import { useCallback, useEffect, useState } from "react";

const ArrowDiv = styled("div")`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 14px solid #d40028;
  position: absolute;
  z-index: 800;
  pointer-events: none;

  &:after {
    content: "";
    width: 6px;
    height: 16px;
    background-color: #d40028;
    display: block;
    position: relative;
    top: -4px;
    right: 12px;
    transform: rotate(-59deg);
  }
`;

export const HelpArrow = () => {
  const [pointerArrowProps, setPointerArrowProps] = useState({
    top: "0px",
    left: "0px",
    opacity: 0,
    transform: "",
  });

  // Handle help -> point
  const pointToNextPoint = useCallback((event: MouseEvent) => {
    const nextMarkerDiv = document.querySelector(".findable");

    if (nextMarkerDiv) {
      // Next marker position
      const nextMarker = nextMarkerDiv.getBoundingClientRect();

      const nextMarkerX = nextMarker.x + nextMarker.width / 2;
      const nextMarkerY = nextMarker.y + nextMarker.height / 2;

      // Get angle to marker
      const angleToNextMarker =
        (Math.atan2(nextMarkerY - event.clientY, nextMarkerX - event.clientX) *
          180) /
        Math.PI;

      setPointerArrowProps({
        left: `${event.clientX - 5}px`,
        top: `${event.clientY}px`,
        opacity: 1,
        transform: `rotate(${angleToNextMarker}deg)`,
      });

      return;
    }

    setPointerArrowProps({
      left: "0px",
      top: "0px",
      opacity: 0,
      transform: "",
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", pointToNextPoint);
    return () => window.removeEventListener("mousemove", pointToNextPoint);
  }, [pointToNextPoint]);

  return (
    <ArrowDiv
      style={{
        ...pointerArrowProps,
      }}
    />
  );
};

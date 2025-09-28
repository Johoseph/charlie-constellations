import { keyframes, styled } from "goober";
import { JSX } from "react";

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

const Connection = styled("div")`
  height: 0px;
  width: 0px;
  background-color: white;
  box-shadow: 0 0 2px 1px white;
  position: absolute;
  transform-origin: top left;
  transition: width 500ms linear;
`;

// Looks at leaflet marker classlist, and returns c11n marker number tuple
const getC11nMarkerNumber = (marker: Element): [number, number | undefined] => {
  const c11nClass = Array.from(marker.classList).find((className) =>
    className.includes("c11n")
  );

  // Unreachable, unless dev error
  if (!c11nClass) throw new Error("Missing c11n class on marker.");

  // Format is c11n-{number}
  return [
    parseInt(c11nClass.split("-")[1], 10),
    parseInt(c11nClass.split("-")?.[2], 10) || undefined,
  ];
};

export const Galaxy = () => {
  // Generate starts
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
          data-day={index + 1}
          className="c11n-star"
        />
      );
    });
  };

  // Generate constellation lines
  const pointsToLines = () => {
    // Get markers from map, sort by c11n
    const markers = Array.from(document.querySelectorAll(".marker-base")).sort(
      (mrk1, mrk2) => {
        // Format is c11n-{number}
        const [mrk1c11n] = getC11nMarkerNumber(mrk1);
        const [mrk2c11n] = getC11nMarkerNumber(mrk2);

        return mrk1c11n > mrk2c11n ? 1 : -1;
      }
    );

    const lines: JSX.Element[] = [];

    // Create line between current marker AND next(s)
    for (let markerIndex = 0; markerIndex < markers.length; markerIndex++) {
      const targetMarker = markers[markerIndex];
      const [targetMarkerC11n, multiMarkerNo] =
        getC11nMarkerNumber(targetMarker);

      const {
        top: targetTop,
        left: targetLeft,
        height: targetHeight,
        width: targetWidth,
      } = targetMarker.getBoundingClientRect();
      const targetMarkerX = targetLeft + targetWidth / 2;
      const targetMarkerY = targetTop + targetHeight / 2;

      const nextMarkers = markers.filter((marker, nextMarkerIndex) => {
        if (markerIndex + 1 === markers.length) return nextMarkerIndex === 0;

        const [c11n, markerNo] = getC11nMarkerNumber(marker);

        return (
          c11n === targetMarkerC11n + 1 &&
          (!markerNo || !multiMarkerNo || markerNo === multiMarkerNo)
        );
      });

      for (const nextMarker of nextMarkers) {
        const {
          top: nextTop,
          left: nextLeft,
          height: nextHeight,
          width: nextWidth,
        } = nextMarker.getBoundingClientRect();

        const nextMarkerX = nextLeft + nextWidth / 2;
        const nextMarkerY = nextTop + nextHeight / 2;

        // Get angle to next marker
        const angleToNextMarker =
          (Math.atan2(
            nextMarkerY - targetMarkerY,
            nextMarkerX - targetMarkerX
          ) *
            180) /
          Math.PI;

        // Get distance between the points
        const markerDiffX = targetMarkerX - nextMarkerX;
        const markerDiffY = targetMarkerY - nextMarkerY;

        const distanceToTargetMarker = Math.sqrt(
          markerDiffX ** 2 + markerDiffY ** 2
        );

        const line = (
          <Connection
            key={`${targetMarker.className}-${nextMarker.className}`}
            className={"c11n-connection"}
            data-c11n-index={targetMarkerC11n}
            data-c11n-width={distanceToTargetMarker}
            style={{
              top: targetMarkerY,
              left: targetMarkerX,
              transform: `rotate(${angleToNextMarker}deg)`,
            }}
          />
        );

        lines.push(line);
      }
    }

    return lines;
  };

  return (
    <GalaxyWrapper>
      {pointsToStars()}
      {pointsToLines()}
    </GalaxyWrapper>
  );
};

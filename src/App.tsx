import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useState } from "react";
import { styled, setup } from "goober";
import { MapContainer, Marker, Rectangle, TileLayer } from "react-leaflet";
import { DivIcon, LeafletMouseEvent } from "leaflet";
import dayjs from "dayjs";

import { points } from "./config/points";

setup(React.createElement);

const Wrapper = styled("div")`
  height: 100%;
  width: 100%;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 100%;
  width: 100%;
  cursor: crosshair;
`;

const DayHover = styled("div")`
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

const ProgressWrapper = styled("div")`
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  z-index: 800;
  font-size: 1.5rem;
`;

const Counter = styled("div")`
  margin-right: 15px;
  background-color: #13cc4ea6;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
`;

const Help = styled("button")`
  background-color: #13cc4ea6;
  padding: 8px 16px;
  border-radius: 999px;
  outline: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color linear 200ms;

  &:hover {
    background-color: #13cc4ef2;
  }
`;

const palette = ["green1", "red1", "green2", "red2", "green3"];

const day = parseInt(dayjs().format("D"), 10);
const month = parseInt(dayjs().format("M"), 10);
const year = parseInt(dayjs().format("YYYY"), 10);

const currentDay = year > 2023 ? 24 : Math.min(day, 24);

const isAdventOrFuture = year > 2023 || (year === 2023 && month === 12);

const App = () => {
  // Allow font families to load
  const [isLoaded, setIsLoaded] = useState(false);

  // Pointer arrow
  const [isUsingHelp, setIsUsingHelp] = useState(false);
  const [pointerArrowProps, setPointerArrowProps] = useState({
    top: "0px",
    left: "0px",
    opacity: 1,
  });

  const [daysFound, setDaysFound] = useState<number[]>(
    JSON.parse(localStorage.getItem("DAYS_FOUND") ?? "[]")
  );

  const [dayHover, setDayHover] = useState({
    left: 0,
    top: 0,
    day: 0,
    showing: false,
  });

  const handleRectClick = useCallback((day: number) => {
    setDaysFound((prevDay) => {
      const newDaysFound = [...prevDay, day];

      // Set localStorage
      localStorage.setItem("DAYS_FOUND", JSON.stringify(newDaysFound));

      // Set state
      return newDaysFound;
    });
  }, []);

  const handleMarkerHover = useCallback(
    (event: LeafletMouseEvent, day: number) => {
      if (event.type === "mouseover") {
        setDayHover(() => {
          const pointRect = (
            event.originalEvent.target as HTMLDivElement
          ).getBoundingClientRect();

          // Extra padding for 2 digit days
          const leftPad = day.toString().length === 1 ? 30 : 50;

          return {
            left: pointRect.x - leftPad,
            top: pointRect.y - 30,
            day,
            showing: true,
          };
        });
      }

      if (event.type === "mouseout") {
        setDayHover((prev) => ({ ...prev, showing: false }));
      }
    },
    []
  );

  // Loaded on render
  useEffect(() => setIsLoaded(true), []);

  // Handle help -> point
  const pointToNextPoint = useCallback((event: MouseEvent) => {
    const nextMarker = document.querySelector(".findable");

    if (nextMarker) {
      const angleToNextMarker = nextMarker.getBoundingClientRect();

      setPointerArrowProps({
        left: `${event.clientX - 20}px`,
        top: `${event.clientY - 20}px`,
        opacity: 1,
      });
    } else {
      setPointerArrowProps({
        left: `${event.clientX - 20}px`,
        top: `${event.clientY - 20}px`,
        opacity: 0,
      });
    }
  }, []);

  // TODO:
  /* useEffect(() => {
    window.addEventListener("mousemove", pointToNextPoint);
    return () => window.removeEventListener("mousemove", pointToNextPoint);
  }, [pointToNextPoint]); */

  return (
    <Wrapper>
      {/* TODO: Architect correctly, abstract to components */}
      <StyledMapContainer
        center={[-27.43, 153.03]}
        maxBounds={[
          [-27.3, 152.7],
          [-27.6, 153.4],
        ]}
        zoom={12}
        zoomControl={false}
        attributionControl={false}
        minZoom={12}
        maxZoom={18}
        maxBoundsViscosity={1}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {!isAdventOrFuture ? (
          <></>
        ) : (
          points.map((point, index) => {
            if (point.day > currentDay)
              return <React.Fragment key={point.day}></React.Fragment>;

            return (
              <React.Fragment key={point.day}>
                {!daysFound.includes(point.day) ? (
                  <Rectangle
                    className="findable"
                    bounds={[
                      [point.lat + 0.0005, point.lon - 0.0005],
                      [point.lat - 0.0005, point.lon + 0.0005],
                    ]}
                    opacity={0}
                    fillOpacity={0}
                    eventHandlers={{
                      click: () => handleRectClick(point.day),
                    }}
                  />
                ) : (
                  <Marker
                    position={[point.lat, point.lon]}
                    icon={
                      new DivIcon({
                        className: `marker-base ${
                          palette[index % palette.length]
                        }`,
                      })
                    }
                    eventHandlers={{
                      mouseover: (event) => handleMarkerHover(event, point.day),
                      mouseout: (event) => handleMarkerHover(event, point.day),
                    }}
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </StyledMapContainer>
      <DayHover
        _left={dayHover.left}
        _top={dayHover.top}
        _opacity={dayHover.showing ? 1 : 0}
        className={`${palette[(dayHover.day - 1) % palette.length]}-text`}
      >
        {dayHover.day}
      </DayHover>
      {isLoaded && (
        <ProgressWrapper>
          <Counter>
            {daysFound.length} of {isAdventOrFuture ? currentDay : 0}
          </Counter>
          {/* TODO: */}
          {/* <Help onClick={() => setIsUsingHelp((prev) => !prev)}>
            {isUsingHelp ? "🙅‍♂️" : "👁️"}
          </Help> */}
        </ProgressWrapper>
      )}
      {isUsingHelp && (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "20x solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: "20px solid #d40028a6",
            position: "absolute",
            zIndex: 900,
            pointerEvents: "none",
            ...pointerArrowProps,
          }}
        />
      )}
    </Wrapper>
  );
};

export default App;

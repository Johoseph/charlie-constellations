import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useState } from "react";
import { styled, setup } from "goober";

import { Map, DayHover } from "./components";
import { currentDay, isAdventOrFuture } from "./helpers/day";
import { HoverConfig } from "./types";

setup(React.createElement);

const Wrapper = styled("div")`
  height: 100%;
  width: 100%;
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

  const [dayHover, setDayHover] = useState<HoverConfig>({
    left: 0,
    top: 0,
    day: 0,
    showing: false,
  });

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
      <Map
        daysFound={daysFound}
        setDaysFound={setDaysFound}
        setDayHover={setDayHover}
      />
      <DayHover dayHover={dayHover} />
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

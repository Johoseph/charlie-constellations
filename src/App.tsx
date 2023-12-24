import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { Map as MapType } from "leaflet";
import { styled, setup } from "goober";

import { Map, DayHover, HelpArrow, Galaxy } from "./components";
import { currentDay, isAdventOrFuture, isChristmasDay } from "./helpers/day";
import { HoverConfig } from "./types";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "./config/map";

setup(React.createElement);

const Wrapper = styled("div")`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
`;

const ProgressWrapper = styled("div")`
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  z-index: 850;
  font-size: 1.5rem;
`;

const Counter = styled("div")`
  background-color: #13cc4ea6;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
`;

const ProgressButton = styled("button")`
  margin-left: 15px;
  background-color: #13cc4ea6;
  padding: 8px 16px;
  border-radius: 999px;
  outline: none;
  border: none;
  font-size: 2rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color linear 200ms;

  &:hover {
    background-color: #13cc4ef2;
  }
`;

const App = () => {
  const [map, setMap] = useState<MapType | null>(null);
  const [isStarry, setIsStarry] = useState(false);

  // Allow font families to load
  const [isLoaded, setIsLoaded] = useState(false);

  const [isUsingHelp, setIsUsingHelp] = useState(false);

  const [daysFound, setDaysFound] = useState<number[]>(
    JSON.parse(localStorage.getItem("DAYS_FOUND") ?? "[]")
  );

  const [dayHover, setDayHover] = useState<HoverConfig>({
    left: 0,
    top: 0,
    day: 0,
    showing: false,
  });

  const showConstellation = () => {
    const mapContainer: HTMLDivElement | null =
      document.querySelector(".advent-map");

    if (!map || !mapContainer) return;

    // Reset if starry
    if (isStarry) {
      setIsStarry(false);
      mapContainer.style.opacity = "1";
      mapContainer.style.pointerEvents = "unset";
      mapContainer.style.cursor = "crosshair";
      return;
    }

    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    // Fade out map; Fade in constellations
    setTimeout(() => {
      setIsStarry(true);
      mapContainer.style.opacity = "0";
      mapContainer.style.pointerEvents = "none";
      mapContainer.style.cursor = "default";
    }, 250);
  };

  // Loaded on render
  useEffect(() => setIsLoaded(true), []);

  // Turn off help, each time a day is found
  useEffect(() => setIsUsingHelp(false), [daysFound]);

  return (
    <Wrapper>
      <Galaxy />
      <Map
        daysFound={daysFound}
        isUsingHelp={isUsingHelp}
        isStarry={isStarry}
        setDaysFound={setDaysFound}
        setDayHover={setDayHover}
        setMap={setMap}
      />
      <DayHover dayHover={dayHover} />
      {isLoaded && (
        <ProgressWrapper>
          <Counter>
            {daysFound.length} of {isAdventOrFuture ? currentDay : 0}
          </Counter>
          <ProgressButton
            onClick={() => setIsUsingHelp((prev) => !prev)}
            disabled={daysFound.length === currentDay}
          >
            {isUsingHelp ? "🙅‍♂️" : "👁️"}
          </ProgressButton>
          {currentDay === 24 && daysFound.length === currentDay && (
            <ProgressButton onClick={showConstellation}>
              {isStarry ? "🌏" : "💫"}
            </ProgressButton>
          )}
          {currentDay === 24 && daysFound.length === currentDay && isStarry && (
            <ProgressButton
              onClick={showConstellation}
              disabled={!isChristmasDay}
              style={{ fontSize: "1.5rem" }}
            >
              25
            </ProgressButton>
          )}
        </ProgressWrapper>
      )}
      {isUsingHelp && <HelpArrow />}
    </Wrapper>
  );
};

export default App;

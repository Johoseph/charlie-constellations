import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { Map as MapType } from "leaflet";
import { styled, setup } from "goober";

import { Map, DayHover, HelpArrow, Galaxy } from "./components";
import { currentDay, isAdventOrFuture } from "./helpers/day";
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
  cursor: pointer;
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
      return;
    }

    setIsStarry(true);
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    // Fade out map; Fade in constellations
    setTimeout(() => (mapContainer.style.opacity = "0"), 250);
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
        setDaysFound={setDaysFound}
        setDayHover={setDayHover}
        isUsingHelp={isUsingHelp}
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
            <ProgressButton onClick={showConstellation}>💫</ProgressButton>
          )}
        </ProgressWrapper>
      )}
      {isUsingHelp && <HelpArrow />}
    </Wrapper>
  );
};

export default App;

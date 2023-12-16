import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { styled, setup } from "goober";

import { Map, DayHover, HelpArrow } from "./components";
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
  z-index: 850;
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

  // Loaded on render
  useEffect(() => setIsLoaded(true), []);

  // Turn off help, each time a day is found
  useEffect(() => setIsUsingHelp(false), [daysFound]);

  return (
    <Wrapper>
      <Map
        daysFound={daysFound}
        setDaysFound={setDaysFound}
        setDayHover={setDayHover}
        isUsingHelp={isUsingHelp}
      />
      <DayHover dayHover={dayHover} />
      {isLoaded && (
        <ProgressWrapper>
          <Counter>
            {daysFound.length} of {isAdventOrFuture ? currentDay : 0}
          </Counter>
          <Help
            onClick={() => setIsUsingHelp((prev) => !prev)}
            disabled={daysFound.length === currentDay}
          >
            {isUsingHelp ? "🙅‍♂️" : "👁️"}
          </Help>
        </ProgressWrapper>
      )}
      {isUsingHelp && <HelpArrow />}
    </Wrapper>
  );
};

export default App;

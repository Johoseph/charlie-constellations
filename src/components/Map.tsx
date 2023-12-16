import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect } from "react";
import { styled } from "goober";
import { MapContainer, Marker, Rectangle, TileLayer } from "react-leaflet";
import { DivIcon, LeafletMouseEvent } from "leaflet";

import { points } from "../config/points";
import palette from "../config/palette";
import { currentDay, isAdventOrFuture } from "../helpers/day";
import { HoverConfig } from "../types";

const StyledMapContainer = styled(MapContainer)`
  height: 100%;
  width: 100%;
`;

interface MapProps {
  daysFound: number[];
  setDaysFound: React.Dispatch<React.SetStateAction<number[]>>;
  setDayHover: React.Dispatch<React.SetStateAction<HoverConfig>>;
  isUsingHelp: boolean;
}

export const Map = ({
  daysFound,
  setDaysFound,
  setDayHover,
  isUsingHelp,
}: MapProps) => {
  const handleRectClick = useCallback(
    (day: number) => {
      setDaysFound((prevDay) => {
        const newDaysFound = [...prevDay, day];

        // Set localStorage
        localStorage.setItem("DAYS_FOUND", JSON.stringify(newDaysFound));

        // Set state
        return newDaysFound;
      });
    },
    [setDaysFound]
  );

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
    [setDayHover]
  );

  useEffect(() => {
    // Leaflet map does not accept new style props on re-render - use document methods to force update
    const mapContainer: HTMLDivElement | null =
      document.querySelector(".advent-map");

    if (mapContainer)
      mapContainer.style.cursor = isUsingHelp ? "none" : "crosshair";
  }, [isUsingHelp]);

  return (
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
      className="advent-map"
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
  );
};

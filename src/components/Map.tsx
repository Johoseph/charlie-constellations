import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect } from "react";
import { MapContainer, Marker, Rectangle, TileLayer } from "react-leaflet";
import { DivIcon, LeafletMouseEvent, Map as MapType } from "leaflet";

import { points } from "../config/points";
import palette from "../config/palette";
import { currentDay, isAdventOrFuture } from "../helpers/day";
import { HoverConfig } from "../types";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../config/map";

interface MapProps {
  daysFound: number[];
  setDaysFound: React.Dispatch<React.SetStateAction<number[]>>;
  setDayHover: React.Dispatch<React.SetStateAction<HoverConfig>>;
  isUsingHelp: boolean;
  setMap: React.Dispatch<React.SetStateAction<MapType | null>>;
  isStarry: boolean;
}

export const Map = ({
  daysFound,
  setDaysFound,
  setDayHover,
  isUsingHelp,
  setMap,
  isStarry,
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
      if (isStarry) return;

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
    [setDayHover, isStarry]
  );

  useEffect(() => {
    // Leaflet map does not accept new style props on re-render - use document methods to force update
    const mapContainer: HTMLDivElement | null =
      document.querySelector(".advent-map");

    if (mapContainer)
      mapContainer.style.cursor = isUsingHelp ? "none" : "crosshair";
  }, [isUsingHelp]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      maxBounds={[
        [-27.3, 152.7],
        [-27.6, 153.4],
      ]}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      minZoom={12}
      maxZoom={18}
      maxBoundsViscosity={1}
      className="advent-map"
      ref={setMap}
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
    </MapContainer>
  );
};

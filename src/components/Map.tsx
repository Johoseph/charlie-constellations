import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect } from "react";
import { MapContainer, Marker, Rectangle, TileLayer } from "react-leaflet";
import { DivIcon, LeafletMouseEvent, Map as MapType } from "leaflet";

import { points } from "../config/points";
import palette from "../config/palette";
import { currentDay, isAdventOrFuture } from "../helpers/day";
import { HoverConfig } from "../types";
import {
  DEFAULT_CENTER,
  DEFAULT_LATITUDE_CENTER,
  DEFAULT_LONGITUDE_CENTER,
  DEFAULT_ZOOM,
} from "../config/map";

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
        [
          parseFloat((DEFAULT_LATITUDE_CENTER + 0.15).toFixed(1)),
          parseFloat((DEFAULT_LONGITUDE_CENTER - 0.3).toFixed(1)),
        ],
        [
          parseFloat((DEFAULT_LATITUDE_CENTER - 0.15).toFixed(1)),
          parseFloat((DEFAULT_LONGITUDE_CENTER + 0.3).toFixed(1)),
        ],
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

          const lat = DEFAULT_LATITUDE_CENTER + point.latOffset;
          const lon = DEFAULT_LONGITUDE_CENTER + point.lonOffset;

          return (
            <React.Fragment key={point.day}>
              {!daysFound.includes(point.day) ? (
                <Rectangle
                  className="findable"
                  bounds={[
                    [lat + 0.0005, lon - 0.0005],
                    [lat - 0.0005, lon + 0.0005],
                  ]}
                  opacity={0}
                  fillOpacity={0}
                  eventHandlers={{
                    click: () => handleRectClick(point.day),
                  }}
                />
              ) : (
                <Marker
                  position={[lat, lon]}
                  icon={
                    new DivIcon({
                      className: `marker-base ${
                        palette[index % palette.length]
                      } c11n-${point.c11n}`,
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

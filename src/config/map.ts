import { LatLngTuple } from "leaflet";

export const DEFAULT_LATITUDE_CENTER = parseFloat(
  import.meta.env.VITE_LATITUDE_CENTER
);
export const DEFAULT_LONGITUDE_CENTER = parseFloat(
  import.meta.env.VITE_LONGITUDE_CENTER
);
export const DEFAULT_CENTER: LatLngTuple = [
  DEFAULT_LATITUDE_CENTER,
  DEFAULT_LONGITUDE_CENTER,
];
export const DEFAULT_ZOOM = 12;

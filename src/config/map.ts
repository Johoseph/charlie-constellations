import { LatLngTuple } from "leaflet";

export const DEFAULT_CENTER: LatLngTuple = [
  import.meta.env.VITE_LATITUDE_CENTER,
  import.meta.env.VITE_LONGITUDE_CENTER,
];
export const DEFAULT_ZOOM = 12;

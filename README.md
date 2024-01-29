# Charlie Constellation 💫💫

[Charlie Constellation](https://charlie-constellations.vercel.app/) is a 2023 Advent Calendar made for my partner Flick. This project was built using Vite's React Typescript template, and relies heavily on the [leaflet](https://leafletjs.com/) mapping library.

Each day of advent, Flick was given a physical photo clue that correlated to a specific coordinate on the map. Finding all 24 points creates a 'constellation', which on Christmas day unlocks becomes animates and reveals our dog Charlie!

![charlie constellations gif](https://github.com/Johoseph/charlie-constellations/assets/49534136/8cfeaa84-5db2-469f-8c82-aa7622c717cb)

## Having a look yourself 👀

Environment variables have been used to de-identify my exact location, use the example file if you would like to test this out! Found points are tracked via the `DAYS_FOUND` key in `localStorage`, set this to a stringified array 1-24 to skip to the end (e.g. `"[1,2,3...]"`).

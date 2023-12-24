import dayjs from "dayjs";

const day = parseInt(dayjs().format("D"), 10);
const month = parseInt(dayjs().format("M"), 10);
const year = parseInt(dayjs().format("YYYY"), 10);

const currentDay = year > 2023 ? 24 : Math.min(day, 24);
const isChristmasDay = year > 2023 ? 25 : Math.min(day, 25) === 25;
const isAdventOrFuture = year > 2023 || (year === 2023 && month === 12);

export { currentDay, isChristmasDay, isAdventOrFuture };

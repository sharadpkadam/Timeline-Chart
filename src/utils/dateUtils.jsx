import { startOfMonth, startOfWeek, addDays, parseISO, isWithinInterval } from "date-fns";

export const getDateRange = (view, currentDate) => {
  const start = {
    month: startOfMonth(currentDate),
    "2-week": addDays(currentDate, -7),
    "1-week": startOfWeek(currentDate),
    "2-day": addDays(currentDate, -1),
    "1-day": currentDate,
  }[view];

  const end = addDays(start, {
    month: 30,
    "2-week": 14,
    "1-week": 7,
    "2-day": 2,
    "1-day": 1,
  }[view]);

  return { start, end };
};

export const filterEventsByView = (events, currentDate, view) => {
  const { start, end } = getDateRange(view, currentDate);
  return events.filter((event) =>
    isWithinInterval(parseISO(event.start), { start, end })
  );
};

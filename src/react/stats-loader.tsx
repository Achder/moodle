import { Chart } from "./chart";
import { format, addDays, subMonths, subWeeks, subYears } from "date-fns";
import React from "react";
import { db, type Rating } from "../utils/db";

export function StatsLoader() {
  const [lastWeek, setLastWeek] = React.useState<Rating[]>([]);
  const [secondLastWeek, setSecondLastWeek] = React.useState<Rating[]>([]);
  const [lastMonth, setLastMonth] = React.useState<Rating[]>([]);
  const [secondLastMonth, setSecondLastMonth] = React.useState<Rating[]>([]);
  const [lastYear, setLastYear] = React.useState<Rating[]>([]);
  const [secondLastYear, setSecondLastYear] = React.useState<Rating[]>([]);

  function formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  // helper: given DB results and a start/end date, return one entry per day
  function fillMissingDates(
    ratings: Rating[],
    startFormatted: string,
    endFormatted: string
  ): Rating[] {
    const map = Object.fromEntries(ratings.map((r) => [r.date, r]));
    const results: Rating[] = [];
    let cur = new Date(startFormatted);
    const end = new Date(endFormatted);
    while (cur <= end) {
      const d = formatDate(cur);
      if (map[d]) {
        results.push(map[d]);
      } else {
        // create an "empty" rating for missing dates (rating null)
        results.push({ date: d, rating: null } as Rating);
      }
      cur = addDays(cur, 1);
    }
    return results;
  }

  React.useEffect(() => {
    const load = async () => {
      const today = new Date();
      const todayFormatted = formatDate(today);
      const oneWeekAgo = formatDate(subWeeks(today, 1));
      const twoWeekAgo = formatDate(subWeeks(today, 2));
      const oneMonthAgo = formatDate(subMonths(today, 1));
      const twoMonthAgo = formatDate(subMonths(today, 2));
      const oneYearAgo = formatDate(subYears(today, 1));
      const twoYearAgo = formatDate(subYears(today, 2));

      // fetch raw data, then fill gaps
      const rawLastWeek = await db.ratings
        .where("date")
        .between(oneWeekAgo, todayFormatted, true, true)
        .toArray();

      const rawSecondLastWeek = await db.ratings
        .where("date")
        .between(twoWeekAgo, oneWeekAgo, true, true)
        .toArray();

      const rawLastMonth = await db.ratings
        .where("date")
        .between(oneMonthAgo, todayFormatted, true, true)
        .toArray();
      const rawSecondLastMonth = await db.ratings
        .where("date")
        .between(twoMonthAgo, oneMonthAgo, true, true)
        .toArray();

      const rawLastYear = await db.ratings
        .where("date")
        .between(oneYearAgo, todayFormatted, true, true)
        .toArray();
      const rawSecondLastYear = await db.ratings
        .where("date")
        .between(twoYearAgo, oneYearAgo, true, true)
        .toArray();

      setLastWeek(fillMissingDates(rawLastWeek, oneWeekAgo, todayFormatted));
      setSecondLastWeek(
        fillMissingDates(rawSecondLastWeek, twoWeekAgo, oneWeekAgo)
      );
      setLastMonth(fillMissingDates(rawLastMonth, oneMonthAgo, todayFormatted));
      setSecondLastMonth(
        fillMissingDates(rawSecondLastMonth, twoMonthAgo, oneMonthAgo)
      );
      setLastYear(fillMissingDates(rawLastYear, oneYearAgo, todayFormatted));
      setSecondLastYear(
        fillMissingDates(rawSecondLastYear, twoYearAgo, oneYearAgo)
      );
    };

    load();
  }, []);

  return (
    <>
      <Chart
        label="Last week"
        curRatings={lastWeek}
        prevRatings={secondLastWeek}
      />
      <Chart
        label="Last month"
        curRatings={lastMonth}
        prevRatings={secondLastMonth}
      />
      <Chart
        label="Last year"
        curRatings={lastYear}
        prevRatings={secondLastYear}
      />
    </>
  );
}

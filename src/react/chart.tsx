import React from "react";
import { Stat } from "./stat";
import { Chart as Chartjs, registerables } from "chart.js";
import type { Rating } from "../utils/db";
import { getCssColor } from "../utils/color";
import { format } from "date-fns";

Chartjs.register(...registerables);

type Props = React.ComponentProps<"canvas"> & {
  label: string;
  curRatings: Rating[];
  prevRatings: Rating[];
};

export function Chart(props: Props) {
  const { label, className, curRatings, prevRatings, ...canvasProps } = props;

  console.log(curRatings, prevRatings);
  const chartRef = React.useRef<Chartjs | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  function getAverage(ratings: Rating[]) {
    if (ratings.length === 0) {
      return 0;
    }

    let total = 0;
    for (const r of ratings) {
      if (r.rating === null) {
        continue;
      }

      total += r.rating;
    }

    return total / ratings.length;
  }

  function getTrend(thisPeriod: Rating[], previousPeriod: Rating[]) {
    const averageThis = getAverage(thisPeriod);
    const averagePrevious = getAverage(previousPeriod);

    if (averagePrevious === 0 || averageThis === 0) {
      return "0%";
    }

    // percent change
    const percent = ((averageThis - averagePrevious) / averagePrevious) * 100;
    return `${percent.toFixed(0)}%`;
  }

  const average = React.useMemo(() => {
    return getAverage(curRatings);
  }, [curRatings]);

  const trend = React.useMemo(() => {
    return getTrend(curRatings, prevRatings);
  }, [curRatings, prevRatings]);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const chart = chartRef.current;
    if (chart) {
      chart.destroy();
    }

    const labels = curRatings.map((r) => format(r.date, "dd.MM.yy"));
    const ratingValues = curRatings.map((r) => r.rating ?? 0);

    console.log(ratingValues);

    const dark = getCssColor("--color-dark").toString();
    chartRef.current = new Chartjs<"bar", number[]>(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Rating",
            data: ratingValues,
            backgroundColor: dark,
          },
        ],
      },
      options: {
        aspectRatio: 1.5 / 1,
        layout: {
          padding: {
            top: 32,
            left: 0,
            right: 0,
            bottom: 12,
          },
        },
        indexAxis: "x",
        animations: {
          // kill horizontal stuff explicitly
          x: {
            duration: 0,
          },
          y: {
            duration: 0,
          },

          // redefine the default numeric group so it DOES NOT include x/width
          numbers: {
            type: "number",
            properties: ["y", "base"], // only grow vertically
            duration: 800,
            easing: "easeOutCubic",
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              color: dark,
              lineWidth: 1,
              tickWidth: 1,
            },
            ticks: {
              color: dark,
            },
            border: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 10,
            grid: {
              color: dark,
              lineWidth: 1,
            },
            ticks: {
              stepSize: 1,
              display: false,
            },
            border: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }, [curRatings, prevRatings]);

  return (
    <label
      className={`grid grid-cols-[minmax(0,1fr)] gap-8 text-shadow-md ${className}`}
    >
      <div>
        <p className="text-5xl text-center">{label}</p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-4">
          <Stat
            data-element="average"
            label="Average"
            content={average.toFixed(1)}
          />
          <Stat data-element="trend" label="Trend" content={trend} />
        </div>
        <canvas
          {...canvasProps}
          className="rounded-sm w-full"
          ref={canvasRef}
        ></canvas>
      </div>
    </label>
  );
}

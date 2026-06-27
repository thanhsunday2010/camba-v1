"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

const ChartContext = React.createContext<{ config: ChartConfig }>({ config: {} });

export function ChartContainer({
  id,
  className,
  children,
  config,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  config: ChartConfig;
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={id}
        className={cn(
          "flex aspect-auto justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-gray-500 [&_.recharts-cartesian-grid_line]:stroke-gray-200",
          className
        )}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export {
  RechartsPrimitive as Recharts,
  ChartContext,
};

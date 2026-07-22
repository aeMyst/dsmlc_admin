"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND, BRAND_HOVER } from "@/lib/palette";

interface Props {
  data: { label: string; rsvp: number; attended: number; atDoor?: number }[];
}

export function RsvpTurnoutChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4}>
        <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={12} />
        <YAxis
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          labelStyle={{ color: "#fff" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
        />
        <Bar
          dataKey="rsvp"
          name="RSVP"
          fill="rgba(255,255,255,0.15)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="attended"
          name="Attended"
          fill={BRAND}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="atDoor"
          name="At-door"
          fill={BRAND_HOVER}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

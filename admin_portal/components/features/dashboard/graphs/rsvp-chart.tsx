"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND, BRAND_LIGHT, NEUTRAL_BAR } from "@/lib/palette";

interface Props {
  data: { label: string; rsvp: number; attended: number; atDoor?: number }[];
}

function truncateLabel(label: string, max = 14) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function RsvpTurnoutChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={4} margin={{ bottom: 24 }}>
        <CartesianGrid
          stroke="#1c1c1c"
          strokeDasharray="3 4"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          stroke="#5f5f5f"
          fontSize={12}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
          tickFormatter={(value: string) => truncateLabel(value)}
        />
        <YAxis stroke="#5f5f5f" fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #262626",
            borderRadius: 10,
          }}
          labelStyle={{ color: "#f2f2f2" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#9a9a9a" }} />
        <Bar
          dataKey="rsvp"
          name="RSVP"
          fill={NEUTRAL_BAR}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="attended"
          name="Attended"
          fill={BRAND}
          radius={[4, 4, 0, 0]}
          style={{ filter: "drop-shadow(0 0 6px rgba(255,90,46,0.4))" }}
        />
        <Bar
          dataKey="atDoor"
          name="At-door"
          fill={BRAND_LIGHT}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND } from "@/lib/palette";

interface Props {
  data: { month: string; cumulativeMembers: number; newMembers: number }[];
}

function formatMonthLabel(month: string) {
  return new Date(`${month}-01`).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

export function MemberGrowthChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    monthLabel: formatMonthLabel(d.month),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="monthLabel"
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
        />
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
          formatter={(value) => [`${value}`, "Total members"]}
        />
        <Line
          type="monotone"
          dataKey="cumulativeMembers"
          stroke={BRAND}
          strokeWidth={2}
          dot={{ r: 3, fill: BRAND }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

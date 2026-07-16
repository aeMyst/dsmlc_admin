"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: { date: string; attended: number; label: string }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function AttendanceLineChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, dateLabel: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="dateLabel"
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
          formatter={(value) => [`${value}`, "Attended"]}
        />
        <Line
          type="monotone"
          dataKey="attended"
          stroke="#F86306"
          strokeWidth={2}
          dot={{ r: 3, fill: "#F86306" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

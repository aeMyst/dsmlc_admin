"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND } from "@/lib/palette";
import { formatDate } from "@/lib/date";

interface Props {
  data: { date: string; cumulativeMembers: number; newMembers: number }[];
}

export function MemberGrowthChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="members-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="#1c1c1c"
          strokeDasharray="3 4"
          vertical={false}
        />
        <XAxis dataKey="dateLabel" stroke="#5f5f5f" fontSize={12} />
        <YAxis stroke="#5f5f5f" fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #262626",
            borderRadius: 10,
          }}
          labelStyle={{ color: "#f2f2f2" }}
          formatter={(value) => [`${value}`, "Total members"]}
        />
        <Area
          type="monotone"
          dataKey="cumulativeMembers"
          stroke={BRAND}
          strokeWidth={2}
          fill="url(#members-fill)"
          dot={{ r: 3.5, fill: BRAND, stroke: "#0a0a0a", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

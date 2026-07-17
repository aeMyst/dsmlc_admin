"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: { source: string; count: number }[];
}

export function SignupSourceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <XAxis
          type="number"
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
          allowDecimals={false}
        />
        <YAxis
          dataKey="source"
          type="category"
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
          width={90}
        />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          labelStyle={{ color: "#fff" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="count" fill="#F86306" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

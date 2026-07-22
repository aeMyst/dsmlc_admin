"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND } from "@/lib/palette";

interface RetentionGroup {
  total: number;
  attended: number;
  rate: number;
}

interface CourseRetentionChartProps {
  courseGroup: RetentionGroup;
  generalGroup: RetentionGroup;
}

export function CourseRetentionChart({
  courseGroup,
  generalGroup,
}: CourseRetentionChartProps) {
  const data = [
    {
      name: "Course collab",
      rate: courseGroup.rate,
      total: courseGroup.total,
      attended: courseGroup.attended,
    },
    {
      name: "General",
      rate: generalGroup.rate,
      total: generalGroup.total,
      attended: generalGroup.attended,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 48 }}>
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
          unit="%"
        />
        <YAxis
          dataKey="name"
          type="category"
          stroke="rgba(255,255,255,0.4)"
          fontSize={12}
          width={100}
        />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          labelStyle={{ color: "#fff" }}
          formatter={(value) => [`${value}%`, "Attendance rate"]}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="rate" fill={BRAND} radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="rate"
            position="right"
            formatter={(v) => `${v}%`}
            fill="rgba(255,255,255,0.7)"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

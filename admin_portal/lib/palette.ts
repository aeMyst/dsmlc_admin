export const CATEGORY_COLORS = [
  "#F86306", // primary orange
  "#FF914D", // light orange
  "#FDBA74", // pale orange
  "#C2410C", // burnt orange
  "#FFD7B0", // cream orange
  "#7C2D12", // deep rust
] as const

export function colorForIndex(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}
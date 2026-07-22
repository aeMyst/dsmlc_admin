export const BRAND = "#F86306"
export const BRAND_HOVER = "#FF914D"

export const CATEGORY_COLORS = [
  BRAND, // primary orange
  BRAND_HOVER, // light orange
  "#FDBA74", // pale orange
  "#C2410C", // burnt orange
  "#FFD7B0", // cream orange
  "#7C2D12", // deep rust
] as const

export function colorForIndex(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}
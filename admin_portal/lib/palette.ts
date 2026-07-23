export const BRAND = "#ff5a2e"
export const BRAND_DEEP = "#d43a13"
export const BRAND_LIGHT = "#ffb08e"
export const BLUE = "#5b8dee"
export const NEUTRAL_BAR = "#2c2c2c"

export const BRAND_HOVER = BRAND_LIGHT

export function categoryColor(category: string): string {
  switch (category) {
    case "Competition":
      return BRAND
    case "Social":
    case "Workshop":
      return BLUE
    default:
      return BLUE
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "attended":
      return BRAND
    case "at-door":
      return BLUE
    default:
      return "#9a9a9a"
  }
}

const INDEX_COLORS = [BRAND, BLUE, BRAND_LIGHT, "#8a8a8a", BRAND_DEEP, "#c0c0c0"]

export function colorForIndex(index: number): string {
  return INDEX_COLORS[index % INDEX_COLORS.length]
}

export function barGradient(base: string): string {
  return base === BRAND
    ? "linear-gradient(90deg, #ff5a2e, #ff8a5c)"
    : `linear-gradient(90deg, ${base}, ${base}cc)`
}
import type { Margin } from "../../types/Margin"

type MarginSide = "top" | "right" | "bottom" | "left"

export const getMargin = (
    margin: Margin | undefined,
    side: MarginSide,
): number => {
    if (!margin) return 0
    if (typeof margin === "number") return margin
    return margin[side] ?? 0
}

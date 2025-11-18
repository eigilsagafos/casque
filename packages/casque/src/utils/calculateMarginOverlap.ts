import type { Margin } from "../../types/Margin"
import { getMargin } from "./getMargin"

type Axis = "horizontal" | "vertical"

/**
 * Calculate overlapping margin between two items.
 * Margins collapse - we use the maximum, not the sum.
 *
 * @param firstMargin - Margin of the first item (left/top item)
 * @param secondMargin - Margin of the second item (right/bottom item)
 * @param axis - "horizontal" for left-right spacing, "vertical" for top-bottom spacing
 */
export const calculateMarginOverlap = (
    firstMargin: Margin | undefined,
    secondMargin: Margin | undefined,
    axis: Axis,
): number => {
    const firstSide = axis === "horizontal" ? "right" : "bottom"
    const secondSide = axis === "horizontal" ? "left" : "top"

    const margin1 = getMargin(firstMargin, firstSide)
    const margin2 = getMargin(secondMargin, secondSide)

    // Margins overlap - use max, not sum
    return Math.max(margin1, margin2)
}

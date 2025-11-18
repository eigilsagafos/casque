import type { Anchor } from "../../types/Anchor"

type Axis = "horizontal" | "vertical"
type Direction = "incoming" | "outgoing"

/**
 * Extract the anchor value for a given axis and direction.
 *
 * For rows (horizontal axis):
 * - "y" anchor represents the Y position
 * - Can be a single number or [top, bottom] tuple
 *
 * For columns (vertical axis):
 * - "x" anchor represents the X position
 * - Can be a single number or [left, right] tuple
 *
 * @param anchor - The anchor object
 * @param axis - "horizontal" for rows, "vertical" for columns
 * @param direction - "incoming" (first item) or "outgoing" (last item) - required for tuple anchors
 */
export const getAnchorValue = (
    anchor: Anchor | undefined,
    axis: Axis,
    direction?: Direction,
): number => {
    if (!anchor) return 0

    if (axis === "horizontal") {
        // For rows, we want Y position
        if ("y" in anchor) {
            const yValue = anchor.y
            if (Array.isArray(yValue)) {
                // [top, bottom] tuple
                if (direction === "incoming") return yValue[0]
                if (direction === "outgoing") return yValue[1]
                throw new Error(
                    "Anchor object requires direction parameter (incoming/outgoing) for tuple anchors",
                )
            }
            return yValue
        }
        // Fallback: also check x in case of nested structure
        if ("x" in anchor) {
            const xValue = anchor.x
            return Array.isArray(xValue) ? xValue[0] : xValue
        }
    } else {
        // For columns, we want X position
        if ("x" in anchor) {
            const xValue = anchor.x
            if (Array.isArray(xValue)) {
                // [left, right] tuple
                if (direction === "incoming") return xValue[0]
                if (direction === "outgoing") return xValue[1]
                throw new Error(
                    "Anchor object requires direction parameter (incoming/outgoing) for tuple anchors",
                )
            }
            return xValue
        }
        // Fallback: also check y in case of nested structure
        if ("y" in anchor) {
            const yValue = anchor.y
            return Array.isArray(yValue) ? yValue[0] : yValue
        }
    }

    return 0
}

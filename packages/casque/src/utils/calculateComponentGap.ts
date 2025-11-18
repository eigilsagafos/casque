import type { Component } from "../../types/Component"
import { calculateMarginOverlap } from "./calculateMarginOverlap"

type Axis = "horizontal" | "vertical"

/**
 * Calculate minimum gap between two components using Tetris-style collision detection.
 * Returns the absolute position where the second component should start.
 *
 * Elements within components have positions relative to their component.
 * This function checks which elements would collide and calculates the minimum
 * component position needed to avoid overlap while respecting margin collapse.
 *
 * @param firstComponent - The first component (left for horizontal, top for vertical)
 * @param secondComponent - The second component (right for horizontal, bottom for vertical)
 * @param axis - "horizontal" for left-right layout (row), "vertical" for top-bottom layout (column)
 * @param existingOffset - Offset already applied to existing component elements (for anchor alignment)
 * @param newItemOffset - Offset to be applied to new component elements (for anchor alignment)
 * @returns The absolute position where secondComponent should start to avoid collisions
 */
export const calculateComponentGap = (
    firstComponent: Component,
    secondComponent: Component,
    axis: Axis,
    existingOffset: number = 0,
    newItemOffset: number = 0,
): number => {
    if (
        firstComponent.elements.length === 0 ||
        secondComponent.elements.length === 0
    ) {
        return 0
    }

    let minComponentStart = 0

    if (axis === "horizontal") {
        // Horizontal layout (row): check vertical overlap, calculate horizontal gap
        for (const rightEl of secondComponent.elements) {
            // Check vertical overlap WITHOUT margins
            // Apply the newItemOffset to get the adjusted position
            const rightTop = rightEl.y + newItemOffset
            const rightBottom = rightEl.y + newItemOffset + rightEl.h

            for (const leftEl of firstComponent.elements) {
                // Apply the existingOffset to get the adjusted position
                const leftTop = leftEl.y + existingOffset
                const leftBottom = leftEl.y + existingOffset + leftEl.h

                // Check if elements overlap vertically
                const verticalOverlap =
                    leftBottom > rightTop && leftTop < rightBottom

                if (verticalOverlap) {
                    // Calculate where the right component needs to start
                    // leftEl ends at: leftEl.x + leftEl.w
                    // rightEl starts at: rightEl.x (relative to component)
                    // marginGap: collapsed margin between them
                    // Component position: leftEnd + marginGap - rightEl.x
                    const leftEnd = leftEl.x + leftEl.w
                    const marginGap = calculateMarginOverlap(
                        leftEl.margin,
                        rightEl.margin,
                        "horizontal",
                    )
                    const componentStartPosition =
                        leftEnd + marginGap - rightEl.x
                    minComponentStart = Math.max(
                        minComponentStart,
                        componentStartPosition,
                    )
                }
            }
        }
    } else {
        // Vertical layout (column): check horizontal overlap, calculate vertical gap
        // For columns, offset is on X axis (secondary), so we DO apply it for overlap check
        for (const bottomEl of secondComponent.elements) {
            // Check horizontal overlap WITHOUT margins
            // Apply the newItemOffset to get the adjusted position
            const bottomLeft = bottomEl.x + newItemOffset
            const bottomRight = bottomEl.x + newItemOffset + bottomEl.w

            for (const topEl of firstComponent.elements) {
                // Apply the existingOffset to get the adjusted position
                const topLeft = topEl.x + existingOffset
                const topRight = topEl.x + existingOffset + topEl.w

                // Check if elements overlap horizontally
                const horizontalOverlap =
                    topRight > bottomLeft && topLeft < bottomRight

                if (horizontalOverlap) {
                    // Calculate where the bottom component needs to start
                    // topEl ends at: topEl.y + topEl.h
                    // bottomEl starts at: bottomEl.y (relative to component)
                    // marginGap: collapsed margin between them
                    // Component position: topEnd + marginGap - bottomEl.y
                    const topEnd = topEl.y + topEl.h
                    const marginGap = calculateMarginOverlap(
                        topEl.margin,
                        bottomEl.margin,
                        "vertical",
                    )
                    const componentStartPosition =
                        topEnd + marginGap - bottomEl.y
                    minComponentStart = Math.max(
                        minComponentStart,
                        componentStartPosition,
                    )
                }
            }
        }
    }

    return minComponentStart
}

import type { Component } from "../../types/Component"
import type { Element } from "../../types/Element"
import { getAnchorValue } from "./getAnchorValue"

type Axis = "horizontal" | "vertical"
type RowAlignment = "top" | "center" | "bottom" | "anchor"
type ColumnAlignment = "left" | "center" | "right" | "anchor"
type Alignment = RowAlignment | ColumnAlignment

/**
 * Calculate alignment offsets for positioning items within a layout.
 *
 * @param item - The item being added
 * @param component - The accumulated component so far
 * @param align - The alignment strategy
 * @param axis - "horizontal" for rows, "vertical" for columns
 * @returns Offsets to apply to existing elements and the new item
 */
export const calculateAlignmentOffsets = (
    item: Element | Component,
    component: Component,
    align: Alignment,
    axis: Axis,
): { existingOffset: number; newItemOffset: number } => {
    // Determine which dimension to align on
    const itemSize = axis === "horizontal" ? item.h : item.w
    const componentSize = axis === "horizontal" ? component.h : component.w

    // Handle start alignment (top for rows, left for columns)
    const startAlign = axis === "horizontal" ? "top" : "left"
    if (align === startAlign) {
        return { existingOffset: 0, newItemOffset: 0 }
    }

    // Handle end alignment (bottom for rows, right for columns)
    const endAlign = axis === "horizontal" ? "bottom" : "right"
    if (align === endAlign) {
        if (itemSize >= componentSize) {
            return {
                existingOffset: itemSize - componentSize,
                newItemOffset: 0,
            }
        } else {
            return {
                existingOffset: 0,
                newItemOffset: componentSize - itemSize,
            }
        }
    }

    // Handle center alignment
    if (align === "center") {
        if (itemSize >= componentSize) {
            return {
                existingOffset: (itemSize - componentSize) / 2,
                newItemOffset: 0,
            }
        } else {
            return {
                existingOffset: 0,
                newItemOffset: (componentSize - itemSize) / 2,
            }
        }
    }

    // Handle anchor alignment
    if (align === "anchor") {
        const itemAnchorValue = getAnchorValue(item.anchor, axis, "incoming")
        const componentAnchorValue = getAnchorValue(
            component.anchor,
            axis,
            "outgoing",
        )

        if (itemAnchorValue >= componentAnchorValue) {
            return {
                existingOffset: itemAnchorValue - componentAnchorValue,
                newItemOffset: 0,
            }
        } else {
            return {
                existingOffset: 0,
                newItemOffset: componentAnchorValue - itemAnchorValue,
            }
        }
    }

    return { existingOffset: 0, newItemOffset: 0 }
}

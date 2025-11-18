import type { Component } from "../../types/Component"
import type { Element } from "../../types/Element"
import type { PositionedElement } from "../../types/PositionedElement"
import { calculateComponentGap } from "./calculateComponentGap"
import { calculateMarginOverlap } from "./calculateMarginOverlap"

type Axis = "horizontal" | "vertical"

type AxisConfig = {
    getEdge: (el: PositionedElement) => number
}

/**
 * Calculate spacing between components or elements in a stack.
 *
 * @param component - The accumulated component so far
 * @param item - The current item being added
 * @param axis - "horizontal" or "vertical"
 * @param pack - Whether to use collision detection for packing
 * @param config - Axis-specific configuration
 * @param existingOffset - Offset applied to existing elements (for anchor alignment)
 * @param newItemOffset - Offset to be applied to new item (for anchor alignment)
 * @returns The spacing/margin to apply before the new item
 */
export const calculateStackSpacing = (
    component: Component,
    item: Element | Component,
    axis: Axis,
    pack: boolean,
    config: AxisConfig,
    existingOffset: number = 0,
    newItemOffset: number = 0,
): number => {
    // No spacing needed for first item
    if (component.elements.length === 0) {
        return 0
    }

    if ("elements" in item) {
        // Both are components - use collision detection if pack is enabled
        if (pack) {
            return calculateComponentGap(component, item, axis, existingOffset, newItemOffset)
        } else {
            // Without packing, respect margins between components
            const lastElement = component.elements[
                component.elements.length - 1
            ] as PositionedElement
            const firstElementOfItem = item.elements[0]
            const marginGap = calculateMarginOverlap(
                lastElement.margin,
                firstElementOfItem?.margin,
                axis,
            )
            return (
                Math.max(...component.elements.map(config.getEdge)) + marginGap
            )
        }
    } else {
        // Element being added
        // Check if we have components in the stack (Component + Element case)
        if (component.components && component.components.length > 0) {
            // Component + Element: return absolute position after component edge with margin
            const lastElement = component.elements[
                component.elements.length - 1
            ] as PositionedElement
            const marginGap = calculateMarginOverlap(lastElement.margin, item.margin, axis)
            return Math.max(...component.elements.map(config.getEdge)) + marginGap
        } else {
            // Element + Element: return just the margin gap (position will be calculated later)
            const lastElement = component.elements[
                component.elements.length - 1
            ] as PositionedElement
            return calculateMarginOverlap(lastElement.margin, item.margin, axis)
        }
    }
}

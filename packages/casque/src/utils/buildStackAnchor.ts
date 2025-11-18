import type { Anchor } from "../../types/Anchor"
import type { Component } from "../../types/Component"
import type { Element } from "../../types/Element"
import { getAnchorValue } from "./getAnchorValue"

type Axis = "horizontal" | "vertical"
type Alignment = "start" | "center" | "end" | "anchor"

type AxisConfig = {
    anchorAxis: "x" | "y"
    anchorSecondaryAxis: "x" | "y"
}

/**
 * Build the anchor for a stack component based on the current item and accumulated component.
 *
 * @param item - The current item being added
 * @param component - The accumulated component so far
 * @param align - The alignment strategy
 * @param axis - "horizontal" or "vertical"
 * @param config - Axis-specific configuration
 * @param existingOffset - Offset applied to existing elements
 * @param newItemOffset - Offset applied to the new item
 * @returns The anchor for the resulting component
 */
const validateAnchor = (anchor: Anchor | undefined, context: string, itemId?: string): Anchor | undefined => {
    if (!anchor) return anchor

    const anchorAny = anchor as any
    for (const key in anchorAny) {
        const value = anchorAny[key]
        // For arrays (tuples), check each element
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item === null || item === undefined || (typeof item === "number" && isNaN(item))) {
                    throw new Error(
                        `buildStackAnchor: Invalid anchor value detected at ${context}. ` +
                        `Key: ${key}, Value: ${value}, Full anchor: ${JSON.stringify(anchor)}` +
                        (itemId ? `, Item ID: ${itemId}` : "")
                    )
                }
            }
        } else if (value === null || value === undefined || (typeof value === "number" && isNaN(value))) {
            throw new Error(
                `buildStackAnchor: Invalid anchor value detected at ${context}. ` +
                `Key: ${key}, Value: ${value}, Full anchor: ${JSON.stringify(anchor)}` +
                (itemId ? `, Item ID: ${itemId}` : "")
            )
        }
    }
    return anchor
}

/**
 * Helper to check if an anchor value is a tuple
 */
const isTuple = (value: number | [number, number] | undefined): value is [number, number] => {
    return Array.isArray(value)
}

/**
 * Helper to get anchor value (handles both single numbers and tuples)
 */
const getAnchorAxisValue = (anchor: Anchor, axis: "x" | "y", direction?: "start" | "end"): number | undefined => {
    const value = (anchor as any)[axis]
    if (value === undefined) return undefined

    if (isTuple(value)) {
        // For tuples: [start, end] which is [left/top, right/bottom]
        return direction === "end" ? value[1] : value[0]
    }
    return value
}

export const buildStackAnchor = (
    item: Element | Component,
    component: Component,
    align: Alignment,
    axis: Axis,
    config: AxisConfig,
    existingOffset: number,
    newItemOffset: number,
): Anchor | undefined => {
    // Validate inputs
    if (isNaN(existingOffset)) {
        throw new Error(
            `buildStackAnchor: existingOffset is NaN. ` +
            `Item: ${JSON.stringify("id" in item ? { id: item.id } : { elements: item.elements.length })}, ` +
            `Component: ${JSON.stringify({ id: component.id, elementCount: component.elements.length })}`
        )
    }
    if (isNaN(newItemOffset)) {
        throw new Error(
            `buildStackAnchor: newItemOffset is NaN. ` +
            `Item: ${JSON.stringify("id" in item ? { id: item.id } : { elements: item.elements.length })}, ` +
            `Component: ${JSON.stringify({ id: component.id, elementCount: component.elements.length })}`
        )
    }

    const itemId = "id" in item ? item.id : undefined

    if (component.elements.length === 0) {
        // First item - just use its anchor as-is
        return validateAnchor(item.anchor, "first item", itemId)
    }

    // Check if current item has a secondary anchor to propagate
    if (
        item.anchor &&
        config.anchorSecondaryAxis in item.anchor &&
        // Don't return early if using anchor alignment and component already has anchor
        !(align === "anchor" && component.anchor)
    ) {
        const secondaryValue = (item.anchor as any)[config.anchorSecondaryAxis]

        // If item has tuple anchor on secondary axis, preserve it
        if (isTuple(secondaryValue)) {
            const primaryDim = axis === "horizontal" ? "w" : "h"
            const itemPosition =
                "elements" in item
                    ? 0 // Will be set by caller based on primaryMargin
                    : component[primaryDim]
            return validateAnchor({
                [config.anchorSecondaryAxis]: [
                    itemPosition + secondaryValue[0],
                    itemPosition + secondaryValue[1]
                ] as [number, number]
            } as Anchor, "dual anchor propagation", itemId)
        }

        // Single value on secondary axis
        const primaryDim = axis === "horizontal" ? "w" : "h"
        const itemPosition =
            "elements" in item
                ? 0 // Will be set by caller based on primaryMargin
                : component[primaryDim]
        return validateAnchor({
            [config.anchorSecondaryAxis]: itemPosition + secondaryValue,
        } as Anchor, "secondary anchor propagation", itemId)
    }

    // Check if component already has a secondary-derived anchor
    const hasSecondaryAnchor = (anchor: Anchor) => {
        return config.anchorSecondaryAxis in anchor
    }

    const getSecondaryAnchorValue = (anchor: Anchor, direction?: "start" | "end"): number => {
        const value = (anchor as any)[config.anchorSecondaryAxis]

        if (value === undefined) return 0

        if (isTuple(value)) {
            const result = direction === "end" ? value[1] : value[0]
            if (isNaN(result)) {
                throw new Error(
                    `buildStackAnchor: NaN detected when extracting secondary anchor value. ` +
                    `Axis: ${axis}, Direction: ${direction}, Anchor: ${JSON.stringify(anchor)}`
                )
            }
            return result
        }

        if (isNaN(value)) {
            throw new Error(
                `buildStackAnchor: NaN detected when extracting secondary anchor value. ` +
                `Axis: ${axis}, Direction: ${direction}, Anchor: ${JSON.stringify(anchor)}`
            )
        }

        return value
    }

    if (component.anchor && hasSecondaryAnchor(component.anchor)) {
        // If item also has secondary anchor and using anchor alignment, potentially create dual anchor
        if (
            align === "anchor" &&
            item.anchor &&
            hasSecondaryAnchor(item.anchor)
        ) {
            const startValue = getSecondaryAnchorValue(component.anchor, "start") + existingOffset
            const endValue = getSecondaryAnchorValue(item.anchor, "end") + newItemOffset

            // Use single value if start and end are the same
            if (startValue === endValue) {
                return validateAnchor({ [config.anchorSecondaryAxis]: startValue } as Anchor, "merged secondary anchor", itemId)
            }

            // Create tuple for dual anchor
            return validateAnchor({
                [config.anchorSecondaryAxis]: [startValue, endValue] as [number, number]
            } as Anchor, "dual secondary anchor", itemId)
        }
        return validateAnchor(component.anchor, "existing component anchor", component.id)
    }

    if (!component.anchor || !item.anchor) {
        return validateAnchor(component.anchor || item.anchor, "fallback anchor", itemId || component.id)
    }

    // Check if item already has a tuple anchor on primary axis that should be preserved
    const itemPrimaryValue = getAnchorAxisValue(item.anchor, config.anchorAxis)
    if (itemPrimaryValue !== undefined && isTuple((item.anchor as any)[config.anchorAxis])) {
        const itemAnchor = item.anchor as any
        const tupleValue = itemAnchor[config.anchorAxis] as [number, number]
        return validateAnchor({
            [config.anchorAxis]: [
                tupleValue[0] + existingOffset,
                tupleValue[1] + newItemOffset
            ] as [number, number]
        } as Anchor, "preserved dual anchor", itemId)
    }

    // Existing component anchor gets shifted by existingOffset
    // New item anchor gets shifted by newItemOffset
    const startPos = getAnchorValue(component.anchor, axis, "outgoing")
    const endPos = getAnchorValue(item.anchor, axis, "outgoing")
    const startValue = startPos + existingOffset
    const endValue = endPos + newItemOffset

    // Use single value if start and end are the same
    if (startValue === endValue) {
        return validateAnchor({ [config.anchorAxis]: startValue } as Anchor, "merged primary anchor", itemId)
    }

    // Create tuple for dual anchor
    return validateAnchor({
        [config.anchorAxis]: [startValue, endValue] as [number, number]
    } as Anchor, "dual primary anchor", itemId)
}

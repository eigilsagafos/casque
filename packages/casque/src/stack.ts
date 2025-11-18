import type { Anchor } from "../types/Anchor"
import type { Component } from "../types/Component"
import type { Element } from "../types/Element"
import type { PositionedElement } from "../types/PositionedElement"
import { buildStackAnchor } from "./utils/buildStackAnchor"
import { calculateAlignmentOffsets } from "./utils/calculateAlignmentOffsets"
import { calculateStackSpacing } from "./utils/calculateStackSpacing"
import {
    positionComponentItem,
    positionElementItem,
    positionFirstItem,
} from "./utils/positionStackItem"

type Axis = "horizontal" | "vertical"
type Alignment = "start" | "center" | "end" | "anchor"

type StackArgs = {
    id: string
    items: (Element | Component)[]
    axis: Axis
    align?: Alignment
    pack?: boolean
    anchorItemId?: string // ID of item whose anchor to use, or "first"/"last"
    meta?: Record<string, any>
}

// Axis configuration maps axis to the appropriate properties
const getAxisConfig = (axis: Axis) => {
    if (axis === "horizontal") {
        return {
            // Primary axis (direction of stacking)
            primaryPos: "x" as const,
            primaryDim: "w" as const,
            // Secondary axis (alignment)
            secondaryPos: "y" as const,
            secondaryDim: "h" as const,
            // Anchor properties
            anchorAxis: "x" as const,
            anchorSecondaryAxis: "y" as const,
            // Margin properties
            marginStart: "left" as const,
            marginEnd: "right" as const,
            // Edge calculations
            getEdge: (el: PositionedElement) => el.x + el.w,
            getSecondaryEdge: (el: PositionedElement) => el.y + el.h,
        }
    } else {
        return {
            primaryPos: "y" as const,
            primaryDim: "h" as const,
            secondaryPos: "x" as const,
            secondaryDim: "w" as const,
            anchorAxis: "y" as const,
            anchorSecondaryAxis: "x" as const,
            marginStart: "top" as const,
            marginEnd: "bottom" as const,
            getEdge: (el: PositionedElement) => el.y + el.h,
            getSecondaryEdge: (el: PositionedElement) => el.x + el.w,
        }
    }
}

export const stack = ({
    id,
    items,
    axis,
    align = "start",
    pack = false,
    anchorItemId,
    meta,
}: StackArgs) => {
    const config = getAxisConfig(axis)

    // Map generic alignment to axis-specific alignment for calculateAlignmentOffsets
    const axisSpecificAlign:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "center"
        | "anchor" =
        align === "center" || align === "anchor"
            ? align
            : axis === "horizontal"
              ? align === "start"
                  ? "top"
                  : "bottom"
              : align === "start"
                ? "left"
                : "right"

    const res = items.reduce(
        (component: Component, item, index) => {
            // Validate anchor when using anchor alignment
            if (align === "anchor" && !item.anchor) {
                const itemType = "elements" in item ? "Component" : "Element"
                const itemId = "id" in item ? ` (id: ${item.id})` : ""
                throw new Error(
                    `Stack with anchor alignment requires all items to have anchors. ${itemType} at index ${index}${itemId} is missing an anchor.`,
                )
            }

            // Calculate alignment offsets (need these for spacing calculation)
            const { existingOffset, newItemOffset } = calculateAlignmentOffsets(
                item,
                component,
                axisSpecificAlign,
                axis,
            )

            // Calculate spacing between components or elements
            // Pass offsets so collision detection uses adjusted positions
            const primaryMargin = calculateStackSpacing(
                component,
                item,
                axis,
                pack,
                config,
                existingOffset,
                newItemOffset,
            )

            // Build the new anchor for the stack (only when using anchor alignment)
            const newAnchor = align === "anchor"
                ? buildStackAnchor(
                    item,
                    component,
                    align,
                    axis,
                    config,
                    existingOffset,
                    newItemOffset,
                )
                : undefined

            // Handle first item
            if (component.elements.length === 0) {
                return positionFirstItem(item, newAnchor, id)
            }

            // Handle component items
            if ("elements" in item) {
                return positionComponentItem(
                    item,
                    component,
                    primaryMargin,
                    existingOffset,
                    newItemOffset,
                    config,
                    newAnchor,
                )
            }

            // Handle element items
            return positionElementItem(
                item,
                component,
                primaryMargin,
                existingOffset,
                newItemOffset,
                pack,
                config,
                newAnchor,
                id,
            )
        },
        { w: 0, h: 0, elements: [] } as Component,
    )

    // Determine final anchor
    let finalAnchor = res.anchor

    if (anchorItemId) {
        // Find the item by ID
        let targetId: string | undefined

        if (anchorItemId === "first") {
            targetId = items[0] && "id" in items[0] ? items[0].id : undefined
        } else if (anchorItemId === "last") {
            const lastItem = items[items.length - 1]
            targetId = lastItem && "id" in lastItem ? lastItem.id : undefined
        } else {
            targetId = anchorItemId
        }

        if (targetId) {
            // Find the positioned element or component in the result
            const positionedElement = res.elements.find(el => el.id === targetId)

            if (positionedElement && positionedElement.anchor) {
                // Build anchor from element's position + anchor
                const result: any = {}
                const anchor = positionedElement.anchor as any

                // For both axes: add position + anchor to get absolute anchor position
                const primaryAnchorValue = anchor[config.anchorAxis]
                if (primaryAnchorValue !== undefined) {
                    const value = Array.isArray(primaryAnchorValue) ? primaryAnchorValue[0] : primaryAnchorValue
                    result[config.anchorAxis] = positionedElement[config.primaryPos] + value
                }

                const secondaryAnchorValue = anchor[config.anchorSecondaryAxis]
                if (secondaryAnchorValue !== undefined) {
                    const value = Array.isArray(secondaryAnchorValue) ? secondaryAnchorValue[0] : secondaryAnchorValue
                    result[config.anchorSecondaryAxis] = positionedElement[config.secondaryPos] + value
                }

                finalAnchor = result as Anchor
            } else {
                // Try finding in components
                const positionedComponent = res.components?.find((comp: Component) => comp.id === targetId)

                if (positionedComponent && positionedComponent.anchor) {
                    // For components, use similar logic: position + anchor for both axes
                    const result: any = {}
                    const anchor = positionedComponent.anchor as any

                    // For both axes: add position + anchor to get absolute anchor position
                    const primaryAnchorValue = anchor[config.anchorAxis]
                    if (primaryAnchorValue !== undefined) {
                        const value = Array.isArray(primaryAnchorValue) ? primaryAnchorValue[0] : primaryAnchorValue
                        result[config.anchorAxis] = positionedComponent[config.primaryPos] + value
                    }

                    const secondaryAnchorValue = anchor[config.anchorSecondaryAxis]
                    if (secondaryAnchorValue !== undefined) {
                        const value = Array.isArray(secondaryAnchorValue) ? secondaryAnchorValue[0] : secondaryAnchorValue
                        result[config.anchorSecondaryAxis] = positionedComponent[config.secondaryPos] + value
                    }

                    finalAnchor = result as Anchor
                }
            }
        }
    } else if (!finalAnchor) {
        // Default to center if no anchor was set
        finalAnchor = { x: res.w / 2, y: res.h / 2 }
    }

    return { ...res, id, anchor: finalAnchor, meta } as Component
}

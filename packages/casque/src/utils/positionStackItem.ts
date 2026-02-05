import type { Anchor } from "../../types/Anchor"
import type { Component, ComponentReference } from "../../types/Component"
import type { Element } from "../../types/Element"
import type { PositionedElement } from "../../types/PositionedElement"
import { updatePositions } from "../updatePositions"
import { getMargin } from "./getMargin"

type AxisConfig = {
    primaryPos: "x" | "y"
    primaryDim: "w" | "h"
    secondaryPos: "x" | "y"
    secondaryDim: "w" | "h"
    marginStart: "left" | "right" | "top" | "bottom"
    marginEnd: "left" | "right" | "top" | "bottom"
    getEdge: (el: PositionedElement) => number
    getSecondaryEdge: (el: PositionedElement) => number
}

/**
 * Position the first item in an empty component
 */
export const positionFirstItem = (
    item: Element | Component,
    newAnchor: Anchor | undefined,
    parentId: string,
): Component => {
    if ("elements" in item) {
        // First component - create reference without elements/components
        const componentRef: ComponentReference = {
            id: item.id,
            x: 0,
            y: 0,
            w: item.w,
            h: item.h,
            anchor: item.anchor,
            parentId,
            meta: item.meta,
        }
        // Recursively flatten nested component references - keep their original parentId
        const nestedRefs = (item.components || []).map(c => ({
            id: c.id,
            x: c.x,
            y: c.y,
            w: c.w,
            h: c.h,
            anchor: c.anchor,
            parentId: c.parentId,
            meta: c.meta,
        }))
        return {
            id: parentId,
            ...item,
            anchor: newAnchor,
            components: [componentRef, ...nestedRefs] as any,
        }
    } else {
        return {
            id: parentId,
            w: item.w,
            h: item.h,
            elements: [{ ...item, x: 0, y: 0, parentId }],
            anchor: newAnchor,
        }
    }
}

/**
 * Position a component item in the stack
 */
export const positionComponentItem = (
    item: Component,
    component: Component,
    primaryMargin: number,
    existingOffset: number,
    newItemOffset: number,
    config: AxisConfig,
    newAnchor: Anchor | undefined,
): Component => {
    // Update existing components' positions
    const primaryOffset = {
        [config.primaryPos]: 0,
        [config.secondaryPos]: existingOffset,
    }
    const updatedExistingComponents = (component.components || []).map(c => ({
        ...c,
        [config.secondaryPos]: c[config.secondaryPos] + existingOffset,
    }))

    const updatedExistingElements = component.elements.map(el =>
        updatePositions(el, primaryOffset as { x: number; y: number }),
    )

    // Get the parent ID from the component
    const currentParentId = component.id

    // For component-to-component: use collision detection gap directly
    const newItemPrimaryPos = primaryMargin
    const itemOffset = {
        [config.primaryPos]: newItemPrimaryPos,
        [config.secondaryPos]: newItemOffset,
    }
    const updatedItemElements = item.elements.map(el =>
        updatePositions(el, itemOffset as { x: number; y: number }),
    )

    // Add the new component reference without elements/components
    const newComponentRef: ComponentReference = {
        id: item.id,
        x: 0,
        y: 0,
        w: item.w,
        h: item.h,
        anchor: item.anchor,
        parentId: currentParentId,
        meta: item.meta,
    }
    newComponentRef[config.primaryPos] = newItemPrimaryPos
    newComponentRef[config.secondaryPos] = newItemOffset

    // Recursively flatten nested component references with updated positions - keep their original parentId
    const nestedRefs = (item.components || []).map(c => {
        const ref: ComponentReference = {
            id: c.id,
            x: c.x,
            y: c.y,
            w: c.w,
            h: c.h,
            anchor: c.anchor,
            parentId: c.parentId,
            meta: c.meta,
        }
        ref[config.primaryPos] = c[config.primaryPos] + newItemPrimaryPos
        ref[config.secondaryPos] = c[config.secondaryPos] + newItemOffset
        return ref
    })

    // Calculate actual dimensions: edge positions across all elements
    const allElements = [...updatedExistingElements, ...updatedItemElements]
    const primaryEdge = Math.max(...allElements.map(config.getEdge))
    const secondaryEdge = Math.max(...allElements.map(config.getSecondaryEdge))

    const result: Component = {
        w: 0,
        h: 0,
        elements: allElements,
        components: [
            ...updatedExistingComponents,
            newComponentRef,
            ...nestedRefs,
        ] as any,
        anchor: newAnchor,
    }
    result[config.primaryDim] = primaryEdge
    result[config.secondaryDim] = secondaryEdge
    return result
}

/**
 * Position an element item in the stack
 */
export const positionElementItem = (
    item: Element,
    component: Component,
    primaryMargin: number,
    existingOffset: number,
    newItemOffset: number,
    pack: boolean,
    config: AxisConfig,
    newAnchor: Anchor | undefined,
    parentId: string,
): Component => {
    // Update existing components' positions
    const primaryOffset = {
        [config.primaryPos]: 0,
        [config.secondaryPos]: existingOffset,
    }
    const updatedExistingComponents = (component.components || []).map(c => ({
        ...c,
        [config.secondaryPos]: c[config.secondaryPos] + existingOffset,
    }))

    const updatedElements = component.elements.map(el =>
        updatePositions(el, primaryOffset as { x: number; y: number }),
    )

    // For element: find the position along primary axis
    let newItemPrimaryPos = 0

    if (pack) {
        // With packing: check all elements that would collide on secondary axis
        const newItemSecondaryStart = newItemOffset
        const newItemSecondaryEnd = newItemOffset + item[config.secondaryDim]
        const startMargin = getMargin(item.margin, config.marginStart)

        for (const el of updatedElements) {
            const elSecondaryStart = el[config.secondaryPos]
            const elSecondaryEnd =
                el[config.secondaryPos] + el[config.secondaryDim]

            // Check secondary axis overlap
            if (
                elSecondaryEnd > newItemSecondaryStart &&
                elSecondaryStart < newItemSecondaryEnd
            ) {
                const endMargin = getMargin(el.margin, config.marginEnd)
                const elPrimaryEnd =
                    el[config.primaryPos] + el[config.primaryDim]
                // Margins overlap - use max, not sum
                const marginGap = Math.max(endMargin, startMargin)
                const requiredPos = elPrimaryEnd + marginGap
                newItemPrimaryPos = Math.max(newItemPrimaryPos, requiredPos)
            }
        }
    } else {
        // Without packing: place after edge + margin
        const edgePos = Math.max(...updatedElements.map(config.getEdge))
        newItemPrimaryPos = edgePos + primaryMargin
    }

    const newElement: PositionedElement = {
        ...item,
        x: 0,
        y: 0,
        parentId,
    }
    newElement[config.primaryPos] = newItemPrimaryPos
    newElement[config.secondaryPos] = newItemOffset

    // Calculate actual dimensions: edge positions across all elements
    const allElements = [...updatedElements, newElement]
    const primaryEdge = Math.max(...allElements.map(config.getEdge))
    const secondaryEdge = Math.max(...allElements.map(config.getSecondaryEdge))

    const result: Component = {
        w: 0,
        h: 0,
        elements: allElements,
        components: updatedExistingComponents as any,
        anchor: newAnchor,
    }
    result[config.primaryDim] = primaryEdge
    result[config.secondaryDim] = secondaryEdge
    return result
}

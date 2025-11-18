import { describe, expect, test } from "bun:test"
import { column } from "./column"
import { element } from "./element"
import { row } from "./row"

describe("nested component relative positions", () => {
    test("elements within a component should maintain relative positions when nested", () => {
        // Create a component with two elements at specific relative positions
        const innerComponent = column({
            id: "inner",
            items: [
                element({ w: 10, h: 10, margin: 4 }), // Element 1: y=0 (within component)
                element({ w: 10, h: 10, margin: 4 }), // Element 2: y=18 (within component: 10 + max(4,4))
            ],
        })

        // Verify internal positions
        expect(innerComponent.elements[0].y).toBe(0)
        expect(innerComponent.elements[1].y).toBe(14) // 10 + max(4,4) = 10 + 4 (collapsed margins)

        // Now add this component to a parent row
        const outerRow = row({
            items: [
                element({ w: 20, h: 30 }), // First element in row
                innerComponent, // Add the component
            ],
        })

        // The inner component's elements should maintain their relative positions
        // Element 1 should be at y=0 relative to the component
        // Element 2 should be at y=18 relative to the component
        const innerElements = outerRow.elements.filter(
            el =>
                el.id === innerComponent.elements[0].id ||
                el.id === innerComponent.elements[1].id,
        )

        console.log("Inner component elements in outer row:", innerElements)

        // Find the component's Y position in the parent
        const componentY =
            outerRow.components?.find(c => c.id === "inner")?.y || 0

        // Elements should be at componentY + their original relative positions
        const el1 = innerElements.find(
            el => el.id === innerComponent.elements[0].id,
        )!
        const el2 = innerElements.find(
            el => el.id === innerComponent.elements[1].id,
        )!

        // Relative positions within component should be preserved
        expect(el1.y - componentY).toBe(0)
        expect(el2.y - componentY).toBe(14) // 10 + max(4,4) = 14 (collapsed margins)
    })

    test("deeply nested components should preserve all relative positions", () => {
        // Create innermost component
        const inner = column({
            id: "inner",
            items: [
                element({ w: 10, h: 10, id: "a" }),
                element({ w: 10, h: 10, id: "b", margin: 5 }),
            ],
        })

        // Wrap in middle component
        const middle = row({
            id: "middle",
            items: [element({ w: 20, h: 15, id: "c" }), inner],
        })

        // Wrap in outer component
        const outer = column({
            items: [element({ w: 50, h: 20, id: "d" }), middle],
        })

        // Component references should be flattened in the components array
        // They should include all nested components (middle, inner) with their positions
        const middleRef = outer.components?.find(c => c.id === "middle")
        const innerRef = outer.components?.find(c => c.id === "inner")

        expect(middleRef).toBeDefined()
        expect(innerRef).toBeDefined()

        // Component references should not have elements or components properties
        expect((middleRef as any)?.elements).toBeUndefined()
        expect((middleRef as any)?.components).toBeUndefined()
        expect((innerRef as any)?.elements).toBeUndefined()
        expect((innerRef as any)?.components).toBeUndefined()

        // The gap between elements a and b should still be the same
        const originalGap =
            inner.elements[1].y - (inner.elements[0].y + inner.elements[0].h)

        const aInOuter = outer.elements.find(el => el.id === "a")!
        const bInOuter = outer.elements.find(el => el.id === "b")!

        const gapInOuter = bInOuter.y - (aInOuter.y + aInOuter.h)

        expect(gapInOuter).toBe(originalGap)
    })
})

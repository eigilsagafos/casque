import { describe, expect, test } from "bun:test"
import { column } from "./column"
import { element } from "./element"
import { row } from "./row"

describe("single item components", () => {
    test("row with single element should create a component", () => {
        const el = element({ id: "A", w: 50, h: 20 })
        const r = row({
            id: "single-row",
            items: [el],
        })

        console.log("Row result:", JSON.stringify(r, null, 2))

        expect(r.id).toBe("single-row")
        expect(r.w).toBe(50)
        expect(r.h).toBe(20)
        expect(r.elements.length).toBe(1)
        expect(r.elements[0].id).toBe("A")
        expect(r.elements[0].x).toBe(0)
        expect(r.elements[0].y).toBe(0)
    })

    test("column with single element should create a component", () => {
        const el = element({ id: "B", w: 30, h: 40 })
        const col = column({
            id: "single-col",
            items: [el],
        })

        console.log("Column result:", JSON.stringify(col, null, 2))

        expect(col.id).toBe("single-col")
        expect(col.w).toBe(30)
        expect(col.h).toBe(40)
        expect(col.elements.length).toBe(1)
        expect(col.elements[0].id).toBe("B")
        expect(col.elements[0].x).toBe(0)
        expect(col.elements[0].y).toBe(0)
    })

    test("row with single component should wrap it", () => {
        const innerCol = column({
            id: "inner",
            items: [
                element({ id: "A", w: 10, h: 10 }),
                element({ id: "B", w: 10, h: 10 }),
            ],
        })

        const r = row({
            id: "outer-row",
            items: [innerCol],
        })

        console.log("Row with single component:", JSON.stringify(r, null, 2))

        expect(r.id).toBe("outer-row")
        expect(r.elements.length).toBe(2) // Should have both A and B
        expect(r.components).toBeDefined()
        expect(r.components?.length).toBeGreaterThan(0) // Should track the inner component
    })

    test("nested single-item components should all be tracked", () => {
        const el = element({ id: "A", w: 10, h: 10 })

        const col1 = column({
            id: "col1",
            items: [el],
        })

        const row1 = row({
            id: "row1",
            items: [col1],
        })

        const col2 = column({
            id: "col2",
            items: [row1],
        })

        console.log(
            "Deeply nested single items:",
            JSON.stringify(col2, null, 2),
        )

        // Element should be present
        expect(col2.elements.length).toBe(1)
        expect(col2.elements[0].id).toBe("A")

        // All parent components should be tracked
        console.log("Components array:", col2.components)

        // Should have component tracking
        expect(col2.components).toBeDefined()
    })
})

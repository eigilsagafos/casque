import { describe, expect, test } from "bun:test"
import { element } from "./element"
import { column } from "./column"
import { row } from "./row"

describe("column", () => {
    test("empty column", () => {
        const res = column({
            items: [],
        })
        expect(res.w).toBe(0)
        expect(res.h).toBe(0)
        expect(res.elements.length).toBe(0)
        expect(res.id).toBeString()
    })
    test("one element", () => {
        const res = column({
            items: [element({ w: 10, h: 10 })],
        })
        expect(res.w).toBe(10)
        expect(res.h).toBe(10)
        expect(res.elements.length).toBe(1)
        expect(res.id).toBeString()
        expect(res.anchor).toEqual({ x: 5, y: 5 })
    })
    test("two elements", () => {
        const res = column({
            items: [element({ w: 10, h: 10 }), element({ w: 20, h: 10 })],
        })
        expect(res.w).toBe(20)
        expect(res.h).toBe(20)
        expect(res.elements.length).toBe(2)
        expect(res.id).toBeString()
        expect(res.anchor).toEqual({ x: 10, y: 10 })
    })
    test("two elements with anchorId", () => {
        const box1 = element({ w: 10, h: 10 })
        const box2 = element({ w: 20, h: 10, anchor: { x: 2 } })
        const res = column({
            items: [box1, box2],
            anchorItemId: box2.id,
        })
        expect(res.w).toBe(20)
        expect(res.h).toBe(20)
        expect(res.elements.length).toBe(2)
        expect(res.id).toBeString()
        expect(res.anchor).toEqual({ x: 2, y: 15 })
    })

    test("column with nested rows", () => {
        const row1 = row({
            id: "row1",
            items: [
                element({ id: "a", w: 10, h: 10 }),
                element({ w: 10, h: 10 }),
                element({ w: 10, h: 10 }),
            ],
            anchorItemId: "a",
            align: "center",
        })
        expect(row1.anchor).toEqual({ x: 5, y: 5 })
        const row2 = row({
            id: "row2",
            items: [
                element({ w: 10, h: 10 }),
                element({ id: "b", w: 10, h: 10 }),
                element({ w: 10, h: 10 }),
                element({ w: 10, h: 10 }),
            ],
            anchorItemId: "b",
            align: "center",
        })
        expect(row2.anchor).toEqual({ x: 15, y: 5 })

        const render1 = column({
            items: [row1, row2],
            anchorItemId: "row2",
            align: "left",
        })
        expect(render1.w).toEqual(40)
        expect(render1.anchor).toEqual({ x: 15, y: 15 })
        const render2 = column({
            items: [row1, row2],
            anchorItemId: "row1",
            align: "right",
        })
        expect(render2.anchor).toEqual({ x: 15, y: 5 })

        const render3 = column({
            items: [row1, row2],
            anchorItemId: "row1",
            align: "anchor",
        })
        console.log(render3)

        // threeElementRow({align})

        // const row1
    })

    // LEGACY

    describe("nested components", () => {
        test("component references should not have elements property", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 10 })
            const row1 = row({
                items: [box1, box2],
                align: "center",
            })
            const res = column({
                items: [row1],
                align: "left",
            })
            expect(res.components[0].elements).toBeUndefined()
        })

        test("meta should be preserved in nested components", () => {
            // Create nested row and column with meta
            const nestedRow = row({
                id: "nested-row",
                items: [element({ w: 10, h: 10 })],
                meta: { type: "row", level: 1 },
            })
            const nestedColumn = column({
                id: "nested-column",
                items: [element({ w: 10, h: 10 })],
                meta: { type: "column", level: 1 },
            })

            // Add them to a parent column
            const parent = column({
                items: [nestedRow, nestedColumn],
                meta: { type: "parent" },
            })

            // Check that parent has its own meta
            expect(parent.meta).toEqual({ type: "parent" })

            // Check that nested components keep their meta
            const rowRef = parent.components?.find(c => c.id === "nested-row")
            const colRef = parent.components?.find(c => c.id === "nested-column")

            expect(rowRef?.meta).toEqual({ type: "row", level: 1 })
            expect(colRef?.meta).toEqual({ type: "column", level: 1 })
        })

        test("adding element after component should work", () => {
            // This triggers positionElementItem with existing components
            const box1 = element({ w: 10, h: 10, id: "box1" })
            const box2 = element({ w: 10, h: 10, id: "box2" })
            const row1 = row({
                id: "row1",
                items: [box1, box2],
                align: "center",
            })
            const box3 = element({ w: 15, h: 15, id: "box3" })

            const res = column({
                items: [row1, box3],
                align: "left",
            })

            // Should have all elements positioned correctly
            expect(res.elements.length).toBe(3)
            expect(res.elements.find(e => e.id === "box1")).toBeDefined()
            expect(res.elements.find(e => e.id === "box2")).toBeDefined()
            expect(res.elements.find(e => e.id === "box3")).toBeDefined()

            // Component reference should exist without elements property
            expect(res.components?.length).toBe(1)
            expect(res.components?.[0].id).toBe("row1")
            expect((res.components?.[0] as any).elements).toBeUndefined()
        })
    })
    describe("left align", () => {
        test("single element", () => {
            const box1 = element({ w: 10, h: 10 })
            const res = column({
                items: [box1],
                align: "left",
            })
            expect(res.w).toBe(10)
            expect(res.h).toBe(10)
            expect(res.elements.length).toBe(1)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
        })

        test("two elements with same size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 10 })
            const res = column({
                items: [box1, box2],
                align: "left",
            })
            expect(res.w).toBe(10)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(10)
        })
        test("two elements with differnt size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 20, h: 10 })
            const res = column({
                items: [box1, box2],
                align: "left",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(10)
        })
    })
    // describe("margin",)

    describe("right align", () => {
        test("two elements with differnt size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 20, h: 10 })
            const res = column({
                items: [box1, box2],
                align: "right",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(10)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(10)
        })
    })
    describe("center align", () => {
        test("three elements with increasing width", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 20, h: 10 })
            const box3 = element({ w: 30, h: 10 })
            const res = column({
                items: [box1, box2, box3],
                align: "center",
            })
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(10)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(5)
            expect(res.elements[1].y).toBe(10)
            expect(res.elements[2].x).toBe(0)
            expect(res.elements[2].y).toBe(20)
        })
        test("three elements with decreasing width", () => {
            const box1 = element({ w: 30, h: 10 })
            const box2 = element({ w: 20, h: 10 })
            const box3 = element({ w: 10, h: 10 })
            const res = column({
                items: [box1, box2, box3],
                align: "center",
            })
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(5)
            expect(res.elements[1].y).toBe(10)
            expect(res.elements[2].x).toBe(10)
            expect(res.elements[2].y).toBe(20)
        })
    })

    describe("anchor align", () => {
        test.todo("two elements with same anchor point", () => {
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { y: 5 },
            })
            const box2 = element({
                w: 10,
                h: 10,
                anchor: { y: 10 },
            })
            const res = column({
                items: [box1, box2],
                align: "anchor",
            })
            expect(res.w).toBe(15)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(5)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(10)
        })

        test("element with top/bottom anchors for asymmetric alignment", () => {
            // box1 connects to next element at x=8 (bottom anchor)
            // box2 connects to previous element at x=3 (top anchor)
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { x: [5, 8] },
            })
            const box2 = element({
                w: 10,
                h: 10,
                anchor: { x: [3, 7] },
            })
            const res = column({
                items: [box1, box2],
                align: "anchor",
            })
            // box1's bottom anchor (x=8) should align with box2's top anchor (x=3)
            // This means box2 needs to be offset by 5 pixels right
            expect(res.w).toBe(15)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(5)
            expect(res.elements[1].y).toBe(10)
        })

        test("three elements with top/bottom anchors", () => {
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { x: [5, 5] },
            })
            const box2 = element({
                w: 20,
                h: 10,
                anchor: { x: [10, 15] },
            })
            const box3 = element({
                w: 10,
                h: 10,
                anchor: { x: [7, 7] },
            })
            const res = column({
                items: [box1, box2, box3],
                align: "anchor",
            })
            // box1.bottom (x=5) aligns with box2.top (x=10)
            // Since we can't offset box2 negatively, we offset box1 right by 5
            // box2.bottom (x=15) aligns with box3.top (x=7) -> box3 offset by +8
            // Widths: box1 right=15, box2 right=20, box3 right=18 -> max=20
            expect(res.w).toBe(20)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(5) // offset to align with box2
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(10)
            expect(res.elements[2].x).toBe(8) // offset to align with box2's bottom
            expect(res.elements[2].y).toBe(20)
        })
        test.todo("auto-calculate vertical anchor from child horizontal anchor", () => {
            const box1 = element({
                w: 10,
                h: 10,
            })
            const box2 = element({
                w: 20,
                h: 10,
                anchor: { x: 5 },
            })
            const box3 = element({
                w: 10,
                h: 10,
            })
            const res = column({
                items: [box1, box2, box3],
                align: "center",
            })
            expect(res.anchor).toEqual({ x: 15 })
        })

        test.todo("auto-calculate vertical anchor from middle child", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({
                w: 20,
                h: 10,
                anchor: { x: 5 },
            })
            const box3 = element({ w: 10, h: 10 })
            const res = column({
                items: [box1, box2, box3],
                align: "center",
            })
            // box2 is at y=10, has horizontal anchor at 5
            // Column should get horizontal anchor at 10 + 5 = 15
            expect(res.anchor).toEqual({ x: 15 })
        })

        test("anchorItemId in column with one item", () => {
            const row1 = row({
                items: [
                    element({
                        id: "item1",
                        w: 10,
                        h: 10,
                        margin: 5,
                    }),
                    element({
                        id: "item2",
                        w: 20,
                        h: 10,
                        anchor: { x: 5 },
                    }),
                ],
                anchorItemId: "item2",
            })
            const res = column({
                items: [row1],
                align: "anchor",
                anchorItemId: row1.id,
            })

            expect(res.anchor).toEqual(row1.anchor)
        })

        test.todo("anchorItemId with components last", () => {
            const row1 = row({
                items: [
                    element({
                        id: "item1",
                        w: 10,
                        h: 10,
                        margin: 5,
                    }),
                    element({
                        id: "item2",
                        w: 20,
                        h: 10,
                        anchor: { x: 5 },
                    }),
                ],
                anchorItemId: "item2",
            })
            const row2 = row({
                items: [
                    element({
                        id: "item1",
                        w: 10,
                        h: 10,
                        margin: 5,
                    }),
                    element({
                        id: "item2",
                        w: 20,
                        h: 10,
                        anchor: { x: 5 },
                    }),
                ],
            })
            const res = column({
                items: [row1, row2],
                align: "anchor",
                anchorItemId: row2.id,
            })
            expect(res.anchor.horizontal).toEqual(15)
        })
        test.todo("anchorItemId with components first", () => {
            const row1 = row({
                items: [
                    element({
                        id: "item1",
                        w: 10,
                        h: 10,
                        margin: 5,
                    }),
                    element({
                        id: "item2",
                        w: 20,
                        h: 10,
                        anchor: { x: 5 },
                    }),
                ],
            })
            const row2 = row({
                items: [
                    element({
                        id: "item1",
                        w: 10,
                        h: 10,
                        margin: 5,
                    }),
                    element({
                        id: "item2",
                        w: 20,
                        h: 10,
                        anchor: { x: 5 },
                    }),
                ],
            })
            const res = column({
                items: [row1, row2],
                align: "anchor",
                anchorItemId: row1.id,
            })
            console.log("res", res)
            expect(res.anchor.horizontal).toEqual(5)
        })
    })

    describe("margin", () => {
        test("two elements with same margin - margins overlap", () => {
            const box1 = element({ w: 10, h: 10, margin: 5 })
            const box2 = element({ w: 10, h: 10, margin: 5 })
            const res = column({
                items: [box1, box2],
                align: "left",
            })
            // Margins overlap: max(5, 5) = 5, not 10
            expect(res.w).toBe(10)
            expect(res.h).toBe(25) // 10 + 5 + 10
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].y).toBe(15) // 10 + 5
        })

        test("two elements with different margins - use max", () => {
            const box1 = element({ w: 10, h: 10, margin: 8 })
            const box2 = element({ w: 10, h: 10, margin: 3 })
            const res = column({
                items: [box1, box2],
                align: "left",
            })
            // Margins overlap: max(8, 3) = 8
            expect(res.w).toBe(10)
            expect(res.h).toBe(28) // 10 + 8 + 10
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].y).toBe(18) // 10 + 8
        })

        test("margin with object syntax", () => {
            const box1 = element({
                w: 10,
                h: 10,
                margin: { left: 0, right: 0, top: 2, bottom: 8 },
            })
            const box2 = element({
                w: 10,
                h: 10,
                margin: { left: 0, right: 0, top: 3, bottom: 5 },
            })
            const res = column({
                items: [box1, box2],
                align: "left",
            })
            // box1's bottom (8) and box2's top (3): max(8, 3) = 8
            expect(res.w).toBe(10)
            expect(res.h).toBe(28) // 10 + 8 + 10
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].y).toBe(18) // 10 + 8
        })

        test("three elements with margins", () => {
            const box1 = element({ w: 10, h: 10, margin: 5 })
            const box2 = element({ w: 10, h: 10, margin: 10 })
            const box3 = element({ w: 10, h: 10, margin: 3 })
            const res = column({
                items: [box1, box2, box3],
                align: "left",
            })
            // box1-box2: max(5, 10) = 10
            // box2-box3: max(10, 3) = 10
            expect(res.w).toBe(10)
            expect(res.h).toBe(50) // 10 + 10 + 10 + 10 + 10
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].y).toBe(20) // 10 + 10
            expect(res.elements[2].y).toBe(40) // 20 + 10 + 10
        })
    })

    describe("nested components", () => {
        test("optimize spacing for rows with centered elements", () => {
            // Create rows with small elements centered in them
            const row1 = row({
                items: [element({ w: 10, h: 5 })],
                align: "center", // Element centered at y=0 in a h=5 row
            })
            const row2 = row({
                items: [element({ w: 10, h: 5 })],
                align: "center", // Element centered at y=0 in a h=5 row
            })

            // With Tetris-style collision detection:
            // row1 element is at y=0, height 5
            // row2 element is at y=0, height 5
            // No horizontal overlap issues, so row2 can start immediately after row1 element ends
            const res = column({
                items: [row1, row2],
                align: "left",
            })

            // row1 element at y=0, height 5 (ends at y=5)
            // row2 element should be positioned right after (no gap needed since elements don't overlap horizontally)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[0].h).toBe(5)
            expect(res.elements[1].y).toBe(5) // Starts where row1 element ends
            expect(res.elements[1].h).toBe(5)
            expect(res.h).toBe(10) // Total height: tightly packed
        })

        test("tetris-style staircase pattern optimization (vertical)", () => {
            // row1: elements getting narrower (left to right)
            // x=0: height 10
            // x=10: height 8
            // x=20: height 6
            const row1 = row({
                items: [
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 8 }),
                    element({ w: 10, h: 6 }),
                ],
                align: "top",
            })

            // row2: elements getting taller (left to right)
            // x=0: height 4
            // x=10: height 6
            // x=20: height 8
            const row2 = row({
                items: [
                    element({ w: 10, h: 4 }),
                    element({ w: 10, h: 6 }),
                    element({ w: 10, h: 8 }),
                ],
                align: "top",
            })

            const res = column({
                items: [row1, row2],
                align: "left",
            })

            // Tetris optimization should fit row2 into row1's gaps:
            // x=0-10: row1 ends at y=10, row2 starts at y=0, needs to be at y=10
            // x=10-20: row1 ends at y=8, row2 starts at y=0, needs to be at y=8
            // x=20-30: row1 ends at y=6, row2 starts at y=0, needs to be at y=6
            // The minimum gap is y=10 (from the first column overlap)
            expect(res.elements[3].y).toBe(10) // row2's first element
            expect(res.h).toBe(18) // row2 starts at y=10, height 8 -> ends at y=18
        })

        test.todo("row of columns with auto-calculated anchors", () => {
            // Create columns where each has an element with horizontal anchor
            const col1 = column({
                items: [
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 10, anchor: { x: 5 } }),
                    element({ w: 10, h: 10 }),
                ],
                align: "center",
            })
            const col2 = column({
                items: [
                    element({ w: 10, h: 15, anchor: { x: 5 } }),
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 5 }),
                ],
                align: "center",
            })

            // col1's anchor should be horizontal: 10 + 5 = 15 (middle element at y=10, anchor at 5)
            expect(col1.anchor).toEqual({ x: 15 })
            // col2's anchor should be horizontal: 0 + 5 = 5 (first element at y=0, anchor at 5)
            expect(col2.anchor).toEqual({ x: 5 })

            // Now put these columns in a row with anchor alignment
            const res = row({
                items: [col1, col2],
                align: "anchor",
            })

            // The columns should align at their horizontal anchors (Y positions)
            // col1 has horizontal: 15, col2 has horizontal: 5
            // col2 needs to offset down by 10 to align
            expect(res.elements[0].y).toBe(0) // col1 first element
            expect(res.elements[3].y).toBe(10) // col2 first element (offset by 10)
        })

        test("column with 3 rows, center aligned", () => {
            const row1 = row({
                items: [element({ w: 10, h: 10 }), element({ w: 10, h: 10 })],
                align: "center",
            })
            const row2 = row({
                items: [
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 10 }),
                ],
                align: "center",
            })
            const row3 = row({
                items: [element({ w: 10, h: 10 })],
                align: "center",
            })

            const res = column({
                items: [row1, row2, row3],
                align: "center",
            })
            // res.elements

            // Column dimensions: width = widest row, height = sum of row heights
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(6)

            // row1 (w=20) centered in w=30: offset by 5
            expect(res.elements[0].x).toBe(5)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(15)
            expect(res.elements[1].y).toBe(0)

            // row2 (w=30) centered in w=30: no offset
            expect(res.elements[2].x).toBe(0)
            expect(res.elements[2].y).toBe(10)
            expect(res.elements[3].x).toBe(10)
            expect(res.elements[3].y).toBe(10)
            expect(res.elements[4].x).toBe(20)
            expect(res.elements[4].y).toBe(10)

            // row3 (w=10) centered in w=30: offset by 10
            expect(res.elements[5].x).toBe(10)
            expect(res.elements[5].y).toBe(20)
        })
    })

    describe("components array tracking", () => {
        test("should track sub-components with their positions", () => {
            const row1 = row({
                items: [element({ w: 10, h: 10 }), element({ w: 10, h: 10 })],
            })
            const row2 = row({
                items: [element({ w: 10, h: 10 })],
            })

            const res = column({
                items: [row1, row2],
            })

            expect(res.components).toBeDefined()
            expect(res.components?.length).toBe(2)

            // First component at y=0
            expect(res.components?.[0].x).toBe(0)
            expect(res.components?.[0].y).toBe(0)
            expect(res.components?.[0].w).toBe(20)
            expect(res.components?.[0].h).toBe(10)

            // Second component at y=10
            expect(res.components?.[1].x).toBe(0)
            expect(res.components?.[1].y).toBe(10)
            expect(res.components?.[1].w).toBe(10)
            expect(res.components?.[1].h).toBe(10)
        })

        test("should flatten nested components recursively", () => {
            // Create innermost components
            const inner1 = row({
                items: [element({ w: 5, h: 5 })],
            })
            const inner2 = row({
                items: [element({ w: 5, h: 5 })],
            })

            // Create middle level components with nested components
            const middle1 = column({
                items: [inner1, inner2],
            })
            const middle2 = column({
                items: [inner1, inner2],
            })

            // Create top level column with 2 components, each having 2 sub-components
            const res = column({
                items: [middle1, middle2],
            })

            // Should have 6 total components: 2 middle + 4 inner (2 from each middle)
            expect(res.components?.length).toBe(6)

            // Verify the structure: first middle component at y=0
            expect(res.components?.[0].x).toBe(0)
            expect(res.components?.[0].y).toBe(0)

            // First inner of first middle at y=0 (relative to parent)
            expect(res.components?.[1].x).toBe(0)
            expect(res.components?.[1].y).toBe(0)

            // Second inner of first middle at y=5 (relative to parent)
            expect(res.components?.[2].x).toBe(0)
            expect(res.components?.[2].y).toBe(5)

            // Second middle component at y=10
            expect(res.components?.[3].x).toBe(0)
            expect(res.components?.[3].y).toBe(10)

            // First inner of second middle at y=10 (relative to parent)
            expect(res.components?.[4].x).toBe(0)
            expect(res.components?.[4].y).toBe(10)

            // Second inner of second middle at y=15 (relative to parent)
            expect(res.components?.[5].x).toBe(0)
            expect(res.components?.[5].y).toBe(15)
        })

        test("should update nested component positions correctly with alignment", () => {
            const inner = row({
                items: [element({ w: 5, h: 5 })],
            })
            const middle = column({
                items: [inner],
            })

            const res = column({
                items: [element({ w: 20, h: 10 }), middle],
                align: "center",
            })

            // Should have 1 component (middle) + 1 nested (inner) = 2 total
            expect(res.components?.length).toBe(2)

            // Middle component should be positioned after the first element
            expect(res.components?.[0].y).toBe(10)
            // And centered horizontally in the column width
            expect(res.components?.[0].x).toBe(7.5) // (20 - 5) / 2

            // Inner component position should be absolute (middle.y + inner.y)
            expect(res.components?.[1].y).toBe(10) // 10 + 0
            expect(res.components?.[1].x).toBe(7.5) // 7.5 + 0
        })
    })

    describe("anchor propagation issues", () => {
        test("anchor value should not exceed component height in column", () => {
            // Create two rows with horizontal anchors
            const row1 = row({
                items: [
                    element({ w: 80, h: 10, anchor: { x: 5 } }),
                    element({ w: 24, h: 24, anchor: { x: 12 } }),
                ],
                align: "anchor",
            })
            const row2 = row({
                items: [
                    element({ w: 80, h: 10, anchor: { x: 5 } }),
                    element({ w: 24, h: 24, anchor: { x: 12 } }),
                ],
                align: "anchor",
            })

            // Put them in a column
            const col = column({
                items: [row1, row2],
                align: "anchor",
            })

            // The anchor value should not exceed the component height
            if (col.anchor && "horizontal" in col.anchor) {
                expect(col.anchor.horizontal).toBeLessThanOrEqual(col.h)
            }
        })

        test("should use horizontal anchor when top and bottom values are equal", () => {
            // Create two rows with the same horizontal anchor
            const row1 = row({
                items: [element({ w: 10, h: 10, anchor: { x: 5 } })],
                align: "anchor",
            })
            const row2 = row({
                items: [element({ w: 10, h: 10, anchor: { x: 5 } })],
                align: "anchor",
            })

            // Put them in a column with anchor alignment
            const col = column({
                items: [row1, row2],
                align: "anchor",
            })

            // Since both rows have the same anchor at Y=5, column should have {horizontal: 5}
            expect(col.anchor).toEqual({ x: 5 })
        })

        test("column with rows having vertical anchors should NOT get horizontal anchor", () => {
            // Create rows with vertical anchors (typical for rows)
            const row1 = row({
                items: [
                    element({ w: 10, h: 10, anchor: { y: 5 } }),
                    element({ w: 10, h: 10, anchor: { y: 5 } }),
                ],
                align: "anchor",
            })
            const row2 = row({
                items: [element({ w: 10, h: 10, anchor: { y: 5 } })],
                align: "anchor",
            })

            // Put them in a column
            const col = column({
                items: [row1, row2],
                align: "left",
            })

            // Column should NOT have a horizontal anchor since rows have vertical anchors
            if (col.anchor) {
                expect(col.anchor).not.toHaveProperty("horizontal")
            }
        })
    })
})

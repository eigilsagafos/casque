import { describe, expect, test } from "bun:test"
import { createLine, createStep } from "./test-utils"
import { element } from "./element"
import { row } from "./row"
import { column } from "./column"

describe("row", () => {
    test("nested rows with anchor align", () => {
        const sequence = row({
            id: "sequence",
            items: [
                createLine(),
                createStep({ id: "step1", header: true }),
                createLine(),
            ],
            align: "anchor",
        })

        const res = row({
            items: [
                element({ w: 80, h: 30 }),
                sequence,
                element({ w: 80, h: 30 }),
            ],
            align: "anchor",
        })

        const placedSequence = res.components.find(
            comp => comp.id === "sequence",
        )

        expect(placedSequence.x).toBe(80)
        // console.log("sequence", placedSequence)
    })

    describe("top align", () => {
        test("single element", () => {
            const box1 = element({ w: 10, h: 10 })
            const res = row({
                items: [box1],
                align: "top",
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
            const res = row({
                items: [box1, box2],
                align: "top",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(10)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
        })
        test("two elements with differnt size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 20 })
            const res = row({
                items: [box1, box2],
                align: "top",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
        })
    })
    // describe("margin",)

    describe("bottom align", () => {
        test("two elements with differnt size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 20 })
            const res = row({
                items: [box1, box2],
                align: "bottom",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(10)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
        })
    })
    describe("center align", () => {
        test("two elements with differnt size", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 20 })
            const res = row({
                items: [box1, box2],
                align: "center",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(5)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
        })
        test("three elements with increasing height", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({ w: 10, h: 20 })
            const box3 = element({ w: 10, h: 30 })
            const res = row({
                items: [box1, box2, box3],
                align: "center",
            })
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(10)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(5)
            expect(res.elements[2].x).toBe(20)
            expect(res.elements[2].y).toBe(0)
        })
        test("three elements with decreasing height", () => {
            const box1 = element({ w: 10, h: 30 })
            const box2 = element({ w: 10, h: 20 })
            const box3 = element({ w: 10, h: 10 })
            const res = row({
                items: [box1, box2, box3],
                align: "center",
            })
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(5)
            expect(res.elements[2].x).toBe(20)
            expect(res.elements[2].y).toBe(10)
        })
    })

    describe("anchor align", () => {
        test("two elements with same anchor point", () => {
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
            const res = row({
                items: [box1, box2],
                align: "anchor",
            })
            expect(res.w).toBe(20)
            expect(res.h).toBe(15)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(5)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
        })

        test("element with left/right anchors for asymmetric alignment", () => {
            // box1 connects to next element at y=8 (right anchor)
            // box2 connects to previous element at y=3 (left anchor)
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { y: [5, 8] },
            })
            const box2 = element({
                w: 10,
                h: 10,
                anchor: { y: [3, 7] },
            })
            const res = row({
                items: [box1, box2],
                align: "anchor",
            })
            // box1's right anchor (y=8) should align with box2's left anchor (y=3)
            // This means box2 needs to be offset by 5 pixels down
            expect(res.w).toBe(20)
            expect(res.h).toBe(15) // max(10, 10+5)
            expect(res.elements.length).toBe(2)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(5)
        })

        test("three elements with left/right anchors", () => {
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { y: [5, 5] },
            })
            const box2 = element({
                w: 10,
                h: 20,
                anchor: { y: [10, 15] },
            })
            const box3 = element({
                w: 10,
                h: 10,
                anchor: { y: [7, 7] },
            })
            const res = row({
                items: [box1, box2, box3],
                align: "anchor",
            })
            console.log("res", res)
            // box1.right (y=5) aligns with box2.left (y=10)
            // Since we can't offset box2 negatively, we offset box1 down by 5
            // box2.right (y=15) aligns with box3.left (y=7) -> box3 offset by +8
            // Heights: box1 bottom=15, box2 bottom=20, box3 bottom=18 -> max=20
            expect(res.w).toBe(30)
            expect(res.h).toBe(20)
            expect(res.elements.length).toBe(3)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(5) // offset to align with box2
            expect(res.elements[1].x).toBe(10)
            expect(res.elements[1].y).toBe(0)
            expect(res.elements[2].x).toBe(20)
            expect(res.elements[2].y).toBe(8) // offset to align with box2's right
        })

        test.todo("auto-calculate horizontal anchor from child vertical anchor", () => {
            const box1 = element({
                w: 10,
                h: 10,
                anchor: { y: 5 },
            })
            const box2 = element({
                w: 10,
                h: 20,
            })
            const box3 = element({
                w: 10,
                h: 10,
            })
            const res = row({
                items: [box1, box2, box3],
                align: "center",
            })
            // box1 is at x=0, has y anchor at 5
            // Row should get y anchor at 0 + 5 = 5
            expect(res.anchor).toEqual({ y: 5 })
        })

        test.todo("auto-calculate horizontal anchor from middle child", () => {
            const box1 = element({ w: 10, h: 10 })
            const box2 = element({
                w: 10,
                h: 20,
                anchor: { y: 5 },
            })
            const box3 = element({ w: 10, h: 10 })
            const res = row({
                items: [box1, box2, box3],
                align: "center",
            })
            // box2 is at x=10, has y anchor at 5
            // Row should get y anchor at 10 + 5 = 15
            expect(res.anchor).toEqual({ y: 15 })
        })
    })

    describe("margin", () => {
        test("two elements with same margin - margins overlap", () => {
            const box1 = element({ w: 10, h: 10, margin: 5 })
            const box2 = element({ w: 10, h: 10, margin: 5 })
            const res = row({
                items: [box1, box2],
                align: "top",
            })
            // Margins overlap: max(5, 5) = 5, not 10
            expect(res.w).toBe(25) // 10 + 5 + 10
            expect(res.h).toBe(10)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[1].x).toBe(15) // 10 + 5
        })

        test("two elements with different margins - use max", () => {
            const box1 = element({ w: 10, h: 10, margin: 8 })
            const box2 = element({ w: 10, h: 10, margin: 3 })
            const res = row({
                items: [box1, box2],
                align: "top",
            })
            // Margins overlap: max(8, 3) = 8
            expect(res.w).toBe(28) // 10 + 8 + 10
            expect(res.h).toBe(10)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[1].x).toBe(18) // 10 + 8
        })

        test("margin with object syntax", () => {
            const box1 = element({
                w: 10,
                h: 10,
                margin: { left: 2, right: 8, top: 0, bottom: 0 },
            })
            const box2 = element({
                w: 10,
                h: 10,
                margin: { left: 3, right: 5, top: 0, bottom: 0 },
            })
            const res = row({
                items: [box1, box2],
                align: "top",
            })
            // box1's right (8) and box2's left (3): max(8, 3) = 8
            expect(res.w).toBe(28) // 10 + 8 + 10
            expect(res.h).toBe(10)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[1].x).toBe(18) // 10 + 8
        })

        test("three elements with margins", () => {
            const box1 = element({ w: 10, h: 10, margin: 5 })
            const box2 = element({ w: 10, h: 10, margin: 10 })
            const box3 = element({ w: 10, h: 10, margin: 3 })
            const res = row({
                items: [box1, box2, box3],
                align: "top",
            })
            // box1-box2: max(5, 10) = 10
            // box2-box3: max(10, 3) = 10
            expect(res.w).toBe(50) // 10 + 10 + 10 + 10 + 10
            expect(res.h).toBe(10)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[1].x).toBe(20) // 10 + 10
            expect(res.elements[2].x).toBe(40) // 20 + 10 + 10
        })
    })

    describe("nested components", () => {
        test("optimize spacing for columns with centered elements", () => {
            // Create columns with small elements centered in them
            const col1 = column({
                items: [element({ w: 5, h: 10 })],
                align: "center", // Element centered at x=0 in a w=5 column
            })
            const col2 = column({
                items: [element({ w: 5, h: 10 })],
                align: "center", // Element centered at x=0 in a w=5 column
            })

            // With Tetris-style collision detection:
            // col1 element is at x=0, width 5
            // col2 element is at x=0, width 5
            // No vertical overlap issues, so col2 can start immediately after col1 element ends
            const res = row({
                items: [col1, col2],
                align: "top",
            })

            // col1 element at x=0, width 5 (ends at x=5)
            // col2 element should be positioned right after (no gap needed since elements don't overlap vertically)
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].w).toBe(5)
            expect(res.elements[1].x).toBe(5) // Starts where col1 element ends
            expect(res.elements[1].w).toBe(5)
            expect(res.w).toBe(10) // Total width: tightly packed
        })

        test("tetris-style staircase pattern optimization", () => {
            // col1: elements descending (top to bottom)
            // y=0: width 10
            // y=10: width 8
            // y=20: width 6
            const col1 = column({
                items: [
                    element({ w: 10, h: 10 }),
                    element({ w: 8, h: 10 }),
                    element({ w: 6, h: 10 }),
                ],
                align: "left",
            })

            // col2: elements ascending (bottom to top)
            // y=0: width 4
            // y=10: width 6
            // y=20: width 8
            const col2 = column({
                items: [
                    element({ w: 4, h: 10 }),
                    element({ w: 6, h: 10 }),
                    element({ w: 8, h: 10 }),
                ],
                align: "left",
            })

            const res = row({
                items: [col1, col2],
                align: "top",
            })

            // Tetris optimization should fit col2 into col1's gaps:
            // y=0-10: col1 ends at x=10, col2 starts at x=0, needs to be at x=10
            // y=10-20: col1 ends at x=8, col2 starts at x=0, needs to be at x=8
            // y=20-30: col1 ends at x=6, col2 starts at x=0, needs to be at x=6
            // The minimum gap is x=10 (from the first row overlap)
            expect(res.elements[3].x).toBe(10) // col2's first element
            expect(res.w).toBe(18) // col2 starts at x=10, width 8 -> ends at x=18
        })

        test("row with 3 columns, center aligned", () => {
            const col1 = column({
                items: [element({ w: 10, h: 10 }), element({ w: 10, h: 10 })],
                align: "center",
            })
            const col2 = column({
                items: [
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 10 }),
                    element({ w: 10, h: 10 }),
                ],
                align: "center",
            })
            const col3 = column({
                items: [element({ w: 10, h: 10 })],
                align: "center",
            })

            const res = row({
                items: [col1, col2, col3],
                align: "center",
            })

            // Row dimensions: width = sum of column widths, height = tallest column
            expect(res.w).toBe(30)
            expect(res.h).toBe(30)
            expect(res.elements.length).toBe(6)

            // col1 (h=20) centered in h=30: offset by 5
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(5)
            expect(res.elements[1].x).toBe(0)
            expect(res.elements[1].y).toBe(15)

            // col2 (h=30) centered in h=30: no offset
            expect(res.elements[2].x).toBe(10)
            expect(res.elements[2].y).toBe(0)
            expect(res.elements[3].x).toBe(10)
            expect(res.elements[3].y).toBe(10)
            expect(res.elements[4].x).toBe(10)
            expect(res.elements[4].y).toBe(20)

            // col3 (h=10) centered in h=30: offset by 10
            expect(res.elements[5].x).toBe(20)
            expect(res.elements[5].y).toBe(10)
        })
    })

    describe("components array tracking", () => {
        test("should track sub-components with their positions", () => {
            const col1 = column({
                items: [element({ w: 10, h: 10 }), element({ w: 10, h: 10 })],
            })
            const col2 = column({
                items: [element({ w: 10, h: 10 })],
            })

            const res = row({
                items: [col1, col2],
            })

            expect(res.components).toBeDefined()
            expect(res.components?.length).toBe(2)

            // First component at x=0
            expect(res.components?.[0].x).toBe(0)
            expect(res.components?.[0].y).toBe(0)
            expect(res.components?.[0].w).toBe(10)
            expect(res.components?.[0].h).toBe(20)

            // Second component at x=10
            expect(res.components?.[1].x).toBe(10)
            expect(res.components?.[1].y).toBe(0)
            expect(res.components?.[1].w).toBe(10)
            expect(res.components?.[1].h).toBe(10)
        })

        test("should flatten nested components recursively", () => {
            // Create innermost components
            const inner1 = column({
                items: [element({ w: 5, h: 5 })],
            })
            const inner2 = column({
                items: [element({ w: 5, h: 5 })],
            })

            // Create middle level components with nested components
            const middle1 = row({
                items: [inner1, inner2],
            })
            const middle2 = row({
                items: [inner1, inner2],
            })

            // Create top level row with 2 components, each having 2 sub-components
            const res = row({
                items: [middle1, middle2],
            })

            // Should have 6 total components: 2 middle + 4 inner (2 from each middle)
            expect(res.components?.length).toBe(6)

            // Verify the structure: first middle component at x=0
            expect(res.components?.[0].x).toBe(0)
            expect(res.components?.[0].y).toBe(0)

            // First inner of first middle at x=0 (relative to parent)
            expect(res.components?.[1].x).toBe(0)
            expect(res.components?.[1].y).toBe(0)

            // Second inner of first middle at x=5 (relative to parent)
            expect(res.components?.[2].x).toBe(5)
            expect(res.components?.[2].y).toBe(0)

            // Second middle component at x=10
            expect(res.components?.[3].x).toBe(10)
            expect(res.components?.[3].y).toBe(0)

            // First inner of second middle at x=10 (relative to parent)
            expect(res.components?.[4].x).toBe(10)
            expect(res.components?.[4].y).toBe(0)

            // Second inner of second middle at x=15 (relative to parent)
            expect(res.components?.[5].x).toBe(15)
            expect(res.components?.[5].y).toBe(0)
        })

        test("should update nested component positions correctly with alignment", () => {
            const inner = column({
                items: [element({ w: 5, h: 5 })],
            })
            const middle = row({
                items: [inner],
            })

            const res = row({
                items: [element({ w: 10, h: 20 }), middle],
                align: "center",
            })

            // Should have 1 component (middle) + 1 nested (inner) = 2 total
            expect(res.components?.length).toBe(2)

            // Middle component should be positioned after the first element
            expect(res.components?.[0].x).toBe(10)
            // And centered vertically in the row height
            expect(res.components?.[0].y).toBe(7.5) // (20 - 5) / 2

            // Inner component position should be absolute (middle.x + inner.x)
            expect(res.components?.[1].x).toBe(10) // 10 + 0
            expect(res.components?.[1].y).toBe(7.5) // 7.5 + 0
        })

        test("should position element after component correctly", () => {
            // Create a column component
            const col = column({
                items: [element({ w: 50, h: 30 })],
            })

            // Add an element after the component in a row
            const res = row({
                items: [col, element({ w: 20, h: 10 })],
                align: "top",
            })

            // Column should be at x=0
            expect(res.components?.[0].x).toBe(0)
            expect(res.components?.[0].y).toBe(0)

            // Element from column should be at x=0
            expect(res.elements[0].x).toBe(0)
            expect(res.elements[0].y).toBe(0)

            // Standalone element should be positioned after the column (at x=50)
            expect(res.elements[1].x).toBe(50)
            expect(res.elements[1].y).toBe(0)

            // Total width should be 70 (50 + 20)
            expect(res.w).toBe(70)
            expect(res.h).toBe(30)
        })

        test("should position element after component with anchor alignment and packing", () => {
            // Create a column component with anchor
            const col = column({
                items: [
                    element({
                        id: "icon",
                        w: 48,
                        h: 48,
                        anchor: { y: 24 },
                    }),
                    element({ id: "text", w: 120, h: 20 }),
                ],
                align: "center",
            })

            // Add an element after the component in a row with anchor alignment
            // With pack=true (default), the line should pack in next to the icon
            const res = row({
                items: [
                    col,
                    element({
                        id: "line",
                        w: 80,
                        h: 10,
                        anchor: { y: 5 },
                    }),
                ],
                align: "anchor",
            })

            // Column should be at x=0
            expect(res.components?.[0].x).toBe(0)

            // Find elements by id
            const icon = res.elements.find(el => el.id === "icon")
            const lineElement = res.elements.find(el => el.id === "line")

            // With packing, line should pack in next to the icon (not after the full column width)
            expect(lineElement?.x).not.toBeNaN()
            expect(lineElement?.x).toBe(icon!.x + icon!.w) // Pack next to icon: 36 + 48 = 84

            // Total width should not be NaN
            expect(res.w).not.toBeNaN()
            expect(res.h).not.toBeNaN()
        })
    })

    describe("anchor propagation simplification", () => {
        test("should use vertical anchor when left and right values are equal", () => {
            // Create two columns with the same x anchor
            const col1 = column({
                items: [element({ w: 10, h: 10, anchor: { x: 5 } })],
                align: "anchor",
            })
            const col2 = column({
                items: [element({ w: 10, h: 10, anchor: { x: 5 } })],
                align: "anchor",
            })

            // Put them in a row with anchor alignment
            const res = row({
                items: [col1, col2],
                align: "anchor",
            })

            // Since both columns have the same anchor at X=5, row should have {y: 5}
            expect(res.anchor).toEqual({ y: 5 })
        })

        test("row with columns having horizontal anchors should NOT get vertical anchor", () => {
            // Create columns with horizontal anchors (typical for columns)
            const col1 = column({
                items: [
                    element({ w: 10, h: 10, anchor: { y: 5 } }),
                    element({ w: 10, h: 10, anchor: { y: 5 } }),
                ],
                align: "anchor",
            })
            const col2 = column({
                items: [element({ w: 10, h: 10, anchor: { y: 5 } })],
                align: "anchor",
            })

            // Put them in a row
            const res = row({
                items: [col1, col2],
                align: "top",
            })

            // Row should NOT have a vertical anchor since columns have horizontal anchors
            if (res.anchor) {
                expect(res.anchor).not.toHaveProperty("vertical")
            }
        })
    })

    test("left/right anchor in row", () => {
        const row1 = row({
            items: [
                element({
                    id: "item1",
                    w: 10,
                    h: 10,
                    anchor: { y: 5 },
                }),
                element({
                    id: "item2",
                    w: 10,
                    h: 10,
                    anchor: { y: [5, 8] },
                }),
                element({
                    id: "item2",
                    w: 10,
                    h: 10,
                    anchor: { y: 5 },
                }),
            ],
            align: "anchor",
        })
        // expect(row1.height).toBe(10)
        console.log(row1)
    })

    test("anchor left/right", () => {
        const seq = row({
            items: [
                element({
                    w: 48,
                    h: 48,
                    anchor: { y: 24 },
                }),
                element({
                    w: 48,
                    h: 48,
                    anchor: { y: [24, 40] },
                }),
                element({
                    w: 80,
                    h: 10,
                    anchor: { y: 5 },
                }),
            ],
            align: "anchor",
        })

        const res = row({
            items: [
                element({
                    w: 50,
                    h: 20,
                    anchor: { y: 10 },
                }),
                seq,
            ],
            align: "anchor",
        })
        expect(res.anchor).toEqual({ y: [24, 40] })
    })
})

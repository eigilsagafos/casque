import { describe, expect, test } from "bun:test"
import { column } from "./column"
import { element } from "./element"
import { row } from "./row"

describe("margin gap calculations", () => {
    test("column with two elements with margins should have correct gap", () => {
        const labelsColumn = column({
            id: "SplitHeadLabels",
            items: [
                element({
                    id: "Label1",
                    w: 120,
                    h: 32,
                    margin: { top: 4, right: 0, bottom: 4, left: 4 },
                }),
                element({
                    id: "Label2",
                    w: 120,
                    h: 32,
                    margin: { top: 4, right: 0, bottom: 4, left: 4 },
                }),
            ],
            pack: false,
        })

        const gap =
            labelsColumn.elements[1].y -
            (labelsColumn.elements[0].y + labelsColumn.elements[0].h)

        // With collapsed margins (CSS-style): gap should be max(4, 4) = 4
        // Label 1: y=0 to y=32, margin extends to y=36
        // Label 2: should start at y=36, margin needs space from y=32
        // Result: labels at y=0 and y=36, gap of 4
        expect(labelsColumn.elements[0].y).toBe(0)
        expect(labelsColumn.elements[1].y).toBe(36)
        expect(gap).toBe(4)
    })

    test("nested: column with margins wrapped in row should preserve gaps", () => {
        const labelsColumn = column({
            id: "SplitHeadLabels",
            items: [
                element({
                    id: "Label1",
                    w: 120,
                    h: 32,
                    margin: { top: 4, right: 0, bottom: 4, left: 4 },
                }),
                element({
                    id: "Label2",
                    w: 120,
                    h: 32,
                    margin: { top: 4, right: 0, bottom: 4, left: 4 },
                }),
            ],
            pack: false,
        })

        const gapInColumn =
            labelsColumn.elements[1].y -
            (labelsColumn.elements[0].y + labelsColumn.elements[0].h)

        // Wrap in a row
        const outerRow = row({
            id: "DecisionHead",
            items: [element({ id: "Diamond", w: 48, h: 48 }), labelsColumn],
        })

        const labelInRow1 = outerRow.elements.find(el => el.id === "Label1")!
        const labelInRow2 = outerRow.elements.find(el => el.id === "Label2")!
        const gapInRow = labelInRow2.y - (labelInRow1.y + labelInRow1.h)

        // The gap should be preserved when nesting
        expect(gapInRow).toBe(gapInColumn)
    })

    test("deeply nested (3 levels) should preserve gaps and margins", () => {
        // Create a deeply nested structure
        const innerColumn = column({
            id: "inner",
            items: [
                element({
                    id: "A",
                    w: 50,
                    h: 20,
                    margin: 10,
                }),
                element({
                    id: "B",
                    w: 50,
                    h: 20,
                    margin: 10,
                }),
            ],
            pack: false,
        })

        const gapInInner =
            innerColumn.elements[1].y -
            (innerColumn.elements[0].y + innerColumn.elements[0].h)

        const middleRow = row({
            id: "middle",
            items: [
                element({ id: "C", w: 30, h: 50, margin: 10 }),
                innerColumn,
            ],
        })

        const aInMiddle = middleRow.elements.find(el => el.id === "A")!
        const bInMiddle = middleRow.elements.find(el => el.id === "B")!
        const gapInMiddle = bInMiddle.y - (aInMiddle.y + aInMiddle.h)

        const outerColumn = column({
            id: "outer",
            items: [element({ id: "D", w: 80, h: 30, margin: 10 }), middleRow],
            pack: false,
        })

        const aInOuter = outerColumn.elements.find(el => el.id === "A")!
        const bInOuter = outerColumn.elements.find(el => el.id === "B")!
        const cInOuter = outerColumn.elements.find(el => el.id === "C")!
        const dInOuter = outerColumn.elements.find(el => el.id === "D")!

        const gapInOuter = bInOuter.y - (aInOuter.y + aInOuter.h)
        const gapDtoC = cInOuter.y - (dInOuter.y + dInOuter.h)

        // Gaps should be preserved at all levels
        expect(gapInOuter).toBe(gapInInner)

        // C's margin should be respected when placing after D
        // D: y=0, h=30, margin=10 (bottom) → extends to y=40
        // C: margin=10 (top) → needs space from y=40
        // With collapsed margins: C should be at y=40
        expect(gapDtoC).toBe(10)
    })
})

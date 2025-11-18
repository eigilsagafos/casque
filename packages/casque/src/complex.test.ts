// import { element, row, column } from "
import { describe, expect, test } from "bun:test"
import { column } from "./column"
import { element } from "./element"
import { row } from "./row"
import { generateId } from "./utils/generateId"
import type { PositionedElement } from "../types/PositionedElement"

const createIcon = (id?: string) => {
    return element({
        id,
        w: 48,
        h: 48,
        anchor: { x: 24 },
        margin: { bottom: 4 },
    })
}
const createNarrative = (id?: string) => {
    return element({
        id,
        w: 120,
        h: 20,
        margin: { left: 8, right: 8 },
    })
}

const createStep = (id: string = generateId()) => {
    const icon = createIcon(id + "-icon")
    return column({
        id,
        items: [icon, createNarrative(id + "-narrative")],
        align: "center",
        anchorItemId: icon.id,
    })
}

const createDecision = (id?: string) => {
    const icon = createIcon()
    return row({
        items: [icon],
        align: "anchor",
        // anchorItemId: icon.id,
    })
}

const createLine = (id: string = generateId()) => {
    return element({
        id,
        w: 80,
        h: 10,
        anchor: { x: 5 },
    })
}

const step1 = createStep({ id: "step1" })
const step2 = createStep()
const decision = createDecision()

describe("complex", () => {
    test.todo("sequence", () => {
        const layout = row({
            items: [step1, createLine("line1"), step2],
            align: "anchor",
        })
        console.log("layout", layout)
        expect(layout.w).not.toBe(NaN)
        const icon1 = layout.elements.find(
            el => el.id === "step1-icon",
        ) as PositionedElement
        const line1 = layout.elements.find(
            el => el.id === "line1",
        ) as PositionedElement
        expect(line1.x).toBe(icon1.x + icon1.w)
    })
})

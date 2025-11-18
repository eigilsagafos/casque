import { describe, expect, test } from "bun:test"
import { column } from "./column"
import { element } from "./element"
import { row } from "./row"

describe("pack mode margin overlap", () => {
    test("column with pack:true should collapse margins between elements", () => {
        const col = column({
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
            pack: true,
        })

        const gap = col.elements[1].y - (col.elements[0].y + col.elements[0].h)

        // With margin collapse: max(10, 10) = 10
        expect(gap).toBe(10)
    })

    test("row with pack:false should collapse margins between elements", () => {
        const r = row({
            items: [
                element({
                    id: "A",
                    w: 20,
                    h: 50,
                    margin: 10,
                }),
                element({
                    id: "B",
                    w: 20,
                    h: 50,
                    margin: 10,
                }),
            ],
            pack: false,
        })

        const gap = r.elements[1].x - (r.elements[0].x + r.elements[0].w)

        // With margin collapse: max(10, 10) = 10
        expect(gap).toBe(10)
    })

    test("column with pack:true and nested components should collapse margins", () => {
        const innerRow = row({
            id: "inner",
            items: [
                element({ id: "A", w: 30, h: 20, margin: 10 }),
                element({ id: "B", w: 30, h: 20, margin: 10 }),
            ],
            pack: false,
        })

        const col = column({
            items: [element({ id: "C", w: 80, h: 30, margin: 10 }), innerRow],
            pack: true,
        })

        const cEl = col.elements.find(el => el.id === "C")!
        const aEl = col.elements.find(el => el.id === "A")!

        const gap = aEl.y - (cEl.y + cEl.h)

        // With margin collapse: max(10, 10) = 10
        // C ends at y=30, A should start at y=40
        expect(gap).toBe(10)
    })

    test("row with pack:true should collapse margins between components", () => {
        const col1 = column({
            id: "col1",
            items: [element({ id: "A", w: 20, h: 30, margin: 10 })],
            pack: false,
        })

        const col2 = column({
            id: "col2",
            items: [element({ id: "B", w: 20, h: 30, margin: 10 })],
            pack: false,
        })

        const r = row({
            items: [col1, col2],
            pack: true,
        })

        const aEl = r.elements.find(el => el.id === "A")!
        const bEl = r.elements.find(el => el.id === "B")!

        const gap = bEl.x - (aEl.x + aEl.w)

        // With margin collapse: max(10, 10) = 10
        expect(gap).toBe(10)
    })
})

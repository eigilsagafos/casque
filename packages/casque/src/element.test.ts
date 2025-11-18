import { describe, expect, test } from "bun:test"
import { element } from "./element"

describe("element", () => {
    test("fails when missing h", () => {
        // @ts-ignore
        expect(() => element({ w: 0 })).toThrow(
            "Element must have a height (h)",
        )
    })

    test("fails when missing w", () => {
        // @ts-ignore
        expect(() => element({ h: 0 })).toThrow("Element must have a width (w)")
    })

    test("default id", () => {
        const box = element({ w: 10, h: 10 })
        expect(box.id).toBeString()
    })

    test("provided id", () => {
        const box = element({ id: "test", w: 10, h: 10 })
        expect(box.id).toBe("test")
    })

    test("default anchor", () => {
        const box = element({ w: 10, h: 10 })
        expect(box.anchor).toEqual({ x: 5, y: 5 })
    })

    test("default anchor one axis provided", () => {
        const box = element({ w: 10, h: 10, anchor: { x: 2 } })
        expect(box.anchor).toEqual({ x: 2, y: 5 })
    })
})

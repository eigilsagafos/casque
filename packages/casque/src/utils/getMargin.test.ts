import { describe, expect, test } from "bun:test"
import { getMargin } from "./getMargin"

describe("getMargin", () => {
    test("element with top/bottom anchors for asymmetric alignment", () => {
        expect(getMargin(undefined, "left")).toBe(0)
        expect(getMargin({}, "left")).toBe(0)
        expect(getMargin(0, "left")).toBe(0)
        expect(getMargin(1, "left")).toBe(1)
        expect(getMargin({ right: 1 }, "left")).toBe(0)
        expect(getMargin({ right: 1 }, "right")).toBe(1)
    })
})

import type { Element } from "../types/Element"
import type { ElementArgs } from "../types/ElementArgs"
import { generateId } from "./utils/generateId"

const validateElementArgs = (args: ElementArgs) => {
    if (args.h === undefined) throw new Error("Element must have a height (h)")
    if (args.w === undefined) throw new Error("Element must have a width (w)")
    if (typeof args.h !== "number")
        throw new Error("Element height (h) must be a number")
    if (typeof args.w !== "number")
        throw new Error("Element width (w) must be a number")
}

export const element = (args: ElementArgs): Element => {
    validateElementArgs(args)
    const { id = generateId(), w, h, anchor, margin, meta } = args
    const defaultAnchor = { x: w / 2, y: h / 2 }
    const finalAnchor = anchor
        ? {
              x: "x" in anchor ? anchor.x : w / 2,
              y: "y" in anchor ? anchor.y : h / 2,
          }
        : defaultAnchor
    return {
        id,
        w,
        h,
        anchor: finalAnchor,
        margin,
        meta,
    }
}

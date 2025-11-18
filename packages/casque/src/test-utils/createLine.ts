import { element } from "../index"
import { generateId } from "./generateId"

export const createLine = (id: string = generateId()) =>
    element({
        id,
        w: 80,
        h: 10,
        anchor: { x: 5 },
    })

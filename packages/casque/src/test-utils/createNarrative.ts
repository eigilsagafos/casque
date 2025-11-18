import { element } from "../index"
import { generateId } from "./generateId"

export const createNarrative = (id: string = generateId()) =>
    element({
        id,
        w: 120,
        h: 20,
        margin: { left: 8, right: 8 },
    })

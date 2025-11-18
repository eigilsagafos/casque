import { element } from "../index"

export const createIcon = (id?: string) =>
    element({
        id,
        w: 48,
        h: 48,
        anchor: { x: 24 },
        margin: { bottom: 4 },
    })

import { column, element } from "../index"
import { createIcon } from "./createIcon"
import { generateId } from "./generateId"
import { createNarrative } from "./createNarrative"

export const createHeader = (id: string = generateId()) =>
    element({
        id,
        w: 40,
        h: 20,
        margin: { top: 8, bottom: 8 },
    })
export const createFooter = (id: string = generateId()) =>
    element({
        id,
        w: 40,
        h: 20,
        margin: { top: 8, bottom: 8 },
    })

export const createStep = ({
    id = generateId(),
    header = false,
    narrative = false,
    footer = false,
} = {}) => {
    const items = []
    const icon = createIcon(id + "-icon")
    if (header) items.push(createHeader(id + "-header"))
    items.push(icon)
    if (narrative) items.push(createNarrative(id + "-header"))
    if (footer) items.push(createFooter(id + "-header"))
    return column({
        id,
        items: items,
        align: "center",
        anchorItemId: icon.id,
    })
}

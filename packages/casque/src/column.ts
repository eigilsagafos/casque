import type { Component } from "../types/Component"
import type { Element } from "../types/Element"
import { stack } from "./stack"
import { generateId } from "./utils/generateId"

type ColumnAlignment = "left" | "center" | "right" | "anchor"

type ColumnArgs = {
    id?: string
    items: (Element | Component)[]
    align?: ColumnAlignment
    pack?: boolean
    anchorItemId?: string
    meta?: Record<string, any>
}

// Map column-specific alignment to generic stack alignment
const mapAlignment = (
    align: ColumnAlignment,
): "start" | "center" | "end" | "anchor" => {
    switch (align) {
        case "left":
            return "start"
        case "center":
            return "center"
        case "right":
            return "end"
        case "anchor":
            return "anchor"
    }
}

export const column = ({
    id = generateId(),
    items,
    align = "left",
    pack = true,
    anchorItemId,
    meta,
}: ColumnArgs) => {
    return stack({
        id,
        items,
        axis: "vertical",
        align: mapAlignment(align),
        pack,
        anchorItemId,
        meta,
    })
}

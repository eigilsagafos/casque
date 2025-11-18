import type { Component } from "../types/Component"
import type { Element } from "../types/Element"
import { stack } from "./stack"
import { generateId } from "./utils/generateId"

type RowAlignment = "top" | "center" | "bottom" | "anchor"

type RowArgs = {
    id?: string
    items: (Element | Component)[]
    align?: RowAlignment
    pack?: boolean
    anchorItemId?: string
    meta?: Record<string, any>
}

// Map row-specific alignment to generic stack alignment
const mapAlignment = (
    align: RowAlignment,
): "start" | "center" | "end" | "anchor" => {
    switch (align) {
        case "top":
            return "start"
        case "center":
            return "center"
        case "bottom":
            return "end"
        case "anchor":
            return "anchor"
    }
}

export const row = ({
    id = generateId(),
    items,
    align = "top",
    pack = true,
    anchorItemId,
    meta,
}: RowArgs) => {
    return stack({
        id,
        items,
        axis: "horizontal",
        align: mapAlignment(align),
        pack,
        anchorItemId,
        meta,
    })
}

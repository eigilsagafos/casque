import type { Anchor } from "./Anchor"
import type { Margin } from "./Margin"

export type Element = {
    id: string
    w: number
    h: number
    margin?: Margin
    anchor?: Anchor
    parentId?: string
    meta?: Record<string, any>
}

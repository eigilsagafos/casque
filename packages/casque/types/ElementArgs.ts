import type { Anchor } from "./Anchor"
import type { Margin } from "./Margin"

export type ElementArgs = {
    id?: string
    w: number
    h: number
    anchor?: Anchor
    margin?: Margin
    meta?: Record<string, any>
}

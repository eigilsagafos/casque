import type { Anchor } from "./Anchor"
import type { PositionedElement } from "./PositionedElement"

export type Component = {
    id?: string
    elements: PositionedElement[]
    components?: PositionedComponent[]
    w: number
    h: number
    anchor?: Anchor
    meta?: Record<string, any>
}

// Forward declaration - PositionedComponent includes Component
export type PositionedComponent = Component & {
    x: number
    y: number
    parentId?: string
}

// Component reference for debugging - only stores position/size, no content
export type ComponentReference = {
    id?: string
    x: number
    y: number
    w: number
    h: number
    anchor?: Anchor
    parentId?: string
    meta?: Record<string, any>
}

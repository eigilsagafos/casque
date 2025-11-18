import type { Component } from "./Component"

export type PositionedComponent = Component & {
    x: number
    y: number
}

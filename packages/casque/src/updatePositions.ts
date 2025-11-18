import type { PositionedElement } from "../types/PositionedElement"

export const updatePositions = (
    element: PositionedElement,
    offset: { x: number; y: number },
): PositionedElement => {
    return {
        ...element,
        x: element.x + offset.x,
        y: element.y + offset.y,
    }
}

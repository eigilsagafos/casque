import { element } from "./element"
import type { ElementArgs } from "../types/ElementArgs"
import type { PositionedElement } from "../types/PositionedElement"

type PositionedElementArgs = ElementArgs & {
    x: number
    y: number
}

export const positionedElement = ({
    x,
    y,
    ...elementArgs
}: PositionedElementArgs): PositionedElement => {
    return {
        ...element(elementArgs),
        x,
        y,
    }
}

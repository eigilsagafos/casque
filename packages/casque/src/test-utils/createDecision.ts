import { column, element, row } from "../index"
import { createIcon } from "./createIcon"
import { generateId } from "./generateId"
import { createStep } from "./createStep"
import { createLine } from "./createLine"

const createLabel = (id: string = generateId()) =>
    element({
        id,
        w: 120,
        h: 28,
        margin: { left: 8, right: 8, bottom: 4, top: 4 },
        anchor: { x: 14 },
    })

const createLabels = ({ count = 2, id = generateId() } = {}) => {
    if (count < 2) throw new Error("Count must be at least 2")
    const labels = Array.from({ length: count }, (_, i) =>
        createLabel(id + "-label-" + i),
    ) as [
        ReturnType<typeof createLabel>,
        ReturnType<typeof createLabel>,
        ...ReturnType<typeof createLabel>[],
    ]
    return column({
        id,
        items: labels,
        align: "left",
        anchorItemId: labels[0].id,
    })
}

const createSequence = ({ id = generateId() } = {}) => {
    const step1 = createStep()
    const step2 = createStep()
    return row({
        id,
        items: [step1, createLine(), step2],
        align: "anchor",
    })
}

const createPath = ({
    id = generateId(),
    sequence = createSequence({}),
} = {}) => {
    return row({
        id: generateId(),
        items: [createLine(), sequence],
        align: "anchor",
    })
}

const createDecisionBody = ({ pathCount = 2, id = generateId() } = {}) => {
    if (pathCount < 2) throw new Error("Count must be at least 2")
    const paths = Array.from({ length: pathCount }, (_, i) =>
        createPath({ id: id + "-path-" + i }),
    ) as [
        ReturnType<typeof createPath>,
        ReturnType<typeof createPath>,
        ...ReturnType<typeof createPath>[],
    ]
    return column({
        id,
        items: paths,
        align: "center",
        // anchorItemId: paths[0].id,
    })
}

export const createDecision = ({ id = generateId() } = {}) => {
    const icon = createIcon()
    const labels = createLabels()
    const body = createDecisionBody()
    return row({
        id,
        items: [icon, labels, body],
        align: "anchor",
    })
}

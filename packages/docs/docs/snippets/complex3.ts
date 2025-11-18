import { element, row, column, createDecision, createLine, createStep } from "casque"

const sequence = row({
    items: [
        createLine(),
        createStep({ id: "step1", header: true }),
        createLine(),
    ],
    align: "anchor",
})

export const layout = row({
    items: [element({ w: 80, h: 30 }), sequence, element({ w: 80, h: 30 })],
    // pack: false,
    align: "anchor",
})

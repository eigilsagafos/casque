import { element, row, column, createDecision, createLine, createStep } from "casque"

const sequence1 = row({
    items: [
        createLine(),
        createStep({ id: "step1", header: false }),
        createLine(),
    ],
    align: "anchor",
})
const sequence2 = row({
    items: [
        createLine(),
        createStep({ id: "step1", header: false }),
        createLine(),
        createStep({ id: "step2", header: true }),
    ],
    align: "anchor",
})

export const layout = column({
    items: [sequence1, column({ items: [sequence2] })],
})

// row({
//     items: [element({ w: 80, h: 30 }), sequence, element({ w: 80, h: 30 })],
//     // pack: false,
//     align: "anchor",
// })

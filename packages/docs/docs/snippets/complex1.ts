import { element, row, column, createDecision, createLine, createStep } from "casque"

export const layout = row({
    items: [
        createStep({ id: "step1" }),
        createLine(),
        createStep({ id: "step2" }),
        createLine(),
        createDecision({ id: "decision1" }),
        createLine(),
        createStep({ id: "step3" }),
    ],
    align: "anchor",
})

console.log(layout)

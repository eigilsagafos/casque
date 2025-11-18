import { element, row, column, createDecision, createLine, createStep } from "casque"

const step1 = createStep({ id: "step1" })
const step2 = createStep({ id: "step2" })
step2.anchor = {
    left: step2.anchor.horizontal,
    right: step2.anchor.horizontal + 40,
}
console.log(step2)
const step3 = createStep({ id: "step3" })
const sequence = row({
    items: [step1, createLine(), step2, createLine(), step3],
    align: "anchor",
})

export const layout = row({
    items: [
        element({
            w: 50,
            h: 20,
            anchor: { horizontal: 10 },
        }),
        row({
            items: [
                element({
                    w: 48,
                    h: 48,
                    anchor: { horizontal: 24 },
                }),
                element({
                    w: 48,
                    h: 48,
                    anchor: { left: 24, right: 40 },
                }),
                element({
                    w: 80,
                    h: 10,
                    anchor: { horizontal: 5 },
                }),
            ],
            align: "anchor",
        }),
    ],
    align: "anchor",
})

console.log(layout)

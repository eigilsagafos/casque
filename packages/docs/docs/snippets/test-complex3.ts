import { element, row, column } from "casque"

const step1 = column({
    items: [
        element({
            w: 48,
            h: 48,
            anchor: { horizontal: 5 },
            margin: { bottom: 4 },
            id: "icon1",
        }),
        element({
            w: 120,
            h: 20,
            anchor: { horizontal: 5 },
            id: "nar1",
        }),
    ],
    align: "center",
    anchorItemId: "icon1",
})

const step2 = column({
    items: [
        element({
            w: 48,
            h: 48,
            anchor: { horizontal: 5 },
            margin: { bottom: 4 },
            id: "icon2",
        }),
        element({
            w: 120,
            h: 20,
            anchor: { horizontal: 5 },
        }),
    ],
    align: "center",
    anchorItemId: "icon2",
})

const layout = row({
    items: [step1, step2],
    align: "anchor",
})

console.log(JSON.stringify(layout, null, 2))

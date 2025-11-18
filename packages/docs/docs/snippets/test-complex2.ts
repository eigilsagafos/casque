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
    anchorItemId: "icon1",  // Changed from "icon" to "icon1"
})

console.log("step1 with correct anchorItemId:", JSON.stringify(step1, null, 2))

import { element, column } from "casque"

export const layout = column({
    id: "row-top",
    items: [
        element({ w: 80, h: 80, margin: { bottom: 20 } }),
        element({ w: 80, h: 80, margin: { bottom: 20 } }),
        element({ w: 80, h: 80 }),
    ],
    align: "center",
})

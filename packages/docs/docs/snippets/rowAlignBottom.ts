import { element, row } from "casque"

export const layout = row({
    id: "row-bottom",
    items: [
        element({ w: 40, h: 30, id: "el1", margin: 5 }),
        element({
            w: 50,
            h: 40,
            id: "el2",
            margin: { left: 8, right: 8, top: 5, bottom: 5 },
        }),
        element({ w: 35, h: 25, id: "el3", margin: 5 }),
    ],
    align: "bottom",
})

import { element, row } from "casque"

export const layout = row({
    id: "row-top",
    items: [
        element({ w: 40, h: 30, id: "el1" }),
        element({
            w: 50,
            h: 40,
            id: "el2",
            margin: { left: 4, right: 4 },
        }),
        element({ w: 15, h: 15, id: "el3", margin: { left: 8 } }),
    ],
    align: "top",
})

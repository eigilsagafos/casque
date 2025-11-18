import { element, row, column } from "casque"

// With margin bottom of 4, the icon is 48px high
// So total space taken by icon + margin is 52px
// The icon anchor is at horizontal: 5 (5px from icon's top edge)
// Since icon is at y=0, the anchor is at y=0+5=5

// But wait - maybe they want the anchor at the CENTER of the icon?
// Icon is 48px tall, center would be at 24px

const iconWithCenterAnchor = element({
    w: 48,
    h: 48,
    anchor: { horizontal: 24 },  // Center of 48px = 24px
    margin: { bottom: 4 },
    id: "icon1",
})

console.log("Icon with center anchor:", iconWithCenterAnchor)

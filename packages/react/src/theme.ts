export const theme = {
    // Element styling
    element: {
        fill: "rgba(233, 128, 16, 0.5)",
        stroke: "#E98010",
        strokeWidth: 1,
        borderRadius: 1,
    },

    // Margin styling
    margin: {
        stroke: "#FB923C",
        strokeWidth: 0.5,
        strokeDasharray: "8 8",
        pattern: {
            width: 1.5,
            height: 1.5,
            lineStroke: "#FB923C",
            lineStrokeWidth: 0.3,
            opacity: 0.5,
            rotation: 45,
        },
    },

    // Component outline styling
    component: {
        stroke: {
            default: "#7E7E7E",
            hovered: "#3b82f6",
            focused: "#8b5cf6",
        },
        strokeWidth: {
            default: 1,
            hovered: 1.5,
        },
        strokeDasharray: "8 8",
        fill: {
            default: "none",
            hovered: "rgba(59, 130, 246, 0.1)",
        },
        borderOffset: 2, // How far outside the component the border appears
    },

    // Anchor points styling
    anchor: {
        stroke: "#ef4444",
        strokeWidth: 0.5,
        strokeDasharray: "2 2",
        circleFill: "#ef4444",
        circleStroke: "#fff",
        circleStrokeWidth: 0.5,
        circleRadius: {
            small: 2,
            large: 3,
        },
        text: {
            fontSize: 8,
            fill: "#ef4444",
        },
    },

    // Focus effects
    focus: {
        opacity: 0.3,
        saturation: 0.2,
        labelColor: "#3b82f6",
        labelFontSize: 11,
        labelFontFamily: "monospace",
    },

    // Standalone mode styling
    standalone: {
        padding: 20,
        border: "1px solid #e5e7eb",
        borderRadius: "4px",
        background: "white",
    },
}

export type Theme = typeof theme

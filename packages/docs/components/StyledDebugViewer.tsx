import { DebugViewer } from "@casque/react"
import type { Component } from "../../casque/types/Component"

type StyledDebugViewerProps = {
    component: Component
}

export const StyledDebugViewer = ({ component }: StyledDebugViewerProps) => {
    return (
        <div
            style={{
                background: "var(--vocs-color_codeBlockBackground)",
                border: "1px solid var(--vocs-color_codeInlineBorder)",
                borderRadius: "var(--vocs-borderRadius_4)",
                overflow: "hidden",
            }}
        >
            <DebugViewer component={component} />
        </div>
    )
}

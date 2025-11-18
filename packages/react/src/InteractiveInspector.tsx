import React, { useState, useEffect, useRef } from "react"
import type { Component } from "../../casque/types/Component"
import { Inspector } from "./Inspector"

export type InteractiveInspectorOptions = {
    showElements?: boolean
    showComponents?: boolean
    showAnchors?: boolean
    initialZoom?: number
}

type InteractiveInspectorProps = {
    component: Component
    options?: InteractiveInspectorOptions
}

const defaultOptions: Required<InteractiveInspectorOptions> = {
    showElements: true,
    showComponents: true,
    showAnchors: true,
    initialZoom: 1,
}

type HoveredItem =
    | { type: "element"; id: string; data: Component["elements"][0] }
    | { type: "component"; id: string; data: any }
    | { type: "main"; id: string; data: Component }
    | null

export const InteractiveInspector: React.FC<InteractiveInspectorProps> = ({
    component,
    options = {},
}) => {
    const opts = { ...defaultOptions, ...options }
    const containerRef = useRef<HTMLDivElement>(null)
    const [initialZoom, setInitialZoom] = useState(opts.initialZoom)
    const [zoom, setZoom] = useState(opts.initialZoom)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState({ x: 0, y: 0 })
    const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 })
    const [hasMoved, setHasMoved] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<HoveredItem>(null)
    const [focusedComponentId, setFocusedComponentId] = useState<string | null>(
        component.id || "main",
    )

    // Calculate initial zoom to fit component with padding
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const containerWidth = rect.width
            const containerHeight = rect.height - 32 // Account for status bar

            // Add padding around component (40px on each side at zoom 1)
            const padding = 80
            const targetWidth = component.w + padding
            const targetHeight = component.h + padding

            // Calculate zoom to fit
            const zoomX = containerWidth / targetWidth
            const zoomY = containerHeight / targetHeight
            const fitZoom = Math.min(zoomX, zoomY, 1) // Don't zoom in beyond 1x

            setInitialZoom(fitZoom)
            setZoom(fitZoom)
        }
    }, [component.w, component.h])

    // Center the component on mount
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const paddingX = 10
            const paddingTop = 30
            setPan({
                x:
                    rect.width / 2 -
                    ((component.w + 20) * initialZoom) / 2 +
                    paddingX * initialZoom,
                y:
                    (rect.height - 32) / 2 -
                    ((component.h + 40) * initialZoom) / 2 +
                    paddingTop * initialZoom, // Account for status bar and top padding
            })
        }
    }, [component.w, component.h, initialZoom])

    // Prevent default wheel behavior to stop page scrolling
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            const delta = e.deltaY > 0 ? 0.9 : 1.1
            const newZoom = Math.max(1, Math.min(10, zoom * delta))

            // Zoom towards mouse position
            const rect = container.getBoundingClientRect()
            if (rect) {
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            // Account for padding offset
            const paddingX = 10
            const paddingTop = 30
            const currentPanX = pan.x + paddingX * zoom
            const currentPanY = pan.y + paddingTop * zoom

            // Calculate world position before zoom
            const worldX = (mouseX - currentPanX) / zoom
            const worldY = (mouseY - currentPanY) / zoom

            // Calculate new pan to keep world position under mouse
            setPan({
                x: mouseX - worldX * newZoom - paddingX * newZoom,
                y: mouseY - worldY * newZoom - paddingTop * newZoom,
            })
            }

            setZoom(newZoom)
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        return () => {
            container.removeEventListener("wheel", handleWheel)
        }
    }, [zoom, pan])

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
            // Track mouse down position to detect clicks vs drags
            setMouseDownPos({ x: e.clientX, y: e.clientY })
            setHasMoved(false)
            setIsPanning(true)
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const dx = Math.abs(e.clientX - mouseDownPos.x)
            const dy = Math.abs(e.clientY - mouseDownPos.y)

            // If moved more than 3 pixels, consider it a drag
            if (dx > 3 || dy > 3) {
                setHasMoved(true)
                setPan({
                    x: e.clientX - panStart.x,
                    y: e.clientY - panStart.y,
                })
            }
        }
    }

    const handleMouseUp = () => {
        setIsPanning(false)
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: 500,
                overflow: "hidden",
                cursor: isPanning ? "grabbing" : "default",
                userSelect: "none",
            }}
        >
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Main SVG for the component */}
                <svg
                    style={{
                        position: "absolute",
                        left: pan.x - 10 * zoom,
                        top: pan.y - 30 * zoom,
                        pointerEvents: isPanning ? "none" : "auto",
                    }}
                    width={(component.w + 20) * zoom}
                    height={(component.h + 40) * zoom}
                    viewBox={`-10 -30 ${component.w + 20} ${component.h + 40}`}
                >
                    <Inspector
                        component={component}
                        hoveredItem={hoveredItem}
                        focusedComponentId={focusedComponentId}
                        showElements={opts.showElements}
                        showComponents={opts.showComponents}
                        showAnchors={opts.showAnchors}
                        onHoverElement={setHoveredItem}
                        onClickElement={(e, elementId) => {
                            e.stopPropagation()
                        }}
                        onClickComponent={(e, componentId) => {
                            e.stopPropagation()
                            setFocusedComponentId(componentId)
                        }}
                        onClickBackground={(e) => {
                            // Only reset to root if we didn't pan
                            if (!hasMoved) {
                                setFocusedComponentId(component.id || "main")
                            }
                        }}
                    />
                </svg>
            </div>

            {/* Status bar at bottom */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 32,
                    background: "rgba(255, 255, 255, 0.95)",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    fontSize: 12,
                    fontFamily: "monospace",
                    gap: 16,
                    color: "#374151",
                }}
            >
                <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: "#6b7280" }}>Zoom:</span>
                    <span>{Math.round(zoom * 100)}%</span>
                </div>
                {hoveredItem && (
                    <>
                        <div
                            style={{
                                width: 1,
                                height: 20,
                                background: "#e5e7eb",
                            }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                            <span
                                style={{
                                    color:
                                        hoveredItem.type === "element"
                                            ? "#10b981"
                                            : hoveredItem.type === "component"
                                              ? "#8b5cf6"
                                              : "#6b7280",
                                    fontWeight: "bold",
                                }}
                            >
                                {hoveredItem.type === "element"
                                    ? "Element"
                                    : hoveredItem.type === "component"
                                      ? "Component"
                                      : "Main"}
                                :
                            </span>
                            <span>{hoveredItem.id}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <span style={{ color: "#6b7280" }}>Position:</span>
                            <span>
                                ({hoveredItem.data.x ?? 0},{" "}
                                {hoveredItem.data.y ?? 0})
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <span style={{ color: "#6b7280" }}>Size:</span>
                            <span>
                                {hoveredItem.data.w}×{hoveredItem.data.h}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

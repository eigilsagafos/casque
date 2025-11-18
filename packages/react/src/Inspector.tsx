import React from "react"
import type { Component } from "../../casque/types/Component"
import type { PositionedElement } from "../../casque/types/PositionedElement"
import { theme } from "./theme"

type HoveredItem =
    | { type: "element"; id: string; data: Component["elements"][0] }
    | { type: "component"; id: string; data: any }
    | { type: "main"; id: string; data: Component }
    | null

type ElementProps = {
    element: PositionedElement
    isHovered: boolean
    isOutsideFocus: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    onClick: (e: React.MouseEvent) => void
}

const Element: React.FC<ElementProps> = ({
    element: el,
    isHovered,
    isOutsideFocus,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    // Calculate margin values
    const margin = el.margin || 0
    const marginTop = typeof margin === "number" ? margin : margin.top || 0
    const marginRight = typeof margin === "number" ? margin : margin.right || 0
    const marginBottom =
        typeof margin === "number" ? margin : margin.bottom || 0
    const marginLeft = typeof margin === "number" ? margin : margin.left || 0

    const hasMargin =
        marginTop > 0 || marginRight > 0 || marginBottom > 0 || marginLeft > 0

    return (
        <g
            opacity={isOutsideFocus ? theme.focus.opacity : 1}
            style={{
                filter: isOutsideFocus
                    ? `saturate(${theme.focus.saturation})`
                    : "none",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {/* Invisible hover target covering entire element area */}
            <rect
                x={el.x}
                y={el.y}
                width={el.w}
                height={el.h}
                fill="transparent"
                stroke="none"
                style={{ cursor: "pointer" }}
            />
            {/* Margin area - just border with hatched pattern inside */}
            {hasMargin && (
                <>
                    {/* Margin border outline */}
                    <rect
                        x={el.x - marginLeft}
                        y={el.y - marginTop}
                        width={el.w + marginLeft + marginRight}
                        height={el.h + marginTop + marginBottom}
                        fill="none"
                        stroke={theme.margin.stroke}
                        strokeWidth={theme.margin.strokeWidth}
                        strokeDasharray={theme.margin.strokeDasharray}
                        pointerEvents="none"
                    />
                    {/* Top margin hatch */}
                    {marginTop > 0 && (
                        <rect
                            x={el.x}
                            y={el.y - marginTop}
                            width={el.w}
                            height={marginTop}
                            fill="url(#margin-pattern)"
                            pointerEvents="none"
                        />
                    )}
                    {/* Bottom margin hatch */}
                    {marginBottom > 0 && (
                        <rect
                            x={el.x}
                            y={el.y + el.h}
                            width={el.w}
                            height={marginBottom}
                            fill="url(#margin-pattern)"
                            pointerEvents="none"
                        />
                    )}
                    {/* Left margin hatch */}
                    {marginLeft > 0 && (
                        <rect
                            x={el.x - marginLeft}
                            y={el.y - marginTop}
                            width={marginLeft}
                            height={el.h + marginTop + marginBottom}
                            fill="url(#margin-pattern)"
                            pointerEvents="none"
                        />
                    )}
                    {/* Right margin hatch */}
                    {marginRight > 0 && (
                        <rect
                            x={el.x + el.w}
                            y={el.y - marginTop}
                            width={marginRight}
                            height={el.h + marginTop + marginBottom}
                            fill="url(#margin-pattern)"
                            pointerEvents="none"
                        />
                    )}
                </>
            )}
            {/* Element box with fill */}
            <rect
                x={el.x}
                y={el.y}
                width={el.w}
                height={el.h}
                fill={theme.element.fill}
                stroke={theme.element.stroke}
                strokeWidth={theme.element.strokeWidth}
                rx={theme.element.borderRadius}
                ry={theme.element.borderRadius}
                pointerEvents="none"
            />
        </g>
    )
}

type ComponentOutlineProps = {
    comp: Component["components"][0]
    isHovered: boolean
    isOutsideFocus: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    onClick: (e: React.MouseEvent) => void
}

const ComponentOutline: React.FC<ComponentOutlineProps> = ({
    comp,
    isHovered,
    isOutsideFocus,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    return (
        <g
            opacity={isOutsideFocus ? theme.focus.opacity : 1}
            style={{
                filter: isOutsideFocus
                    ? `saturate(${theme.focus.saturation})`
                    : "none",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {/* Invisible hover target */}
            <rect
                x={comp.x}
                y={comp.y}
                width={comp.w}
                height={comp.h}
                fill="transparent"
                stroke="none"
                style={{ cursor: "pointer" }}
            />
            {/* Visible border and fill */}
            <rect
                x={comp.x - theme.component.borderOffset}
                y={comp.y - theme.component.borderOffset}
                width={comp.w + theme.component.borderOffset * 2}
                height={comp.h + theme.component.borderOffset * 2}
                fill={
                    isHovered
                        ? theme.component.fill.hovered
                        : theme.component.fill.default
                }
                stroke={
                    isHovered
                        ? theme.component.stroke.hovered
                        : theme.component.stroke.default
                }
                strokeWidth={
                    isHovered
                        ? theme.component.strokeWidth.hovered
                        : theme.component.strokeWidth.default
                }
                strokeDasharray={theme.component.strokeDasharray}
                pointerEvents="none"
            />
        </g>
    )
}

export type InspectorProps = {
    component: Component
    hoveredItem?: HoveredItem
    focusedComponentId?: string | null
    showElements?: boolean
    showComponents?: boolean
    showAnchors?: boolean
    onHoverElement?: (item: HoveredItem) => void
    onClickElement?: (e: React.MouseEvent, elementId: string) => void
    onClickComponent?: (e: React.MouseEvent, componentId: string | null) => void
    onClickBackground?: (e: React.MouseEvent) => void
    standalone?: boolean
}

export const Inspector: React.FC<InspectorProps> = ({
    component,
    hoveredItem = null,
    focusedComponentId = null,
    showElements = true,
    showComponents = true,
    showAnchors = false,
    onHoverElement,
    onClickElement,
    onClickComponent,
    onClickBackground,
    standalone = false,
}) => {
    // Helper to check if an element belongs to the focused component using parentId
    const isElementInFocusedComponent = (el: PositionedElement): boolean => {
        if (!focusedComponentId) return true // No focus, everything visible

        // Direct match
        if (el.parentId === focusedComponentId) return true

        // For root focus, check if element's parent is ANY component in the tree
        if (isRootFocused) {
            // When root is focused, all elements should be visible
            return true
        }

        // Check if element's parent is a descendant of the focused component
        const isComponentInFocusTree = (compId: string): boolean => {
            // Direct match
            if (compId === focusedComponentId) return true

            const comp = component.components?.find(c => c.id === compId)
            if (!comp) return false

            // Check if this component's parent is the focused component or in its tree
            if (comp.parentId) {
                return isComponentInFocusTree(comp.parentId)
            }

            return false
        }

        if (el.parentId) {
            return isComponentInFocusTree(el.parentId)
        }

        return false
    }

    // Get the focused component data for rendering bounds
    const getFocusedComponent = () => {
        if (!focusedComponentId) return null
        // Check if root component is focused
        if (
            focusedComponentId === component.id ||
            focusedComponentId === "main"
        ) {
            return {
                id: component.id || "main",
                x: 0,
                y: 0,
                w: component.w,
                h: component.h,
                anchor: component.anchor,
            }
        }
        return component.components?.find(c => c.id === focusedComponentId)
    }

    const isRootFocused =
        focusedComponentId === component.id || focusedComponentId === "main"
    const focusedComp = getFocusedComponent()

    const content = (
        <>
            {/* Margin hatching pattern */}
            <defs>
                <pattern
                    id="margin-pattern"
                    width={theme.margin.pattern.width}
                    height={theme.margin.pattern.height}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`rotate(${theme.margin.pattern.rotation})`}
                >
                    <rect
                        width={theme.margin.pattern.width}
                        height={theme.margin.pattern.height}
                        fill="none"
                    />
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={theme.margin.pattern.height}
                        stroke={theme.margin.pattern.lineStroke}
                        strokeWidth={theme.margin.pattern.lineStrokeWidth}
                        opacity={theme.margin.pattern.opacity}
                    />
                </pattern>
            </defs>

            {/* Invisible background rect for capturing clicks on empty space */}
            <rect
                x={-10}
                y={-30}
                width={component.w + 20}
                height={component.h + 40}
                fill="transparent"
                onClick={e => {
                    onClickBackground?.(e)
                }}
                style={{ cursor: "default" }}
            />

            {/* White background for focused component (renders behind elements but on top of empty space click handler) */}
            {focusedComp && (
                <rect
                    x={focusedComp.x}
                    y={focusedComp.y}
                    width={focusedComp.w}
                    height={focusedComp.h}
                    fill="white"
                    pointerEvents="none"
                />
            )}

            {/* Main component - always show border, but only highlight when focused or hovered */}
            <g
                onMouseEnter={() =>
                    onHoverElement?.({
                        type: "main",
                        id: component.id || "main",
                        data: component,
                    })
                }
                onMouseLeave={() => onHoverElement?.(null)}
                onClick={e => {
                    e.stopPropagation()
                    onClickComponent?.(e, component.id || "main")
                }}
            >
                {/* Invisible hover target */}
                <rect
                    x={0}
                    y={0}
                    width={component.w}
                    height={component.h}
                    fill="transparent"
                    stroke="none"
                    style={{ cursor: "pointer" }}
                />
                {/* Visible border and fill */}
                <rect
                    x={-theme.component.borderOffset}
                    y={-theme.component.borderOffset}
                    width={component.w + theme.component.borderOffset * 2}
                    height={component.h + theme.component.borderOffset * 2}
                    fill={
                        hoveredItem?.type === "main"
                            ? theme.component.fill.hovered
                            : theme.component.fill.default
                    }
                    stroke={
                        hoveredItem?.type === "main"
                            ? theme.component.stroke.hovered
                            : isRootFocused
                              ? theme.component.stroke.focused
                              : theme.component.stroke.default
                    }
                    strokeWidth={
                        hoveredItem?.type === "main"
                            ? theme.component.strokeWidth.hovered
                            : theme.component.strokeWidth.default
                    }
                    strokeDasharray={theme.component.strokeDasharray}
                    rx={theme.element.borderRadius}
                    ry={theme.element.borderRadius}
                    pointerEvents="none"
                />
            </g>

            {/* Component outlines - dashed border */}
            {showComponents &&
                component.components?.map(comp => {
                    const isHovered =
                        hoveredItem?.type === "component" &&
                        hoveredItem.id === comp.id
                    const isFocused = focusedComponentId === comp.id

                    // Check if this component or any of its descendants contains elements from the focused component
                    const isInFocusTree = () => {
                        // Root is always in focus tree
                        if (isRootFocused) return true

                        // This component is directly focused
                        if (isFocused) return true

                        // Check if this component is an ancestor of the focused component
                        const isAncestorOfFocused = (
                            compId: string,
                        ): boolean => {
                            const focusedComp = component.components?.find(
                                c => c.id === focusedComponentId,
                            )
                            if (!focusedComp) return false

                            if (focusedComp.parentId === compId) return true

                            if (focusedComp.parentId) {
                                const parent = component.components?.find(
                                    c => c.id === focusedComp.parentId,
                                )
                                if (parent) {
                                    return isAncestorOfFocused(parent.id!)
                                }
                            }

                            return false
                        }

                        if (comp.id && isAncestorOfFocused(comp.id)) return true

                        return false
                    }

                    const isOutsideFocus =
                        focusedComponentId && !isInFocusTree()

                    return (
                        <ComponentOutline
                            key={comp.id}
                            comp={comp}
                            isHovered={isHovered}
                            isOutsideFocus={!!isOutsideFocus}
                            onMouseEnter={() =>
                                onHoverElement?.({
                                    type: "component",
                                    id: comp.id || "unnamed",
                                    data: comp,
                                })
                            }
                            onMouseLeave={() => onHoverElement?.(null)}
                            onClick={e => {
                                e.stopPropagation()
                                onClickComponent?.(e, comp.id ?? null)
                            }}
                        />
                    )
                })}

            {/* Element boxes with margins - render desaturated ones first, then focused ones on top */}
            {showElements && (
                <>
                    {/* First pass: render elements outside focus (desaturated, on bottom) */}
                    {component.elements
                        .filter(el => {
                            const isOutside =
                                focusedComponentId &&
                                !isElementInFocusedComponent(el)
                            return isOutside
                        })
                        .map(el => {
                            const isHovered =
                                hoveredItem?.type === "element" &&
                                hoveredItem.id === el.id

                            // Check if element is outside focused component
                            const isOutsideFocus =
                                focusedComponentId &&
                                !isElementInFocusedComponent(el)

                            return (
                                <Element
                                    key={el.id}
                                    element={el}
                                    isHovered={isHovered}
                                    isOutsideFocus={!!isOutsideFocus}
                                    onMouseEnter={() =>
                                        onHoverElement?.({
                                            type: "element",
                                            id: el.id,
                                            data: el,
                                        })
                                    }
                                    onMouseLeave={() => onHoverElement?.(null)}
                                    onClick={e => {
                                        e.stopPropagation()
                                        onClickElement?.(e, el.id)
                                    }}
                                />
                            )
                        })}
                    {/* Second pass: render elements inside focus (normal, on top) */}
                    {component.elements
                        .filter(el => {
                            const isInside =
                                !focusedComponentId ||
                                isElementInFocusedComponent(el)
                            return isInside
                        })
                        .map(el => {
                            const isHovered =
                                hoveredItem?.type === "element" &&
                                hoveredItem.id === el.id

                            // Check if element is outside focused component
                            const isOutsideFocus = false // This pass is only for inside elements

                            return (
                                <Element
                                    key={el.id}
                                    element={el}
                                    isHovered={isHovered}
                                    isOutsideFocus={isOutsideFocus}
                                    onMouseEnter={() =>
                                        onHoverElement?.({
                                            type: "element",
                                            id: el.id,
                                            data: el,
                                        })
                                    }
                                    onMouseLeave={() => onHoverElement?.(null)}
                                    onClick={e => {
                                        e.stopPropagation()
                                        onClickElement?.(e, el.id)
                                    }}
                                />
                            )
                        })}
                </>
            )}

            {/* Anchor points */}
            {showAnchors && component.anchor && (
                <g>
                    {"horizontal" in component.anchor && (
                        <g>
                            <line
                                x1={0}
                                y1={component.anchor.horizontal}
                                x2={component.w}
                                y2={component.anchor.horizontal}
                                stroke={theme.anchor.stroke}
                                strokeWidth={theme.anchor.strokeWidth}
                                strokeDasharray={theme.anchor.strokeDasharray}
                            />
                            <circle
                                cx={component.w / 2}
                                cy={component.anchor.horizontal}
                                r={theme.anchor.circleRadius.small}
                                fill={theme.anchor.circleFill}
                            />
                        </g>
                    )}
                    {"vertical" in component.anchor && (
                        <g>
                            <line
                                x1={component.anchor.vertical}
                                y1={0}
                                x2={component.anchor.vertical}
                                y2={component.h}
                                stroke={theme.anchor.stroke}
                                strokeWidth={theme.anchor.strokeWidth}
                                strokeDasharray={theme.anchor.strokeDasharray}
                            />
                            <circle
                                cx={component.anchor.vertical}
                                cy={component.h / 2}
                                r={theme.anchor.circleRadius.small}
                                fill={theme.anchor.circleFill}
                            />
                        </g>
                    )}
                    {"left" in component.anchor && (
                        <g>
                            <circle
                                cx={0}
                                cy={component.anchor.left}
                                r={theme.anchor.circleRadius.large}
                                fill={theme.anchor.circleFill}
                                stroke={theme.anchor.circleStroke}
                                strokeWidth={theme.anchor.circleStrokeWidth}
                            />
                            <text
                                x={5}
                                y={component.anchor.left}
                                fontSize={theme.anchor.text.fontSize}
                                fill={theme.anchor.text.fill}
                                dominantBaseline="middle"
                            >
                                left
                            </text>
                        </g>
                    )}
                    {"right" in component.anchor && (
                        <g>
                            <circle
                                cx={component.w}
                                cy={component.anchor.right}
                                r={theme.anchor.circleRadius.large}
                                fill={theme.anchor.circleFill}
                                stroke={theme.anchor.circleStroke}
                                strokeWidth={theme.anchor.circleStrokeWidth}
                            />
                            <text
                                x={component.w - 5}
                                y={component.anchor.right}
                                fontSize={theme.anchor.text.fontSize}
                                fill={theme.anchor.text.fill}
                                dominantBaseline="middle"
                                textAnchor="end"
                            >
                                right
                            </text>
                        </g>
                    )}
                </g>
            )}

            {/* Component ID label - shows focused component or main */}
            {focusedComp && (
                <g
                    transform={`translate(${focusedComp.x}, ${focusedComp.y - 8})`}
                >
                    <text
                        x={0}
                        y={0}
                        fontSize={theme.focus.labelFontSize}
                        fontFamily={theme.focus.labelFontFamily}
                        fill={theme.focus.labelColor}
                        dominantBaseline="middle"
                    >
                        {focusedComp.id || component.id || "main"}
                    </text>
                </g>
            )}
        </>
    )

    if (standalone) {
        const padding = theme.standalone.padding
        return (
            <svg
                viewBox={`${-padding} ${-padding} ${component.w + padding * 2} ${component.h + padding * 2}`}
                style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: `${component.w + padding * 2}px`,
                    border: theme.standalone.border,
                    borderRadius: theme.standalone.borderRadius,
                    background: theme.standalone.background,
                }}
            >
                {content}
            </svg>
        )
    }

    return content
}

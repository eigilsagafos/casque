# Valldal Layout System

Valldal is a layout system for building UI components by composing elements in rows and columns with precise control over positioning, alignment, and anchoring.

## Core Concepts

### Elements
The basic building block. An element has:
- `w`, `h`: width and height
- `x`, `y`: position (set during layout)
- `margin`: optional spacing (number or `{top, right, bottom, left}`)
- `anchor`: optional alignment point (see Anchors section)
- `id`, `meta`: optional metadata

### Components
A group of positioned elements. A component has:
- `w`, `h`: total dimensions
- `elements`: array of positioned elements
- `components`: optional array of nested components (for tracking composition)
- `anchor`: optional anchor for the component as a whole

### Layout Functions

#### `row()`
Stacks items horizontally (left to right).
- **align**: `"top"` | `"center"` | `"bottom"` | `"anchor"` - vertical alignment
- **pack**: `false` by default - whether to use collision detection for tight packing

#### `column()`
Stacks items vertically (top to bottom).
- **align**: `"left"` | `"center"` | `"right"` | `"anchor"` - horizontal alignment  
- **pack**: `true` by default - whether to use collision detection for tight packing

Both are thin wrappers around `stack()`.

## Alignment

### Basic Alignment
- **start** (`top` for rows, `left` for columns): Align items to the start
- **center**: Center items on the secondary axis
- **end** (`bottom` for rows, `right` for columns): Align items to the end

### Anchor Alignment
Anchors allow precise alignment points within elements. When `align: "anchor"`:

**For rows (horizontal stacking):**
- Anchors represent Y positions within elements
- The "outgoing" anchor of one item aligns with the "incoming" anchor of the next
- Example: `{left: 5, right: 8}` means the left edge has an anchor at y=5, right edge at y=8

**For columns (vertical stacking):**
- Anchors represent X positions within elements  
- Example: `{top: 5, bottom: 8}` means the top edge has an anchor at x=5, bottom edge at x=8

**Anchor types:**
- Single anchor: `{horizontal: 10}` or `{vertical: 10}`
- Dual anchor: `{left: 5, right: 8}` or `{top: 5, bottom: 8}`

When items have different anchor values, the layout system calculates offsets to align them properly.

## Packing

**pack: true** (collision detection):
- Items are positioned as close as possible without overlapping
- Only places items after elements that would actually collide on the secondary axis
- Results in tighter, more efficient layouts

**pack: false** (simple stacking):
- Each item is placed after the furthest edge of all previous items
- Simpler but can create unnecessary gaps

## Implementation Architecture

### `stack.ts`
The core layout engine. Uses a reduce function to process items one at a time:
1. Validates anchors (if using anchor alignment)
2. Calculates spacing between items
3. Calculates alignment offsets
4. Builds the resulting anchor
5. Positions the item (element or component)

### Utility Functions

**`buildStackAnchor.ts`**
- Handles all anchor calculation logic
- Determines how anchors propagate and combine as items are stacked
- Decides when to use single vs dual anchors

**`calculateStackSpacing.ts`**
- Calculates the spacing/margin before each new item
- Handles component-to-component gaps, element margins, and pack mode

**`calculateAlignmentOffsets.ts`**  
- Calculates offsets needed to align items
- For anchor alignment, determines which items need to shift and by how much
- Returns `existingOffset` (shift for already-placed items) and `newItemOffset` (shift for new item)

**`positionStackItem.ts`**
- `positionFirstItem()`: Handles the first item in an empty component
- `positionComponentItem()`: Positions nested components with proper offset propagation
- `positionElementItem()`: Positions individual elements, including pack mode collision detection

**`getAnchorValue.ts`**
- Extracts anchor values for a given axis and direction
- Handles single anchors, dual anchors, and cross-axis anchors
- Direction: "incoming" (for new items entering the layout) or "outgoing" (for existing items)

**`updatePositions.ts`**
- Updates element x/y positions by applying offsets
- Recursively updates nested elements if the item is a component

## Axis Configuration

The stack system uses an axis-agnostic approach with a configuration object:
- **Primary axis**: Direction of stacking (x/w for horizontal, y/h for vertical)
- **Secondary axis**: Direction of alignment (y/h for horizontal, x/w for vertical)

This allows the same logic to work for both rows and columns.

## Common Patterns

### Centering items in a row
```typescript
row({
  items: [box1, box2, box3],
  align: "center"
})
```

### Tight packing in a column
```typescript
column({
  items: [card1, card2, card3],
  pack: true // default
})
```

### Anchor-based alignment
```typescript
const box1 = element({ 
  w: 10, h: 10, 
  anchor: { left: 5, right: 8 } 
})
const box2 = element({ 
  w: 10, h: 10, 
  anchor: { left: 3, right: 7 } 
})

// box1's right anchor (y=8) will align with box2's left anchor (y=3)
// Result: box2 is offset by 8-3=5 pixels downward
row({ 
  items: [box1, box2], 
  align: "anchor" 
})
```

### Nested layouts
```typescript
const leftColumn = column({ items: [a, b, c] })
const rightColumn = column({ items: [d, e, f] })

row({ items: [leftColumn, rightColumn] })
```

## Testing

Tests are in `row.test.ts` and `column.test.ts`. They cover:
- Basic alignment (top/center/bottom, left/center/right)
- Anchor alignment with symmetric and asymmetric anchors
- Margin overlap and collision detection
- Nested components and anchor propagation
- Component tracking for debugging/visualization

Run tests with: `bun test row.test.ts column.test.ts`

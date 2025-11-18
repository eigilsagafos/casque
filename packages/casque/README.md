# Casque

Casque is a flexible, framework-agnostic layout system for positioning and aligning elements. It calculates positions (x, y) and dimensions (w, h) for nested rows, columns, and stacks of elements, making it ideal for canvas rendering, game UIs, or any scenario where you need flexbox-like layout logic without the DOM.

## Installation

```bash
npm install casque
# or
bun add casque
```

## Usage

### Basic Row

```typescript
import { row, element } from "casque";

const myRow = row({
  items: [
    element({ w: 100, h: 50 }),
    element({ w: 100, h: 50 }),
    element({ w: 100, h: 50 }),
  ],
  align: "center", // "top" | "center" | "bottom" | "anchor"
  pack: true, // whether to pack elements tightly or respect margins
});

console.log(myRow);
/*
{
  id: "...",
  w: 300,
  h: 50,
  elements: [
    { x: 0, y: 0, w: 100, h: 50, ... },
    { x: 100, y: 0, w: 100, h: 50, ... },
    { x: 200, y: 0, w: 100, h: 50, ... }
  ]
}
*/
```

### Nested Layouts

You can nest rows and columns arbitrarily.

```typescript
import { row, column, element } from "casque";

const layout = row({
  items: [
    // Sidebar
    column({
      items: [
        element({ w: 200, h: 100 }), // Logo
        element({ w: 200, h: 400 }), // Menu
      ]
    }),
    // Main Content
    column({
      items: [
        element({ w: 600, h: 50 }), // Header
        element({ w: 600, h: 450 }), // Body
      ]
    })
  ]
});
```

## API

### `element(args)`
Creates a basic layout node.
- `w`: width
- `h`: height
- `margin`: optional margin
- `anchor`: optional anchor point

### `row(args)`
Arranges items horizontally.
- `items`: Array of elements or other components (rows/columns)
- `align`: Vertical alignment ("top", "center", "bottom", "anchor")
- `pack`: Boolean, defaults to true.

### `column(args)`
Arranges items vertically.
- `items`: Array of elements or other components
- `align`: Horizontal alignment ("left", "center", "right", "anchor")
- `pack`: Boolean, defaults to true.

### `stack(args)`
The core primitive for `row` and `column`. Allows explicit axis control.
- `axis`: "horizontal" | "vertical"

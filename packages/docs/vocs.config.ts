import { defineConfig } from "vocs"

export default defineConfig({
    rootDir: "./docs",
    title: "Casque",
    description: "Flexible layout system for positioning and aligning elements",
    sidebar: [
        {
            text: "Getting Started",
            items: [
                { text: "Introduction", link: "/" },
                { text: "Installation", link: "/getting-started/installation" },
            ],
        },
        {
            text: "API Reference",
            items: [
                { text: "element", link: "/api/element" },
                { text: "row", link: "/api/row" },
                { text: "column", link: "/api/column" },
                { text: "complex", link: "/api/complex" },
            ],
        },
    ],
})

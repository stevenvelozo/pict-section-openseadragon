# Pict Section OpenSeaDragon

> A deep-zoom image viewer and annotation section for Pict applications

Pict Section OpenSeaDragon is a `pict-view` subclass that wires two best-in-class browser libraries -- [OpenSeaDragon](https://openseadragon.github.io/) for deep-zoom image display and [Annotorious](https://annotorious.github.io/) for W3C Web Annotations -- into the Pict MVC framework. Drop it into any Pict application to get a fully-configured viewer with toolbars, a color palette, drawing tools, and a companion comments sidebar.

The module is purely declarative from the host application's perspective: you register the view, pass a `TileSources` descriptor, tell it whether to enable annotation editing, and optionally provide a color map and an initial annotation set. Everything else -- template injection, DOM wiring, toolbar construction, color stylesheet generation, hatch-fill pattern synthesis, and event hook plumbing -- is handled by the view's `onAfterRender` lifecycle.

Two classes ship in this module:

- **`PictSectionOpenSeaDragon`** -- the primary view that owns the OpenSeaDragon `viewer`, the Annotorious `annotator`, drawing state, and the toolbar.
- **`PictSectionOpenSeaDragonAnnotationSelector`** -- an optional sibling view that renders a scrollable panel of comments and tags kept in sync with the annotator.

## Features

- **Deep-Zoom Viewer** -- Full OpenSeaDragon tile source support with zoom, home, and fullscreen controls
- **W3C Annotations** -- Annotorious editor for commenting, replying, and tagging regions
- **Shape Library** -- Circle, ellipse, rectangle, freehand, polygon, line, and a custom arrow tool (via `Annotorious.PictPack`)
- **Color Palette** -- A single declarative `Colors` map drives the toolbar, per-shape stroke color, and per-annotation `styleClass`
- **Hatch Fill Mode** -- Toggle on a diagonal SVG hatch pattern for shaded / highlighted annotations
- **Comments Sidebar** -- Sibling view renders a scrollable, editable comments / tags panel
- **Connector Lines** -- `connectAnnotation(id)` draws an SVG connector from a comment in the sidebar to its shape on the canvas
- **Focus Helpers** -- `focusOnAnnotation`, `focusOnPoint`, and `maxZoomReached` make pan / zoom control straightforward
- **Double-Click Zoom** -- Configurable double-click pans to the clicked point once max zoom is reached
- **Extensible Hooks** -- Every annotation event is an override point on the view class
- **Pict Native** -- Extends `pict-view`, uses `ContentAssignment`, and registers templates / renderables through the standard config object

## When to Use It

Reach for this view when your Pict application needs to:

- Display very large images (gigapixel, deep-zoom, IIIF, DZI) in a zoomable viewport
- Let users draw, comment on, and tag regions of an image
- Present a pre-built annotation set in read-only mode
- Visually connect sidebar comments to their regions with on-canvas overlays
- Customize any of the above without forking by subclassing and overriding event hooks

## Learn More

- [Quick Start](quickstart.md) -- Install, register the view, and render your first deep-zoom image
- [Architecture](architecture.md) -- Module map, class hierarchy, render lifecycle, and annotation event flow
- [Configuration](configuration.md) -- Every key in `default_configuration`, every OSD / Annotorious setting forwarded
- [API Reference](api-reference.md) -- Every public method, parameter, return value, and side effect
- [Code Snippets](code-snippets.md) -- A runnable snippet for each exposed function
- [Annotorious Plugin Pack](annotorious-plugin-pack.md) -- The custom arrow tool and the W3C annotation shape used by this view

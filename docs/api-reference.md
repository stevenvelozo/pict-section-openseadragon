# API Reference

Every developer-facing method on `PictSectionOpenSeaDragon` and its sibling view, grouped by responsibility. Signatures follow the source in `source/Pict-Section-OpenSeaDragon.js`.

All methods below are instance methods on a view registered under `_Pict.views[ViewAddress]`. `PictSectionOpenSeaDragon` extends [`pict-view`](https://github.com/stevenvelozo/pict-view), so it inherits `render()`, `solve()`, `initialize()`, and the other standard lifecycle methods as well.

## Lifecycle & Rendering

### `constructor(pFable, pOptions, pServiceHash)`

Instantiates the view. Merges `default_configuration` with `pOptions` (your options win) before calling the `pict-view` base constructor. Sets `this.triggerRender = false`.

| Param | Type | Description |
|---|---|---|
| `pFable` | `Fable` | The Fable / Pict instance. |
| `pOptions` | `object` | View options. Any subset of `default_configuration`. |
| `pServiceHash` | `string` | Optional service hash passed through to the base class. |

You normally do not call the constructor directly; register the view with `pict.addView(name, options, SubclassOrThisClass)` and let Pict construct it.

### `onBeforeInitialize()`

Called by `pict-view` before `initialize()`. Clears `this.targetElementAddress` to `false` so the base class does not attempt to assign content into a selector before the template has been rendered. Override carefully -- call `super.onBeforeInitialize()` first.

### `onAfterRender(pRenderable)`

Called by `pict-view` after each render pass. This is where the view does all of its heavy lifting:

1. Looks up `#OpenSeaDragon-Element` and `#DrawingToolbar` via `ContentAssignment.getElement`.
2. Builds `this.osdSettings` and calls `customConfigureViewerSettings()`.
3. Instantiates `OpenSeadragon(this.osdSettings)` and registers an `open` handler that generates the color stylesheet and color-picker buttons.
4. If `EnableAnnotation` is true or `Annotations` is non-empty, instantiates `Annotorious`, registers `SelectorPack`, `BetterPolygon`, and `PictPack`, and wires event hooks.
5. If `EnableAnnotation` is true, mounts the `Annotorious.Toolbar`, adds the arrow-tool button, and renders the draw-mode / hatch-mode toggle switches.
6. Loads initial annotations and asks the sibling panel to render.

Override by calling `super.onAfterRender(pRenderable)` first, then do additional work.

### `customConfigureViewerSettings()`

Override hook -- no-op by default. Called after `this.osdSettings` and the format function are built but **before** `OpenSeadragon(...)` is called. Mutate `this.osdSettings` and/or `this.annoSettings` here to add any upstream options that are not surfaced directly in the Pict configuration.

## Tile & Annotation Data

### `setTileSources(tileSources, reRender)`

Replace the OpenSeaDragon tile source. Assigns `tileSources` to `this.options.TileSources` and, when `reRender` is truthy, calls `this.render()` to tear down and rebuild the viewer.

| Param | Type | Description |
|---|---|---|
| `tileSources` | `object` | Any valid OpenSeaDragon tile source descriptor. |
| `reRender` | `boolean` | Re-render the view when true. |

### `setAnnotations(annotations, reRender)`

Replace the annotation set. Calls `this.annotator.clearAnnotations()`, assigns `annotations` to `this.options.Annotations`, and (if `reRender`) calls `this.render()`.

| Param | Type | Description |
|---|---|---|
| `annotations` | `array` | Array of W3C Web Annotations. |
| `reRender` | `boolean` | Re-render the view when true. |

### `captureAnnotations()`

Returns the current annotation array from Annotorious, or `[]` if the annotator has not been instantiated yet. Thin wrapper over `this.annotator.getAnnotations()`.

**Returns:** `Annotation[]`

### `captureViewport()`

Returns the current viewport bounds (an `OpenSeadragon.Rect`) from `this.viewer.viewport.getBounds()`. Logs an error and returns `null` if the viewer is not instantiated.

**Returns:** `OpenSeadragon.Rect | null`

## Color & Drawing State

### `assignColor(color)`

Set the active drawing color.

1. Writes `this.color = color`.
2. Removes the `osd-color-active` class from every color-picker button.
3. Adds `osd-color-active` to `#ColorSelector<color>`.
4. Writes a `#SelectedColorOverride` stylesheet that strokes editable / selected Annotorious shapes with the chosen color.

| Param | Type | Description |
|---|---|---|
| `color` | `string` | A key from `options.Colors`. |

### `toggleDrawingMode()`

Flip `this.annotator.disableEditor`. When the editor is disabled, Annotorious becomes a shape-drawing-only surface with no inline comment editor. When enabled, users can add comments and tags to selections.

### `toggleHatchMode()`

Flip `this.hatchMode`. New annotations created while hatch mode is on are tagged with `<color>-hatched` instead of `<color>` and drawn with a diagonal SVG hatch fill pattern.

### `selectDrawingTool(event, id)`

Switch the active drawing tool in the Annotorious toolbar.

1. Removes `active` from the currently active toolbar button.
2. Adds `active` to the button that fired the event (`event.target.closest('button')`).
3. Calls `this.annotator.setDrawingTool(id)` and `this.annotator.setDrawingEnabled(true)`.

| Param | Type | Description |
|---|---|---|
| `event` | `MouseEvent` | The click event that triggered the switch -- the view uses `event.target` to locate the button. |
| `id` | `string` | A tool identifier registered with Annotorious: `'circle'`, `'ellipse'`, `'rect'`, `'freehand'`, `'polygon'`, `'line'`, `'arrow'`. |

## Focus & Navigation

### `selectAnnotation(id)`

Select an annotation by id. When editing is enabled, calls `this.annotator.selectAnnotation(id)`. Then walks `captureAnnotations()` to find the matching object and invokes `annotationSelectionHook(annotation)` on it. Finally calls `this.annotator.fitBoundsWithConstraints(id)` to pan/zoom the viewport.

| Param | Type | Description |
|---|---|---|
| `id` | `string` | The W3C annotation id (e.g. `#my-id`). |

### `focusOnAnnotation(annotationID)`

Pan and zoom the viewport to fit a specific annotation. Delegates to `this.annotator.fitBoundsWithConstraints(annotationID)`. Logs a warning and returns early if no id is provided.

| Param | Type | Description |
|---|---|---|
| `annotationID` | `string \| number` | The id of an existing annotation. |

### `focusOnPoint(point)`

Pan (but do not zoom) to a specific point in viewer-element coordinates.

1. Converts the point to viewport coordinates with `viewer.viewport.viewerElementToViewportCoordinates(point)`.
2. Calls `viewer.viewport.panTo(vp)`.

| Param | Type | Description |
|---|---|---|
| `point` | `{ x: number, y: number }` | Any object with numeric `x`/`y` (e.g. an `OpenSeadragon.Point` or a `MouseEvent.position`). |

### `connectAnnotation(id)`

Draw an SVG connector between a comment element in the sibling panel and its annotation shape on the canvas.

1. If a selection is currently open, clears `#OSD-SVG-Sandbox` and returns.
2. Locates `#OSD-Comment-<safeId>` in the comments panel and `[data-id="<id>"]` in the OSD canvas.
3. If the annotation is off-screen, first pans / fits to it and waits before rendering the connector.
4. Writes an SVG into `#OSD-SVG-Sandbox` containing a highlight rectangle, a line from the comment to the shape center, and a filled circle marker.
5. Only renders the SVG if the comment's outer element is still being hovered and no selection is open.

| Param | Type | Description |
|---|---|---|
| `id` | `string` | The W3C annotation id to connect. |

### `releaseAnnotations()`

Clear `#OSD-SVG-Sandbox`, removing any connector drawn by `connectAnnotation`.

### `maxZoomReached()`

Return `true` if the current zoom equals or exceeds the viewer's max zoom.

**Returns:** `boolean`

## Annotation Event Hooks

All six hooks below are override points. Their default implementations handle color tagging, stylesheet embedding, and panel updates. When overriding, typically call `super.<hook>(...)` and then add your own logic.

### `annotationCreationHook(annotation, overrideID)`

Fires on Annotorious `createAnnotation`. By default:

1. If `annotation.target` exists, embeds a `stylesheet` object on the annotation (either a plain color stylesheet or a hatched one based on `this.hatchMode`).
2. Writes `annotation.target.styleClass = <color>` or `<color>-hatched`.
3. Calls `this.AnnotationsPanel?.updateAnnotationsPanel()`.

| Param | Type | Description |
|---|---|---|
| `annotation` | `Annotation` | The newly-created annotation. |
| `overrideID` | `string` | Optional id provided by Annotorious. |

### `annotationSelectionHook(annotation, element)`

Fires on Annotorious `selectAnnotation`. By default:

1. Calls `assignColor` with the annotation's `target.styleClass` (stripping `-hatched`).
2. Synchronizes `#osd-hatchmode-toggle` and `this.hatchMode` with the annotation's hatched state.
3. Calls `releaseAnnotations()` and `focusOnAnnotation(annotation.id)`.

| Param | Type | Description |
|---|---|---|
| `annotation` | `Annotation` | The selected annotation. |
| `element` | `HTMLElement` | The DOM element representing the annotation. |

### `annotationUpdateHook(annotation, previousState)`

Fires on Annotorious `updateAnnotation`. By default calls `this.AnnotationsPanel?.updateAnnotationsPanel()` -- immediately when the editor is enabled, or inside a 10ms `setTimeout` when the editor is disabled (to let Annotorious finish updating selection state first).

| Param | Type | Description |
|---|---|---|
| `annotation` | `Annotation` | The updated annotation. |
| `previousState` | `Annotation` | The annotation before the update. |

### `annotationDeleteHook(annotation)`

Fires on Annotorious `deleteAnnotation`. By default calls `this.AnnotationsPanel?.updateAnnotationsPanel()`.

| Param | Type | Description |
|---|---|---|
| `annotation` | `Annotation` | The deleted annotation. |

### `selectionCreateHook(selection)`

Async hook that fires on Annotorious `createSelection`. When the editor is disabled, the default implementation calls `this.annotator.updateSelected(selection, true)` to immediately finalize the selection. Useful when you want draw-only behavior with no editor popup.

| Param | Type | Description |
|---|---|---|
| `selection` | `Selection` | The Annotorious selection object (no id yet). |

### `canvasDoubleClickHook(event)`

Fires on the OpenSeaDragon `canvas-double-click` event. By default, when `maxZoomReached()` is true, calls `focusOnPoint(event.position)` to pan to the click location without fighting OSD's single-click zoom behavior.

| Param | Type | Description |
|---|---|---|
| `event` | `object` | The OSD canvas-double-click event. Must expose `event.position`. |

## Sibling View -- `PictSectionOpenSeaDragonAnnotationSelector`

### `updateAnnotationsPanel(annotations)`

Re-renders the scrollable comments sidebar (`#OSD-Scrollable-Comments`). Called automatically from `annotationCreationHook`, `annotationUpdateHook`, and `annotationDeleteHook` on the main view. You can also call it manually if you mutate annotations outside the normal Annotorious event flow.

| Param | Type | Description |
|---|---|---|
| `annotations` | `Annotation[]` | Optional explicit annotation set. When omitted, the panel reads from the main view's annotator. |

## Static Exports

### `PictSectionOpenSeaDragon.default_configuration`

The default configuration object (see [Configuration](configuration.md) for the full key reference). Exported so you can merge it with your custom options:

```javascript
Object.assign({}, libPictSectionOpenSeaDragon.default_configuration, myOptions)
```

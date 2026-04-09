# Architecture

Pict Section OpenSeaDragon is built as a thin adapter between the [Pict](https://github.com/stevenvelozo/pict) MVC framework and two external browser libraries: [OpenSeaDragon](https://openseadragon.github.io/) (deep-zoom image viewer) and [Annotorious](https://annotorious.github.io/) (W3C Web Annotation editor). The adapter lives in two `pict-view` subclasses and a bundle of custom Annotorious tools.

## Module Map

```mermaid
graph TB
	subgraph "Host Pict Application"
		PICT["Pict Instance<br/>(_Pict)"]
		CA["ContentAssignment<br/>service"]
	end
	subgraph "pict-section-openseadragon"
		OSD_VIEW["PictSectionOpenSeaDragon<br/>(source/Pict-Section-OpenSeaDragon.js)"]
		AS_VIEW["PictSectionOpenSeaDragonAnnotationSelector<br/>(source/Pict-Section-OpenSeaDragonAnnotationSelector.js)"]
		PICTPACK["Annotorious.PictPack<br/>(source/annotorious-plugins)"]
	end
	subgraph "Browser Globals"
		OSDLIB["OpenSeadragon"]
		ANNO["OpenSeadragon.Annotorious"]
		SELPACK["Annotorious.SelectorPack"]
		BP["Annotorious.BetterPolygon"]
		TB["Annotorious.Toolbar"]
	end

	PICT -->|"addView"| OSD_VIEW
	PICT -->|"addView"| AS_VIEW
	OSD_VIEW -->|"uses"| CA
	AS_VIEW -->|"uses"| CA
	OSD_VIEW -->|"instantiates"| OSDLIB
	OSD_VIEW -->|"instantiates"| ANNO
	OSD_VIEW -->|"registers plugins"| SELPACK
	OSD_VIEW -->|"registers plugins"| BP
	OSD_VIEW -->|"registers plugins"| PICTPACK
	OSD_VIEW -->|"mounts toolbar"| TB
	OSD_VIEW -->|"updates panel"| AS_VIEW
```

## Class Hierarchy

```mermaid
classDiagram
	class libPictViewClass {
		+pict
		+services
		+options
		+log
		+render()
		+onBeforeInitialize()
		+onAfterRender()
	}

	class PictSectionOpenSeaDragon {
		+viewer : OpenSeadragon.Viewer
		+annotator : Annotorious
		+color : string
		+hatchMode : boolean
		+colorSet : object
		+osdSettings : object
		+annoSettings : object
		+AnnotationsPanel : PictSectionOpenSeaDragonAnnotationSelector
		+setTileSources(tileSources, reRender)
		+setAnnotations(annotations, reRender)
		+assignColor(color)
		+selectAnnotation(id)
		+focusOnAnnotation(id)
		+focusOnPoint(point)
		+connectAnnotation(id)
		+releaseAnnotations()
		+captureAnnotations()
		+captureViewport()
		+maxZoomReached()
		+toggleDrawingMode()
		+toggleHatchMode()
		+selectDrawingTool(event, id)
		+customConfigureViewerSettings()
		+annotationCreationHook(annotation, overrideID)
		+annotationSelectionHook(annotation, element)
		+annotationUpdateHook(annotation, previousState)
		+annotationDeleteHook(annotation)
		+selectionCreateHook(selection)
		+canvasDoubleClickHook(event)
	}

	class PictSectionOpenSeaDragonAnnotationSelector {
		+updateAnnotationsPanel(annotations)
	}

	class Arrow {
		+setPoints(points)
		+toSelection()
		+dragTo(xy)
	}

	class ArrowTool {
		+startDrawing(x, y)
		+onMouseMove(x, y)
		+onMouseUp(x, y, evt)
		+createEditableShape(annotation)
	}

	class EditableArrow {
		+onGrab(handle)
		+onMouseMove(evt)
		+onMouseUp(evt)
		+updateState(annotation)
	}

	libPictViewClass <|-- PictSectionOpenSeaDragon
	libPictViewClass <|-- PictSectionOpenSeaDragonAnnotationSelector
	ArrowTool ..> Arrow : creates
	ArrowTool ..> EditableArrow : creates on edit
```

## Rendering Lifecycle

```mermaid
sequenceDiagram
	participant App as Host Pict App
	participant View as PictSectionOpenSeaDragon
	participant CA as ContentAssignment
	participant OSD as OpenSeadragon
	participant Anno as Annotorious
	participant Panel as AnnotationSelector

	App->>View: new View(fable, options, services)
	View->>View: Object.assign(default_configuration, options)
	App->>View: render()
	View->>View: onBeforeInitialize()
	View->>CA: assignContent(template, #OpenSeaDragon-Container-Div)
	View->>View: onAfterRender(renderable)
	View->>CA: getElement(#OpenSeaDragon-Element)
	View->>CA: getElement(#DrawingToolbar)
	View->>View: build osdSettings + customConfigureViewerSettings()
	View->>OSD: OpenSeadragon(osdSettings)
	OSD-->>View: viewer instance
	View->>OSD: addHandler('open', ...)
	OSD-->>View: tiles loaded
	View->>CA: assignContent(#ColorOverrides, generated CSS)
	View->>CA: assignContent(#ColorPickerToolbar, color buttons)
	View->>View: assignColor(first color)
	alt EnableAnnotation or initial Annotations
		View->>Anno: OpenSeadragon.Annotorious(viewer, annoSettings)
		View->>Anno: SelectorPack + BetterPolygon + PictPack
		View->>Anno: on('createAnnotation' / 'selectAnnotation' / ...)
		View->>OSD: addHandler('canvas-double-click', ...)
		View->>Panel: updateAnnotationsPanel()
	end
```

## Annotation Event Flow

```mermaid
sequenceDiagram
	participant User
	participant Toolbar as Annotorious Toolbar
	participant Anno as Annotorious
	participant View as PictSectionOpenSeaDragon
	participant Panel as AnnotationSelector

	User->>Toolbar: click shape tool (e.g. arrow)
	Toolbar->>View: selectDrawingTool(event, 'arrow')
	View->>Anno: setDrawingTool('arrow')
	View->>Anno: setDrawingEnabled(true)

	User->>Anno: draw on canvas
	Anno->>View: createAnnotation(annotation, overrideID)
	View->>View: annotationCreationHook()
	View->>View: attach stylesheet + styleClass (color or color-hatched)
	View->>Panel: updateAnnotationsPanel()
	Panel->>Panel: render comments / tags list

	User->>Panel: click comment
	Panel->>View: selectAnnotation(id)
	View->>Anno: selectAnnotation(id)
	View->>View: annotationSelectionHook()
	View->>View: assignColor(annotation.styleClass)
	View->>View: focusOnAnnotation(id)
	View->>Anno: fitBoundsWithConstraints(id)
```

## File Structure

```
pict-section-openseadragon/
├── README.md
├── package.json
├── source/
│   ├── Pict-Section-OpenSeaDragon.js
│   ├── Pict-Section-OpenSeaDragonAnnotationSelector.js
│   ├── OpenSeaDragon-Configuration.md
│   └── annotorious-plugins/
│       ├── package.json
│       ├── webpack.config.js
│       └── src/
│           ├── index.js
│           └── arrow/
│               ├── Arrow.js
│               ├── ArrowTool.js
│               └── EditableArrow.js
├── example_applications/
│   └── photo_example/
│       ├── Simple-Image-Viewer-Application.js
│       └── html/index.html
└── docs/
    ├── README.md
    ├── _cover.md
    ├── _sidebar.md
    ├── _topbar.md
    ├── quickstart.md
    ├── architecture.md
    ├── configuration.md
    ├── api-reference.md
    ├── code-snippets.md
    └── annotorious-plugin-pack.md
```

## View State

`PictSectionOpenSeaDragon` keeps runtime state directly on the instance. These are the members you will see referenced from hooks and subclass overrides:

| Member | Type | Description |
|---|---|---|
| `this.viewer` | `OpenSeadragon.Viewer` | The live OpenSeaDragon viewer instance. |
| `this.annotator` | `Annotorious` | The live Annotorious instance (may be destroyed when annotation is disabled). |
| `this.color` | `string` | The active color key (one of `Object.keys(this.colorSet)`). |
| `this.colorSet` | `object` | The resolved `Colors` map from options. |
| `this.hatchMode` | `boolean` | Whether new annotations are drawn with the hatch fill pattern. |
| `this.editingEnabled` | `boolean` | `options.EnableAnnotation && toolbarElement` -- governs toolbar + event wiring. |
| `this.targetElement` | `HTMLElement` | The `#OpenSeaDragon-Element` div that OSD mounts into. |
| `this.toolbarElement` | `HTMLElement` | The `#DrawingToolbar` div that Annotorious mounts its toolbar into. |
| `this.osdSettings` | `object` | Fully-assembled settings object passed to `OpenSeadragon(...)`. |
| `this.annoSettings` | `object` | Fully-assembled settings object passed to `OpenSeadragon.Annotorious(...)`. |
| `this.format` | `function` | Annotorious format function that maps each annotation to its `pict-osd-<color>` CSS class. |
| `this.AnnotationsPanel` | `PictSectionOpenSeaDragonAnnotationSelector` | Reference to the registered sibling comments panel view, if any. |
| `this.triggerRender` | `boolean` | Internal flag used to request a deferred re-render of the companion panel. |

All of these are populated in `onAfterRender`. Override `customConfigureViewerSettings()` if you need to mutate `osdSettings` or `annoSettings` before OpenSeaDragon / Annotorious are instantiated.

## Color Pipeline

Colors drive both the UI and per-annotation stroke styling:

1. `options.Colors` -- the developer-provided `{ key: cssColor }` map.
2. On the `viewer`'s `open` event, the view generates a CSS block with `.pict-osd-<key>`, `.pict-osd-fill-<key>`, and `.pict-osd-<key>-hatched` rules and assigns it to `#ColorOverrides`.
3. For each color, a toolbar button is appended to `#ColorPickerToolbar` with an `onclick` that calls `assignColor(key)` on the registered view.
4. `this.format` is registered as an Annotorious formatter so every annotation element picks up `pict-osd-<key>` from its `target.styleClass`.
5. `annotationCreationHook` writes the active color (optionally suffixed with `-hatched`) into each new annotation's `target.styleClass` and embeds a stylesheet in `annotation.stylesheet`.

## Hatch Fill

When `toggleHatchMode()` flips `this.hatchMode` to `true`, new annotations are tagged with `<color>-hatched` instead of `<color>`. The view generates an SVG hatch pattern via `buildHatchPattern(color, bounds)` and inlines it as a `url('data:image/svg+xml;...#hatch')` fill value in the annotation's stylesheet. The pattern's scale is derived from the largest dimension of the current image so it renders consistently across zoom levels.

# Annotorious Plugin Pack

`pict-section-openseadragon` ships with a custom [Annotorious](https://annotorious.github.io/) plugin pack that adds drawing tools not included in the stock distribution. The pack is built from the sources in [`source/annotorious-plugins/`](https://github.com/stevenvelozo/pict-section-openseadragon/tree/master/source/annotorious-plugins) into a single browser bundle that registers `window.Annotorious.PictPack`.

When `Annotorious.PictPack` is present on the page, the view calls it during `onAfterRender`:

```javascript
if (Annotorious.PictPack)
{
	Annotorious.PictPack(this.annotator);
}
```

## Bundled Tools

### Arrow

The current pack contains one tool: an arrow. The arrow is a tail-to-head directional shape that renders as an SVG `<path>` with a circular grab handle at the tail.

Three classes implement the tool:

| Class | File | Purpose |
|---|---|---|
| `Arrow` | `source/annotorious-plugins/src/arrow/Arrow.js` | Display-time shape. Manages the SVG path, `setPoints(points)`, `toSelection()` and live `dragTo(xy)` updates. |
| `ArrowTool` | `source/annotorious-plugins/src/arrow/ArrowTool.js` | Drawing tool. Handles `startDrawing`, `onMouseMove`, and `onMouseUp`. Registers as tool id `'arrow'`. |
| `EditableArrow` | `source/annotorious-plugins/src/arrow/EditableArrow.js` | Editable instance of an existing arrow. Supports grabbing and dragging each endpoint, and `updateState(annotation)` when Annotorious refreshes the model. |

The main view wires a toolbar button for the arrow tool and calls `selectDrawingTool(event, 'arrow')` when clicked.

## W3C Annotation Shape

Annotations produced by this view extend the standard W3C Web Annotation format with a few conventions:

```json
{
	"@context": "http://www.w3.org/ns/anno.jsonld",
	"type": "Annotation",
	"id": "#unique-id",
	"body":
	[
		{ "type": "TextualBody", "value": "Comment text", "purpose": "commenting" },
		{ "type": "TextualBody", "value": "tag-name", "purpose": "tagging" },
		{ "type": "TextualBody", "value": "Reply text", "purpose": "replying" }
	],
	"target":
	{
		"source": "",
		"selector":
		{
			"type": "FragmentSelector",
			"value": "xywh=pixel:x,y,w,h"
		},
		"styleClass": "red",
		"renderedVia": { "name": "arrow" }
	},
	"stylesheet":
	{
		"type": "CssStylesheet",
		"value": ".red > * { stroke: red !important; stroke-width: 2 !important; }"
	}
}
```

### Conventions Added by This View

| Field | Added By | Purpose |
|---|---|---|
| `target.styleClass` | `annotationCreationHook` | Active color key at creation time (or `<key>-hatched` when hatch mode is on). Consumed by the `this.format` Annotorious formatter to apply the correct `.pict-osd-*` class. |
| `target.renderedVia.name` | `ArrowTool` (via Annotorious) | Identifies which drawing tool produced the annotation. The view reads it to pick the right editable shape class when re-hydrating. |
| `stylesheet.value` | `annotationCreationHook` | Embeds the exact CSS the view used when the annotation was drawn, so the same stroke / hatch styling is reproducible in any Annotorious host. |
| `selector.type = "SvgSelector"` | `ArrowTool` | Arrow annotations use an SVG selector (`<svg><line ... /></svg>` or similar) instead of `FragmentSelector` because they are not axis-aligned rectangles. |

## Building the Pack from Source

The plugin pack has its own `package.json` and webpack config:

```
source/annotorious-plugins/
├── package.json
├── webpack.config.js
├── README.md
└── src/
	├── index.js
	└── arrow/
		├── Arrow.js
		├── ArrowTool.js
		└── EditableArrow.js
```

Install the pack's dependencies and run its build to produce the browser bundle:

```bash
cd source/annotorious-plugins
npm install
npx webpack
```

The resulting bundle exposes `window.Annotorious.PictPack`. Include it in your page **after** the Annotorious core and `SelectorPack` scripts and **before** the Pict application loads the view.

## Adding a Tool

To add a new tool, mirror the arrow pattern:

1. Create `source/annotorious-plugins/src/<tool-name>/` with a `Shape.js`, `Tool.js`, and `EditableShape.js`.
2. Register the tool in `source/annotorious-plugins/src/index.js` alongside the arrow.
3. Rebuild the bundle with `npx webpack`.
4. In your Pict view subclass, add a toolbar button that calls `this.selectDrawingTool(event, '<tool-name>')`.

See the arrow implementation for a working reference, and the upstream [Annotorious docs on writing custom tools](https://annotorious.github.io/guides/custom-tools/) for the tool interface contract.

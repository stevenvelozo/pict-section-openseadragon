# Configuration

`PictSectionOpenSeaDragon` ships with a `default_configuration` object that is merged with any options you pass in the constructor (or via `pict.addView(name, options, Class)`). Your options take precedence, so you only need to specify the keys you want to change.

## Default Configuration

```json
{
	"RenderOnLoad": true,
	"DefaultRenderable": "OpenSeaDragon-Wrap",
	"DefaultDestinationAddress": "#OpenSeaDragon-Container-Div",
	"EnableAnnotation": false,
	"DisableFullscreen": true,
	"DisableButtons": false,
	"PrefixUrl": "/",
	"TileSources": {},
	"ViewAddress": "PictSectionOpenSeaDragon",
	"OSDASViewAddress": "PictSectionOpenSeaDragonAnnotationSelector",
	"Colors":
	{
		"red": "red",
		"green": "green",
		"blue": "blue"
	},
	"Annotations": [],
	"DrawModeLabel": "Annotation",
	"HatchModeLabel": "Hatching",
	"Templates": [ /* default container template */ ],
	"Renderables": [ /* default renderable */ ],
	"TargetElementAddress": "#OpenSeaDragon-Container-Div"
}
```

## Settings Reference

| Setting | Type | Default | Description |
|---|---|---|---|
| `RenderOnLoad` | boolean | `true` | Inherited from `pict-view`. When true, the view renders as soon as it is initialized. |
| `DefaultRenderable` | string | `"OpenSeaDragon-Wrap"` | Hash of the default renderable to invoke on render. Override only if you provide your own template. |
| `DefaultDestinationAddress` | string | `"#OpenSeaDragon-Container-Div"` | CSS selector the default renderable writes into. The host page must provide this element. |
| `EnableAnnotation` | boolean | `false` | When true, the view instantiates Annotorious, builds the drawing toolbar, wires event hooks, and reveals the draw-mode / hatch-mode toggles. |
| `DisableFullscreen` | boolean | `true` | Hides OpenSeaDragon's fullscreen button. |
| `DisableButtons` | boolean | `false` | Hides OpenSeaDragon's zoom and home buttons. |
| `PrefixUrl` | string | `"/"` | Path prefix OpenSeaDragon uses to load its button icons. Set this to wherever your OSD `images/` folder is hosted. |
| `TileSources` | object | `{}` | OpenSeaDragon tile source descriptor. Any structure OSD accepts (DZI, IIIF, legacy image pyramid, tiled image object, etc.). |
| `ViewAddress` | string | `"PictSectionOpenSeaDragon"` | Key under `_Pict.views` the generated toolbar HTML calls back into (for `assignColor`, `toggleDrawingMode`, `toggleHatchMode`, `selectDrawingTool`). Must match the name you used in `pict.addView(...)`. |
| `OSDASViewAddress` | string | `"PictSectionOpenSeaDragonAnnotationSelector"` | Key under `_Pict.views` where the sibling comments panel is registered. The view reads `_Pict.views[OSDASViewAddress]` during render. |
| `Colors` | object | `{ red, green, blue }` | Map of color key -> CSS color value. Drives toolbar buttons, the injected `#ColorOverrides` stylesheet, and per-annotation `styleClass` assignments. Keys should be unique strings safe to use as CSS class fragments. |
| `Annotations` | array | `[]` | Initial W3C Web Annotations to load into the annotator on render. |
| `DrawModeLabel` | string | `"Annotation"` | Label used for the draw / comment toggle switch. |
| `HatchModeLabel` | string | `"Hatching"` | Label used for the hatch-fill toggle switch. |
| `Templates` | array | (default container) | Pict template descriptors. The default registers the `OpenSeaDragon-Container` template, which owns the viewer div, toolbar div, drawing-mode toggle, and style blocks. Override only if you need to fully restructure the DOM. |
| `Renderables` | array | (default) | Pict renderable descriptors. The default wires `OpenSeaDragon-Wrap` to the container template. |
| `TargetElementAddress` | string | `"#OpenSeaDragon-Container-Div"` | CSS selector used by the default renderable. |

## Forwarded OpenSeaDragon Settings

During `onAfterRender`, the view assembles `this.osdSettings` from a subset of the options and passes it to `OpenSeadragon(...)`:

```javascript
this.osdSettings =
{
	element: this.targetElement,                // the #OpenSeaDragon-Element div
	prefixUrl: this.options.PrefixUrl,
	tileSources: this.options.TileSources,
	showFullPageControl: !this.options.DisableFullscreen,
	showZoomControl: !this.options.DisableButtons,
	showHomeControl: !this.options.DisableButtons
};
```

Override `customConfigureViewerSettings()` in a subclass to mutate `this.osdSettings` (add `gestureSettingsMouse`, `navImages`, `crossOriginPolicy`, `minZoomLevel`, etc.) before the viewer is constructed.

For a full list of accepted OpenSeaDragon keys, see the module's raw reference at [`source/OpenSeaDragon-Configuration.md`](https://github.com/stevenvelozo/pict-section-openseadragon/blob/master/source/OpenSeaDragon-Configuration.md) or the upstream OpenSeaDragon [Options documentation](https://openseadragon.github.io/docs/OpenSeadragon.html#.Options).

## Forwarded Annotorious Settings

When `EnableAnnotation` is true, the view also assembles `this.annoSettings`:

```javascript
this.annoSettings =
{
	allowEmpty: true,
	disableEditor: !this.editingEnabled,
	disableSelect: !this.editingEnabled
};
```

Override `customConfigureViewerSettings()` to add further Annotorious options (e.g. `drawOnSingleClick`, `handleRadius`, `readOnly`, `locale`).

## Color Stylesheet Generation

For each `(key, value)` pair in `Colors`, three CSS rules are injected into `#ColorOverrides`:

```css
.pict-osd-<key> > * {
	stroke: <value> !important;
	stroke-width: 2 !important;
}
.pict-osd-fill-<key> {
	fill: <value> !important;
}
.pict-osd-<key>-hatched > * {
	stroke: <value> !important;
	stroke-width: 2 !important;
	fill: url('data:image/svg+xml;...#hatch') !important;
}
```

`assignColor(key)` additionally writes a `#SelectedColorOverride` stylesheet that applies the selected color to the Annotorious editable / selection indicators.

## Sibling View -- `PictSectionOpenSeaDragonAnnotationSelector`

The comments panel view has its own `default_configuration`:

```json
{
	"RenderOnLoad": true,
	"DefaultRenderable": "OpenSeaDragonAnnotationSelector-Wrap",
	"DefaultDestinationAddress": "#OpenSeaDragonAnnotationSelector-Container-Div",
	"ViewAddress": "PictSectionOpenSeaDragonAnnotationSelector",
	"OSDViewAddress": "PictSectionOpenSeaDragon",
	"Colors":
	{
		"red": "red",
		"green": "green",
		"blue": "blue"
	}
}
```

| Setting | Type | Default | Description |
|---|---|---|---|
| `DefaultDestinationAddress` | string | `"#OpenSeaDragonAnnotationSelector-Container-Div"` | CSS selector the panel renders into. |
| `ViewAddress` | string | `"PictSectionOpenSeaDragonAnnotationSelector"` | Key the main view uses to locate this panel under `_Pict.views`. Must match `OSDASViewAddress` on the main view. |
| `OSDViewAddress` | string | `"PictSectionOpenSeaDragon"` | Key the panel uses to call back into the main view (`selectAnnotation`, `connectAnnotation`, `releaseAnnotations`, etc.). Must match the main view's `ViewAddress`. |
| `Colors` | object | `{ red, green, blue }` | Color map used for the comment color flags. Should mirror the main view's `Colors`. |

## Naming the Two Views Together

Because the toolbar and sibling panel communicate through `window._Pict.views[name]`, the three name settings must be consistent across the pair. A typical setup:

```javascript
// Main viewer
{
	"ViewAddress": "ExampleImageView",             // must match _Pict.addView(name, ...)
	"OSDASViewAddress": "ExampleImageAnnotations"  // points at the panel
}

// Annotation panel
{
	"ViewAddress": "ExampleImageAnnotations",      // must match _Pict.addView(name, ...)
	"OSDViewAddress": "ExampleImageView"           // points back at the main viewer
}
```

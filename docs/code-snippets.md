# Code Snippets

One runnable snippet per exposed function. Each example assumes:

```javascript
const libPict = require('pict');
const libPictSectionOpenSeaDragon = require('pict-section-openseadragon');

const _Pict = new libPict();

_Pict.addView(
	'ExampleImageView',
	Object.assign({}, libPictSectionOpenSeaDragon.default_configuration,
	{
		"ViewAddress": "ExampleImageView",
		"OSDASViewAddress": "ExampleImageAnnotations",
		"EnableAnnotation": true,
		"PrefixUrl": "/images/",
		"TileSources":
		{
			"Image":
			{
				"xmlns": "http://schemas.microsoft.com/deepzoom/2008",
				"Url": "https://openseadragon.github.io/example-images/duomo/duomo_files/",
				"Format": "jpg",
				"Overlap": "2",
				"TileSize": "256",
				"Size": { "Width": "13920", "Height": "10200" }
			}
		},
		"Colors":
		{
			"red": "red",
			"green": "green",
			"blue": "blue"
		}
	}),
	libPictSectionOpenSeaDragon);

// Grab the live view instance
const view = _Pict.views.ExampleImageView;
```

---

## `default_configuration`

Merge the shipped defaults with your own options when registering the view.

```javascript
const libPictSectionOpenSeaDragon = require('pict-section-openseadragon');

const tmpOptions = Object.assign({}, libPictSectionOpenSeaDragon.default_configuration,
{
	"ViewAddress": "ExampleImageView",
	"EnableAnnotation": true,
	"TileSources": { /* ... */ }
});

_Pict.addView('ExampleImageView', tmpOptions, libPictSectionOpenSeaDragon);
```

---

## `constructor(pFable, pOptions, pServiceHash)`

Subclass the view when you want to override hooks. Pict constructs it for you via `addView`.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		// add instance-level state here
	}
}

_Pict.addView('ExampleImageView',
	Object.assign({}, libPictSectionOpenSeaDragon.default_configuration, { /* ... */ }),
	ExampleImageView);
```

---

## `customConfigureViewerSettings()`

Override this hook to tweak OSD and Annotorious settings before they are instantiated.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	customConfigureViewerSettings()
	{
		this.osdSettings.gestureSettingsMouse = { clickToZoom: false };
		this.osdSettings.minZoomLevel = 0.5;
		this.osdSettings.crossOriginPolicy = 'Anonymous';

		this.annoSettings.drawOnSingleClick = true;
		this.annoSettings.handleRadius = 8;
	}
}
```

---

## `setTileSources(tileSources, reRender)`

Swap the image being viewed without tearing down the Pict view.

```javascript
view.setTileSources(
	{
		"Image":
		{
			"xmlns": "http://schemas.microsoft.com/deepzoom/2008",
			"Url": "https://example.com/tiles/photograph_files/",
			"Format": "jpg",
			"Overlap": "1",
			"TileSize": "256",
			"Size": { "Width": "8000", "Height": "6000" }
		}
	},
	true); // re-render
```

---

## `setAnnotations(annotations, reRender)`

Replace the current annotation set in one call.

```javascript
view.setAnnotations(
[
	{
		"@context": "http://www.w3.org/ns/anno.jsonld",
		"type": "Annotation",
		"id": "#anno-1",
		"body":
		[
			{ "type": "TextualBody", "value": "The dome", "purpose": "commenting" }
		],
		"target":
		{
			"source": "",
			"selector": { "type": "FragmentSelector", "value": "xywh=pixel:4000,3000,1200,800" },
			"styleClass": "red"
		}
	}
], true);
```

---

## `assignColor(color)`

Set the active drawing color. `color` must be a key from `options.Colors`.

```javascript
view.assignColor('green');
// New annotations drawn now will carry styleClass: "green"
```

---

## `selectAnnotation(id)`

Programmatically select an annotation (and pan/zoom to it).

```javascript
view.selectAnnotation('#anno-1');
```

---

## `focusOnAnnotation(annotationID)`

Pan / zoom the viewer to fit the annotation's bounding box, without selecting it.

```javascript
view.focusOnAnnotation('#anno-1');
```

---

## `focusOnPoint(point)`

Pan to a specific point in viewer-element coordinates.

```javascript
// Center the viewport on the spot a user just clicked
const element = view.targetElement.getBoundingClientRect();
view.focusOnPoint({ x: element.width / 2, y: element.height / 2 });
```

---

## `connectAnnotation(id)`

Draw an SVG connector between a sidebar comment and its annotation on the canvas. Typically wired to `mouseenter` on the comment element.

```javascript
const commentElement = document.querySelector('#OSD-Comment-Outer-anno-1');
commentElement.addEventListener('mouseenter', () =>
{
	view.connectAnnotation('#anno-1');
});
commentElement.addEventListener('mouseleave', () =>
{
	view.releaseAnnotations();
});
```

---

## `releaseAnnotations()`

Clear any connector line drawn by `connectAnnotation`.

```javascript
view.releaseAnnotations();
```

---

## `captureAnnotations()`

Snapshot the current annotation array (e.g. to persist to a backend).

```javascript
const tmpAnnotations = view.captureAnnotations();
fetch('/api/save-annotations',
{
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(tmpAnnotations)
});
```

---

## `captureViewport()`

Grab the current viewport bounds (useful for saving a user's zoom position).

```javascript
const tmpBounds = view.captureViewport();
if (tmpBounds)
{
	console.log('Current bounds:', tmpBounds.x, tmpBounds.y, tmpBounds.width, tmpBounds.height);
}
```

---

## `maxZoomReached()`

Check whether the viewer has hit its configured max zoom.

```javascript
if (view.maxZoomReached())
{
	console.log('Already at max zoom, further zoom-in is a no-op');
}
```

---

## `toggleDrawingMode()`

Flip the Annotorious editor between "draw only" and "comment on drawings" modes.

```javascript
document.querySelector('#my-draw-toggle').addEventListener('click', () =>
{
	view.toggleDrawingMode();
});
```

---

## `toggleHatchMode()`

Toggle the diagonal hatch fill pattern for new annotations.

```javascript
document.querySelector('#my-hatch-toggle').addEventListener('click', () =>
{
	view.toggleHatchMode();
});
```

---

## `selectDrawingTool(event, id)`

Switch the active drawing tool in the Annotorious toolbar. Usually the default toolbar buttons trigger this, but you can drive it from your own UI:

```javascript
document.querySelector('#my-arrow-button').addEventListener('click', (event) =>
{
	view.selectDrawingTool(event, 'arrow');
});

// Other valid tool ids shipped with this view:
// 'circle', 'ellipse', 'rect', 'freehand', 'polygon', 'line', 'arrow'
```

---

## `annotationCreationHook(annotation, overrideID)`

Override to run custom logic when a new annotation is drawn.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	annotationCreationHook(annotation, overrideID)
	{
		super.annotationCreationHook(annotation, overrideID);
		// Persist the annotation to a backend
		fetch('/api/annotations',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(annotation)
		});
	}
}
```

---

## `annotationSelectionHook(annotation, element)`

Override to track which annotation is currently focused.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	annotationSelectionHook(annotation, element)
	{
		super.annotationSelectionHook(annotation, element);
		this.pict.AppData.SelectedAnnotationID = annotation.id;
		this.log.info(`Selected annotation ${ annotation.id }`);
	}
}
```

---

## `annotationUpdateHook(annotation, previousState)`

Override to PATCH an updated annotation to your backend.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	annotationUpdateHook(annotation, previousState)
	{
		super.annotationUpdateHook(annotation, previousState);
		fetch(`/api/annotations/${ encodeURIComponent(annotation.id) }`,
		{
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(annotation)
		});
	}
}
```

---

## `annotationDeleteHook(annotation)`

Override to DELETE a removed annotation from your backend.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	annotationDeleteHook(annotation)
	{
		super.annotationDeleteHook(annotation);
		fetch(`/api/annotations/${ encodeURIComponent(annotation.id) }`, { method: 'DELETE' });
	}
}
```

---

## `selectionCreateHook(selection)`

Override to intercept a new selection before it has an id. Useful for draw-only workflows:

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	async selectionCreateHook(selection)
	{
		// Automatically tag new selections as "draft"
		if (!selection.body) selection.body = [];
		selection.body.push({ type: 'TextualBody', value: 'draft', purpose: 'tagging' });
		await super.selectionCreateHook(selection);
	}
}
```

---

## `canvasDoubleClickHook(event)`

Override to customize double-click behavior on the canvas.

```javascript
class ExampleImageView extends libPictSectionOpenSeaDragon
{
	canvasDoubleClickHook(event)
	{
		if (this.maxZoomReached())
		{
			this.focusOnPoint(event.position);
		}
		else
		{
			this.viewer.viewport.zoomBy(2.0);
			this.viewer.viewport.applyConstraints();
		}
	}
}
```

---

## `PictSectionOpenSeaDragonAnnotationSelector.updateAnnotationsPanel(annotations)`

Force the comments panel to re-render. Rarely needed, since the main view calls it automatically.

```javascript
const panel = _Pict.views.ExampleImageAnnotations;
panel.updateAnnotationsPanel(view.captureAnnotations());
```

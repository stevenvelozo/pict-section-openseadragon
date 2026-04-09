# Quick Start

This guide walks through a minimal working integration of `pict-section-openseadragon` into a Pict application.

## 1. Install

```bash
npm install pict-section-openseadragon
```

## 2. Load the Browser Prerequisites

`pict-section-openseadragon` relies on several globals that must be loaded before the view renders. Include them in your page (CDN URLs shown, but you may bundle them yourself):

```html
<!-- OpenSeaDragon -->
<script src="https://cdn.jsdelivr.net/npm/openseadragon@4/build/openseadragon/openseadragon.min.js"></script>

<!-- Annotorious core -->
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2/dist/openseadragon-annotorious.min.js"></script>

<!-- Annotorious plugin packs -->
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-selector-pack@2/dist/annotorious-selector-pack.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-better-polygon@2/dist/annotorious-better-polygon.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-toolbar@2/dist/annotorious-toolbar.min.js"></script>

<!-- Optional: the Pict arrow tool pack built from source/annotorious-plugins -->
<script src="/path/to/pict-pack.js"></script>
```

You also need the standard Pict loader (or a bundled Pict application build) on the page.

## 3. Provide a Mount Point

The view's `default_configuration` renders into the element with id `OpenSeaDragon-Container-Div`. Add an element that fills the area you want the viewer to occupy:

```html
<div id="OpenSeaDragon-Container-Div" style="width: 100%; height: 600px;"></div>
```

## 4. Extend the View Class

Subclassing is optional for read-only viewers, but recommended because it gives you a place to override annotation hooks.

```javascript
const libPictSectionOpenSeaDragon = require('pict-section-openseadragon');

class ExampleImageView extends libPictSectionOpenSeaDragon
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}
```

## 5. Register the View

Merge `default_configuration` with your custom options and register the class with Pict:

```javascript
const libPict = require('pict');

const ExampleImageConfiguration =
{
	"ViewIdentifier": "ExamplePhotoViewer",
	"ViewAddress": "ExampleImageView",
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
	}
};

const _Pict = new libPict();
_Pict.addView(
	'ExampleImageView',
	Object.assign({}, libPictSectionOpenSeaDragon.default_configuration, ExampleImageConfiguration),
	ExampleImageView);
```

This is enough for a zoomable read-only viewer.

## 6. Enable Annotation Editing

Flip `EnableAnnotation` on, define a color palette, and (optionally) register the sibling comments panel. The sibling view is its own Pict view -- register it under the name you gave in `OSDASViewAddress`:

```javascript
const libPictSectionOpenSeaDragonAnnotationSelector = require('pict-section-openseadragon/source/Pict-Section-OpenSeaDragonAnnotationSelector');

const ExampleImageConfiguration =
{
	"ViewAddress": "ExampleImageView",
	"OSDASViewAddress": "ExampleImageAnnotations",
	"EnableAnnotation": true,
	"PrefixUrl": "/images/",
	"TileSources": { /* ... */ },
	"Colors":
	{
		"red": "red",
		"green": "green",
		"blue": "blue",
		"cyan": "#4dd0e1",
		"pink": "#ff4081"
	}
};

_Pict.addView(
	'ExampleImageView',
	Object.assign({}, libPictSectionOpenSeaDragon.default_configuration, ExampleImageConfiguration),
	ExampleImageView);

_Pict.addView(
	'ExampleImageAnnotations',
	{
		"ViewAddress": "ExampleImageAnnotations",
		"OSDViewAddress": "ExampleImageView",
		"Colors": ExampleImageConfiguration.Colors,
		"DefaultDestinationAddress": "#OpenSeaDragonAnnotationSelector-Container-Div"
	},
	libPictSectionOpenSeaDragonAnnotationSelector);
```

Give the companion panel a mount point too:

```html
<div id="OpenSeaDragonAnnotationSelector-Container-Div" style="width: 300px; height: 600px;"></div>
```

## 7. Load Initial Annotations

Pass an array of W3C Web Annotations in the `Annotations` key. The view loads them into Annotorious and the sibling panel on render:

```javascript
"Annotations":
[
	{
		"@context": "http://www.w3.org/ns/anno.jsonld",
		"type": "Annotation",
		"id": "#sample-1",
		"body":
		[
			{ "type": "TextualBody", "value": "Main dome", "purpose": "commenting" },
			{ "type": "TextualBody", "value": "architecture", "purpose": "tagging" }
		],
		"target":
		{
			"source": "",
			"selector":
			{
				"type": "FragmentSelector",
				"value": "xywh=pixel:4000,3000,1200,800"
			},
			"styleClass": "red"
		}
	}
]
```

## 8. Common Adjustments

| Need | Setting |
|---|---|
| Hide all OSD controls | `DisableButtons: true` |
| Hide the fullscreen button only | `DisableFullscreen: true` (default) |
| Change the icon folder | `PrefixUrl: '/images/'` |
| Rename the drawing-mode toggle label | `DrawModeLabel: 'Draw'` |
| Rename the hatch-mode toggle label | `HatchModeLabel: 'Shade'` |
| Start with a different color | Call `view.assignColor('green')` after render |

## 9. Next Steps

- Browse the [API Reference](api-reference.md) to discover the full set of methods on the view
- Copy-paste from the [Code Snippets](code-snippets.md) reference for each exposed function
- Read the [Architecture](architecture.md) to understand how rendering, color stylesheets, and event hooks fit together
- Consult the [Configuration](configuration.md) reference for every key you can set

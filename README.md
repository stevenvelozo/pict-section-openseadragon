# Pict Section OpenSeaDragon

[![Build Status](https://github.com/stevenvelozo/pict-section-openseadragon/workflows/Tests/badge.svg)](https://github.com/stevenvelozo/pict-section-openseadragon/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

A configurable Pict view section that embeds [OpenSeaDragon](https://openseadragon.github.io/) for deep-zoom image display and wires it to [Annotorious](https://annotorious.github.io/) for W3C Web Annotations, with a paired side panel for comments and tags.

## Features

- **Deep-Zoom Viewer** -- Wraps OpenSeaDragon as a first-class Pict view, including its tile source, zoom, home, and fullscreen controls
- **W3C Annotations** -- Draws, edits, and stores annotations in the W3C Web Annotation format via Annotorious
- **Shape Library** -- Ships with circle, ellipse, rectangle, freehand, polygon, line, and a custom arrow tool
- **Color Palette** -- Declarative `Colors` map drives a toolbar, a live stylesheet, and per-annotation `styleClass` assignment
- **Hatch Fill Mode** -- Optional diagonal hatch pattern for shaded/highlighted annotations
- **Comments Panel** -- Sibling `PictSectionOpenSeaDragonAnnotationSelector` view renders a scrollable comments/tags sidebar linked to the viewer
- **Extensible Hooks** -- Every annotation event (create/select/update/delete, selection, double-click) is an override point on the view class
- **Pict Native** -- Extends `pict-view`, uses `ContentAssignment` for DOM work, and registers templates + renderables through the standard configuration object

## Installation

```bash
npm install pict-section-openseadragon
```

You must also load OpenSeaDragon, Annotorious, Annotorious Selector Pack, Annotorious Better Polygon, Annotorious Toolbar, and (optionally) the Annotorious PictPack bundle as globals in your page before the view renders.

## Quick Start

```javascript
const libPict = require('pict');
const libPictSectionOpenSeaDragon = require('pict-section-openseadragon');

class ExampleImageView extends libPictSectionOpenSeaDragon
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const ExampleImageConfiguration =
{
	"ViewIdentifier": "ExamplePhotoViewer",
	"ViewAddress": "ExampleImageView",
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
};

const _Pict = new libPict();
_Pict.addView(
	'ExampleImageView',
	Object.assign({}, libPictSectionOpenSeaDragon.default_configuration, ExampleImageConfiguration),
	ExampleImageView);
```

A complete runnable demo is in [`example_applications/photo_example`](example_applications/photo_example).

## Configuration Overview

The `default_configuration` export merges with any options you pass. The most commonly used keys are:

| Key | Type | Default | Purpose |
|---|---|---|---|
| `TileSources` | object | `{}` | OpenSeaDragon tile source descriptor |
| `EnableAnnotation` | boolean | `false` | Turn on the Annotorious editor and toolbar |
| `PrefixUrl` | string | `'/'` | Path prefix for OpenSeaDragon's button icons |
| `DisableButtons` | boolean | `false` | Hide zoom / home controls |
| `DisableFullscreen` | boolean | `true` | Hide the fullscreen control |
| `Colors` | object | `{red, green, blue}` | Color-key -> CSS color map driving the palette |
| `Annotations` | array | `[]` | Initial W3C annotations to load |
| `ViewAddress` | string | `'PictSectionOpenSeaDragon'` | Registered view name used by toolbar callbacks |
| `OSDASViewAddress` | string | `'PictSectionOpenSeaDragonAnnotationSelector'` | Name of the sibling comments panel view |
| `DrawModeLabel` / `HatchModeLabel` | string | `'Annotation'` / `'Hatching'` | Labels on the mode toggle switches |

See [docs/configuration.md](docs/configuration.md) for the complete reference.

## Drawing & Annotations

When `EnableAnnotation` is `true`, the view wires up:

- The Annotorious drawing toolbar (circle / ellipse / rect / freehand / polygon / line / arrow)
- A color picker populated from `Colors`
- Draw-mode and hatch-mode toggle switches
- The sibling comments panel view (`PictSectionOpenSeaDragonAnnotationSelector`) if it has been registered

All annotation events flow through override hooks on the class (`annotationCreationHook`, `annotationSelectionHook`, `annotationUpdateHook`, `annotationDeleteHook`, `selectionCreateHook`, `canvasDoubleClickHook`). Subclass and override any of them to customize behavior without forking the view.

## Architecture

- **`PictSectionOpenSeaDragon`** (`source/Pict-Section-OpenSeaDragon.js`) -- primary view, wraps OSD + Annotorious
- **`PictSectionOpenSeaDragonAnnotationSelector`** (`source/Pict-Section-OpenSeaDragonAnnotationSelector.js`) -- comments/tags panel
- **`Annotorious.PictPack`** (`source/annotorious-plugins/`) -- custom Annotorious tools (arrow)

See [docs/architecture.md](docs/architecture.md) for diagrams and the full lifecycle.

## Documentation

- [Overview](docs/README.md)
- [Quick Start](docs/quickstart.md)
- [Architecture](docs/architecture.md)
- [Configuration](docs/configuration.md)
- [API Reference](docs/api-reference.md)
- [Code Snippets](docs/code-snippets.md)
- [Annotorious Plugin Pack](docs/annotorious-plugin-pack.md)

## Building

```bash
npx quack build
```

## Testing

```bash
npm test
npm run coverage
```

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) -- MVC application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) -- View base class this module extends
- [pict-application](https://github.com/stevenvelozo/pict-application) -- Application host and lifecycle
- [pict-template](https://github.com/stevenvelozo/pict-template) -- Template engine
- [fable](https://github.com/stevenvelozo/fable) -- Core service ecosystem

## License

MIT

## Contributing

Pull requests welcome. See the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md) for the code of conduct, contribution process, and testing requirements.

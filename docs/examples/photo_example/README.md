# Photo Example — Deep-Zoom Image Viewer with Annotations

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/photo%5Fexample/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A standalone deep-zoom image viewer wired through
`pict-section-openseadragon`. The viewer loads the Duomo of Florence
as a tiled DZI image (around 13,920 × 10,200 pixels), and the
companion annotation-selector view renders a scrollable side panel of
the six W3C-Web-Annotation records that ship with the example. Pan,
zoom, pick a color, draw a new shape, or just hover the existing
ellipse around the dome — every interaction round-trips through the
two `pict-view` subclasses the section ships.

This is the basic example: one image source, one set of annotations,
two views talking to each other through a shared
`ViewAddress`. It exercises the deep-zoom viewer + Annotorious +
selector-pack + better-polygon stack with the minimum host wiring
that lights up the entire feature set.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| OpenSeaDragon view subclassed from `Pict-Section-OpenSeaDragon` | `class ExampleImageView extends libPictSectionOpenSeaDragon` |
| Annotation-selector view subclassed from `Pict-Section-OpenSeaDragonAnnotationSelector` | `class PictSectionOpenSeaDragonAnnotationSelector extends libPictSectionOpenSeaDragonAnnotationPanel` |
| Deep-zoom DZI tile source from a remote server | `TileSources.Image` with `xmlns`, `Url`, `Format`, `TileSize`, `Size` |
| Annotation toolbar enabled via one option | `EnableAnnotation: true` — toolbar, color picker, drawing modes all light up |
| `Colors` palette shared between views | Both view configs carry the same `Colors` block — the selector panel uses it to render color swatches |
| W3C Web Annotation seed data | Six annotations covering FragmentSelector, SvgSelector (line, polygon, path, ellipse) |
| `ViewAddress` / `OSDViewAddress` cross-references | Selector panel knows the viewer by hash; viewer knows the panel for status updates |
| Hatching mode for "fill" annotations | The view auto-generates SVG hatch patterns scaled to image size |
| Annotorious plugin pack registration | Plugins load via `<script>` tags in the HTML shell, then the section registers them with the Annotorious instance |
| Custom `PrefixUrl` for icons | Page-relative URL constructed at boot so OpenSeaDragon finds its zoom/home/fullscreen icons |
| Single-shot annotation overlay rendering | Lines, polygons, paths, and ellipses all rendered through the same SVG selector path |
| `npm run brand`-free smoke-test wiring | No brand block, no theme — the entire app is the two views and the seed data |

## Key files

- `Simple-Image-Viewer-Application.js` — the host application. Declares
  two configuration objects (`ExampleImageConfiguration`,
  `AnnotationsPanelConfiguration`), subclasses both section views
  (empty subclasses), then registers them in the application
  constructor and renders the selector panel. The bottom of the file
  exports the application + default Pict configuration; the topmost
  block constructs the icon `PrefixUrl` from the current page URL.
- `html/index.html` — the static HTML shell. Two `<div>` slots
  side-by-side (`OpenSeaDragon-Container-Div`,
  `OpenSeaDragonAnnotationSelector-Container-Div`), `pict.min.js`,
  then a stack of vendor `<script>` tags for OpenSeaDragon, Annotorious,
  the toolbar, the selector pack, the better-polygon plugin, and the
  Pict plugin pack — all loaded before the application bundle so the
  section's `onAfterRender` can register them with Annotorious.
- `package.json` — `name: "simple_imageviewer"` becomes the bundle
  filename `simple_imageviewer.min.js`. Note the long `copyFiles` list
  that stages every `@recogito/*` vendor file from `node_modules` into
  `dist/` — that's how the HTML's `<script src>` tags resolve at
  runtime.

## The configuration model

The application's host code doesn't store any state beyond the two
configuration objects. Configuration carries the *whole* contract;
the views handle everything else.

The viewer configuration:

```js
const ExampleImageConfiguration =
{
    "ViewIdentifier": "ExamplePhotoViewer",
    "EnableAnnotation": true,
    "PrefixUrl": newUrl,                        // page-relative ./images/
    "ViewAddress": "ExampleImageView",          // how the selector panel reaches us
    "TileSources":
    {
        Image: {
            xmlns: "http://schemas.microsoft.com/deepzoom/2008",
            Url: "https://openseadragon.github.io/example-images/duomo/duomo_files/",
            Format: "jpg",
            Overlap: "2",
            TileSize: "256",
            Size: {
                Width:  "13920",
                Height: "10200"
            }
        }
    },
    "Colors":
    {
        "red": "red",
        "green": "green",
        "blue": "blue",
        "cyan": "#4dd0e1",
        "deep-purple": "#673ab7",
        "pink": "#ff4081"
    },
    "Annotations": [ /* six W3C Web Annotation records … */ ]
};
```

The selector panel configuration:

```js
const AnnotationsPanelConfiguration =
{
    "OSDViewAddress": "ExampleImageView",       // the viewer hash to listen to
    "Colors":
    {
        "red": "red",
        "green": "green",
        "blue": "blue",
        "cyan": "#4dd0e1",
        "deep-purple": "#673ab7",
        "pink": "#ff4081"
    }
};
```

`ViewAddress` and `OSDViewAddress` are the cross-reference: each view
holds the other's hash. The selector panel asks the viewer for the
current annotation list; the viewer pings the selector when a new
annotation is drawn. Two views, one configuration link.

---

## Feature 1 — Wiring the viewer + selector

The application constructor adds both views, then immediately renders
the selector panel:

```js
class PostcardApplication extends libPictApplication
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.pict.addView('ExampleImageView',
            Object.assign(libPictSectionOpenSeaDragon.default_configuration, ExampleImageConfiguration),
            ExampleImageView);
        this.pict.addView('PictSectionOpenSeaDragonAnnotationSelector',
            Object.assign(libPictSectionOpenSeaDragonAnnotationPanel.default_configuration, AnnotationsPanelConfiguration),
            PictSectionOpenSeaDragonAnnotationSelector);
        this.pict.views.PictSectionOpenSeaDragonAnnotationSelector.render();
    }
}

module.exports.default_configuration =
{
    "Name": "A Simple Image Annotation application",
    "Hash": "Image",
    "MainViewportViewIdentifier": "ExampleImageView",   // viewer is the main viewport
    /* ... */
};
```

`MainViewportViewIdentifier: "ExampleImageView"` tells Pict's
application bootstrap which view to auto-render as the main
viewport — that's how the viewer ends up in `#OpenSeaDragon-Container-Div`
without an explicit `.render()` call. The selector panel is rendered
manually in the constructor so it appears alongside.

`Object.assign(default_configuration, overrides)` is the Retold
pattern: merge the section's defaults with the host overrides. The
section's defaults provide CSS, templates, renderables, and base
options like `DisableFullscreen: true`; the host overrides supply
`TileSources`, `Annotations`, and the cross-reference addresses.

---

## Feature 2 — Deep-zoom tile source

`TileSources` accepts any OpenSeaDragon-compatible source. The demo
uses an explicit DZI descriptor pointing at a remote tile server:

```js
"TileSources":
{
    Image: {
        xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        Url: "https://openseadragon.github.io/example-images/duomo/duomo_files/",
        Format: "jpg",
        Overlap: "2",
        TileSize: "256",
        Size: {
            Width:  "13920",
            Height: "10200"
        }
    }
}
```

A 13920 × 10200 image is ~140 megapixels — well past anything a single
`<img>` could load. OpenSeaDragon's DZI loader fetches only the tiles
the current viewport intersects, at the zoom level closest to the
displayed pixel density. Pan and zoom load more tiles; tiles further
from the viewport get garbage-collected.

The section passes `TileSources` straight to OpenSeaDragon's
constructor — any tile-source shape OpenSeaDragon supports works here
(DZI, IIIF, simple-image, custom).

---

## Feature 3 — Annotation toolbar enabled by one option

`EnableAnnotation: true` is the entire wiring contract for
Annotorious. From the section's `onAfterRender`:

```js
// We only need to instantiate Annotorious if a set of annotations
// were passed in, or annotation editing is enabled.
this.editingEnabled = this.options.EnableAnnotation && this.toolbarElement;

this.viewer = OpenSeadragon(this.osdSettings);
this.viewer.addHandler('open', () =>
{
    // ... color stylesheet injection (Feature 4) ...

    if (this.editingEnabled)
    {
        this.annotator = OpenSeadragon.Annotorious(this.viewer, /* ... */);
        Annotorious.SelectorPack(this.annotator);
        Annotorious.BetterPolygon(this.annotator);
        Annotorious.PictPack(this.annotator);
        Annotorious.Toolbar(this.annotator, this.toolbarElement);
        /* ... wire annotation events back to the selector panel ... */
    }
});
```

The plugins (`SelectorPack`, `BetterPolygon`, the custom `PictPack`,
the toolbar) are registered against the Annotorious instance only
when `EnableAnnotation` is set. Setting it `false` (or omitting it)
gives you a pan/zoom-only viewer — no toolbar, no editing, but the
configured `Annotations` still render as overlays.

`this.toolbarElement` resolves to `#DrawingToolbar` from the section's
own container template. If the toolbar's destination div is missing
from the DOM, the section logs an error and keeps the viewer running
in view-only mode.

---

## Feature 4 — Color palette → SVG stylesheet at load

The `Colors` block does two things at once: it's the source of truth
for the selector panel's swatches **and** it gets translated into an
SVG stylesheet that paints each annotation by its `styleClass`. From
the viewer's `open` handler:

```js
this.viewer.addHandler('open', () => {
    let colorStyles = '';
    if (Object.keys(this.options?.Colors)?.length)
    {
        this.colorSet = this.options.Colors;
        for (let color of Object.keys(this.colorSet))
        {
            colorStyles += css`
                .pict-osd-${ color } > * {
                    stroke: ${ this.colorSet[color] } !important;
                    stroke-width: 2 !important;
                }
                .pict-osd-fill-${ color } {
                    fill: ${ this.colorSet[color] } !important;
                }
                .pict-osd-${ color }-hatched > * {
                    stroke: ${ this.colorSet[color] } !important;
                    stroke-width: 2 !important;
                    fill: ${ buildHatchPattern(this.colorSet[color],
                        this.viewer?.world?.getItemAt(0)?.getContentSize() ||
                            { x: hatchScale, y: hatchScale }) }
                }
            `;
        }
    }
    /* ... inject colorStyles into the #ColorOverrides <style> element ... */
});
```

`buildHatchPattern(color, bounds)` generates an SVG pattern URL —
`url('data:image/svg+xml;utf8, ...#hatch')` — scaled to the displayed
image size. That's how hatched-fill annotations stay consistent at
every zoom level: the pattern's scale is bounds-aware.

The `Colors` block in the seed annotations uses the same keys:

```js
"stylesheet": {
    "type": "CssStylesheet",
    "value": ".pink > * { stroke: #ff4081 !important; stroke-width: 2 !important; }"
},
"target": {
    "source": "",
    "selector": { /* … FragmentSelector or SvgSelector … */ },
    "styleClass": "pink"
}
```

`styleClass: "pink"` → `pict-osd-pink` CSS class → 2px pink stroke,
generated from `Colors.pink: "#ff4081"`.

---

## Feature 5 — W3C Web Annotations as seed data

The six annotations in `ExampleImageConfiguration.Annotations` cover
every selector shape Annotorious supports:

```js
"Annotations":
[
    // FragmentSelector — pure xywh rectangle
    {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "type": "Annotation",
        "body": [],
        "target": {
            "selector": {
                "type": "FragmentSelector",
                "conformsTo": "http://www.w3.org/TR/media-frags/",
                "value": "xywh=pixel:2645.42,3208.52,4804.67,3968.36"
            },
            "styleClass": "pink"
        },
        "id": "#aba6a91a-9780-4e7b-9a3d-5380423162c7"
    },

    // SvgSelector — straight line
    {
        "type": "Annotation",
        "target": {
            "selector": {
                "type": "SvgSelector",
                "value": "<svg><line x1=\"3294\" y1=\"9533\" x2=\"10204\" y2=\"3381\"></line></svg>"
            },
            "renderedVia": { "name": "line" },
            "styleClass": "cyan"
        },
        /* ... */
    },

    // SvgSelector — polygon
    // SvgSelector — path (squiggle)
    // SvgSelector — ellipse
    // ... plus textual bodies for the commented ones
]
```

Every annotation carries a `body` array of `TextualBody` entries
(`purpose: 'commenting'` or `'tagging'`), an SVG/Fragment selector for
geometry, and a `styleClass` matching one of the `Colors` keys. The
selector-panel view iterates this array on render and lays each one
out as a comment card with the color flag, the geometry preview, and
the text bodies inline.

The list is **passive seed data**. The viewer renders these on first
paint; user-drawn annotations are added through the toolbar and
appear in the side panel alongside the pre-seeded ones. The host can
read the current full list via `this.annotator.getAnnotations()`
whenever it wants to persist them.

---

## Feature 6 — Icon `PrefixUrl` built at boot

OpenSeaDragon needs its toolbar icons (zoom in/out, home, fullscreen)
served from somewhere reachable. The demo constructs a page-relative
URL at boot:

```js
// Need to construct the url for where the icons for openseadragon
// are hosted (in this case just relative in the dist folder).
const pathname = window.location.pathname;
const tokens = pathname.split('/');
tokens.pop();
const newUrl = tokens.join('/') + '/images/';
```

If the page is served at `/photo_example/dist/index.html`, the icons
resolve to `/photo_example/dist/images/`. The `package.json`'s
`copyFiles` block stages the OpenSeaDragon icon folder into
`dist/images/` at build time:

```json
{ "from": "./node_modules/@recogito/annotorious-openseadragon/dist/openseadragon/**/*", "to": "./dist/" }
```

That recursive copy includes the `images/` subdirectory, which is why
the `PrefixUrl` lands on `./images/` rather than some other path.

`PrefixUrl` is one of those settings that fails silently — missing
icons just render as broken-image squares, which are easy to overlook
if you're not looking for them. The boot-time URL construction here
is the canonical pattern for "icons live alongside the page bundle."

---

## Feature 7 — The two views talking to each other

`ViewAddress` and `OSDViewAddress` are how the views find each other
across the Pict view registry:

- `ExampleImageConfiguration.ViewAddress: "ExampleImageView"` — the
  viewer announces its hash so the panel can reach it.
- `AnnotationsPanelConfiguration.OSDViewAddress: "ExampleImageView"` —
  the panel asks the viewer for the current annotation list and
  registers a listener for changes.

When the user draws a new annotation through the toolbar, the
viewer's Annotorious-create handler calls into the panel to add a new
comment card. When the user clicks a comment card in the panel, the
panel calls into the viewer to pan/zoom to that annotation's
selector bounds. The two views never share state directly — they only
ever look each other up by hash through `pict.views[<hash>]` and call
public methods.

The pattern generalises: any two `pict-view` subclasses can be
loosely coupled through a "name your partner by hash" configuration
field. No event bus, no global state — just a hash lookup.

---

## Running the example

```bash
cd example_applications/photo_example
npm install
npm run build      # quack build → quack copy → dist/simple_imageviewer.min.js
# Open dist/index.html in a browser.
```

A network connection is required because the tile source points at
`https://openseadragon.github.io/example-images/duomo/...`. Offline
runs would need the host to swap `TileSources.Image.Url` for a
locally-served DZI, or to use OpenSeaDragon's `simple-image` source
shape with a single full-resolution JPG.

## Things to try in the running app

- **Scroll-wheel zoom into the dome** — tiles load on demand; the
  image stays crisp at every zoom level because it's a deep-zoom
  pyramid.
- **Click the home button** — resets to the initial bounds.
- **Hover the cyan path** — Annotorious lights up the squiggle's
  bounds; the comment text from the annotation's `body` shows up in
  the selector panel.
- **Click a color swatch in the panel**, then a shape tool in the
  toolbar — draw a new annotation. The shape uses the picked color;
  the new card appears at the bottom of the side panel with placeholder
  comment/tag fields.
- **Click a comment card in the panel** — the viewer pans to that
  annotation. Useful for navigating long lists.
- **Switch to hatching mode** (the toggle in the toolbar) — new
  annotations get a hatched fill instead of a stroke outline. The
  pattern's scale follows the image bounds, so it stays consistent at
  every zoom.
- **Try every selector type** — line, polygon, path (freehand), and
  ellipse are all in the seed data. The selector pack adds the
  better-polygon path with mid-points; the better-polygon plugin
  smooths it.
- **Resize the side panel container** in the HTML — the panel is just
  a `<div style="width:200px; height:600px;">`; widen it and the
  comment cards grow accordingly.

## Takeaways

1. **The section is a Pict view, not a provider.** It hosts the
   OpenSeaDragon instance inside its renderable, with the same
   lifecycle hooks as any other `pict-view`. That makes it composable
   with the rest of a Pict application — solvers, AppData
   addressing, sibling views, all of it.
2. **`EnableAnnotation` is the on/off switch.** False = pan/zoom
   viewer. True = full editing surface with toolbar, selector pack,
   better-polygon, and the custom Pict pack. Same view class, two
   modes.
3. **Two-view loose coupling via `ViewAddress`.** Naming partners by
   hash through configuration is the framework's preferred
   inter-view pattern — neither view has to know about the other at
   construction time, and the wiring is transparent from the
   configuration alone.
4. **`Colors` is a contract, not a stylesheet.** The block drives the
   selector swatches, the stroke colors, the hatch patterns, and the
   `styleClass` mapping in every annotation. Adding a new color is
   "add a key to the `Colors` block"; subtracting is "remove the key".
5. **Pre-seed annotations are passive overlays.** They render on
   load; user edits add to them in memory; the host decides
   persistence by reading `annotator.getAnnotations()` on demand.
   That keeps the section storage-agnostic — local file, REST API,
   IndexedDB are all the host's problem, not the section's.

## Related documentation

- [Quick Start](../../quickstart.md) — minimum-viable wiring
- [Configuration Reference](../../configuration.md) — every viewer + selector option in detail
- [API Reference](../../api-reference.md) — the public surface on both view subclasses
- [Architecture](../../architecture.md) — how the viewer, selector, and Annotorious plugin pack fit together
- [Code Snippets](../../code-snippets.md) — host-side recipes (registering, swapping tile sources, persisting annotations)
- [Annotorious Plugin Pack](../../annotorious-plugin-pack.md) — the custom plugin layer the section adds on top of Annotorious

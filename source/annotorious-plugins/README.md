# Headlight Annotorious Plugins

## Adding a new custom tool

Adding a new tool involves creating a tool that can be integrated with Annotorious and injecting it into the toolbar with Pict. 

1. In the `src` folder create a new folder for your tool and place all related files there. For examples see [Annotorious Better Polygons](https://github.com/annotorious/annotorious-v2-plugins/tree/main/plugins/annotorious-better-polygon/src) and [Annotorious Selector Pack](https://github.com/annotorious/annotorious-v2-selector-pack/tree/main/src).
2. In `src/index.js` add your tool's ID to the `ALL_TOOLS` variable, and handle adding it in the for loop below.
3. In `Pict-Section-OpenSeaDragion.js::onAfterRender` you'll need to manually create an SVG icon for your tool that will be seen in the toolbar (see the `arrowToolButton` variable for an example).

Running `npm run build` will build your tool into the `PictPack` that Pict uses.
* Note: you can tell Pict which tools to use by passing in a config variable.


## Helpful hints

- OSD/Annotorious does not play nicely with SVG markers and zoom levels.
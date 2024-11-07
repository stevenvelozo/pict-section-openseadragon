# OpenSeaDragon configuration....

```js
 /**
  * All required and optional settings for instantiating a new instance of an OpenSeadragon image viewer.
  *
  * @typedef {Object} Options
  * @memberof OpenSeadragon
  *
  * @property {String} id
  *     Id of the element to append the viewer's container element to. If not provided, the 'element' property must be provided.
  *     If both the element and id properties are specified, the viewer is appended to the element provided in the element property.
  *
  * @property {Element} element
  *     The element to append the viewer's container element to. If not provided, the 'id' property must be provided.
  *     If both the element and id properties are specified, the viewer is appended to the element provided in the element property.
  *
  * @property {Array|String|Function|Object} [tileSources=null]
  *     Tile source(s) to open initially. This is a complex parameter; see
  *     {@link OpenSeadragon.Viewer#open} for details.
  *
  * @property {Number} [tabIndex=0]
  *     Tabbing order index to assign to the viewer element. Positive values are selected in increasing order. When tabIndex is 0
  *     source order is used. A negative value omits the viewer from the tabbing order.
  *
  * @property {Array} overlays Array of objects defining permanent overlays of
  *     the viewer. The overlays added via this option and later removed with
  *     {@link OpenSeadragon.Viewer#removeOverlay} will be added back when a new
  *     image is opened.
  *     To add overlays which can be definitively removed, one must use
  *     {@link OpenSeadragon.Viewer#addOverlay}
  *     If displaying a sequence of images, the overlays can be associated
  *     with a specific page by passing the overlays array to the page's
  *     tile source configuration.
  *     Expected properties:
  *     * x, y, (or px, py for pixel coordinates) to define the location.
  *     * width, height in point if using x,y or in pixels if using px,py. If width
  *       and height are specified, the overlay size is adjusted when zooming,
  *       otherwise the size stays the size of the content (or the size defined by CSS).
  *     * className to associate a class to the overlay
  *     * id to set the overlay element. If an element with this id already exists,
  *       it is reused, otherwise it is created. If not specified, a new element is
  *       created.
  *     * placement a string to define the relative position to the viewport.
  *       Only used if no width and height are specified. Default: 'TOP_LEFT'.
  *       See {@link OpenSeadragon.Placement} for possible values.
  *
  * @property {String} [xmlPath=null]
  *     <strong>DEPRECATED</strong>. A relative path to load a DZI file from the server.
  *     Prefer the newer Options.tileSources.
  *
  * @property {String} [prefixUrl='/images/']
  *     Prepends the prefixUrl to navImages paths, which is very useful
  *     since the default paths are rarely useful for production
  *     environments.
  *
  * @property {OpenSeadragon.NavImages} [navImages]
  *     An object with a property for each button or other built-in navigation
  *     control, eg the current 'zoomIn', 'zoomOut', 'home', and 'fullpage'.
  *     Each of those in turn provides an image path for each state of the button
  *     or navigation control, eg 'REST', 'GROUP', 'HOVER', 'PRESS'. Finally the
  *     image paths, by default assume there is a folder on the servers root path
  *     called '/images', eg '/images/zoomin_rest.png'.  If you need to adjust
  *     these paths, prefer setting the option.prefixUrl rather than overriding
  *     every image path directly through this setting.
  *
  * @property {Boolean} [debugMode=false]
  *     TODO: provide an in-screen panel providing event detail feedback.
  *
  * @property {String} [debugGridColor=['#437AB2', '#1B9E77', '#D95F02', '#7570B3', '#E7298A', '#66A61E', '#E6AB02', '#A6761D', '#666666']]
  *     The colors of grids in debug mode. Each tiled image's grid uses a consecutive color.
  *     If there are more tiled images than provided colors, the color vector is recycled.
  *
  * @property {Boolean} [silenceMultiImageWarnings=false]
  *     Silences warnings when calling viewport coordinate functions with multi-image.
  *     Useful when you're overlaying multiple images on top of one another.
  *
  * @property {Number} [blendTime=0]
  *     Specifies the duration of animation as higher or lower level tiles are
  *     replacing the existing tile.
  *
  * @property {Boolean} [alwaysBlend=false]
  *     Forces the tile to always blend.  By default the tiles skip blending
  *     when the blendTime is surpassed and the current animation frame would
  *     not complete the blend.
  *
  * @property {Boolean} [autoHideControls=true]
  *     If the user stops interacting with the viewport, fade the navigation
  *     controls.  Useful for presentation since the controls are by default
  *     floated on top of the image the user is viewing.
  *
  * @property {Boolean} [immediateRender=false]
  *     Render the best closest level first, ignoring the lowering levels which
  *     provide the effect of very blurry to sharp. It is recommended to change
  *     setting to true for mobile devices.
  *
  * @property {Number} [defaultZoomLevel=0]
  *     Zoom level to use when image is first opened or the home button is clicked.
  *     If 0, adjusts to fit viewer.
  *
  * @property {String|DrawerImplementation|Array} [drawer = ['webgl', 'canvas', 'html']]
  *     Which drawer to use. Valid strings are 'webgl', 'canvas', and 'html'. Valid drawer
  *     implementations are constructors of classes that extend OpenSeadragon.DrawerBase.
  *     An array of strings and/or constructors can be used to indicate the priority
  *     of different implementations, which will be tried in order based on browser support.
  *
  * @property {Object} drawerOptions
  *     Options to pass to the selected drawer implementation. For details
  *     please see {@link OpenSeadragon.DrawerOptions}.
  *
  * @property {Number} [opacity=1]
  *     Default proportional opacity of the tiled images (1=opaque, 0=hidden)
  *     Hidden images do not draw and only load when preloading is allowed.
  *
  * @property {Boolean} [preload=false]
  *     Default switch for loading hidden images (true loads, false blocks)
  *
  * @property {String} [compositeOperation=null]
  *     Valid values are 'source-over', 'source-atop', 'source-in', 'source-out',
  *     'destination-over', 'destination-atop', 'destination-in', 'destination-out',
  *     'lighter', 'difference', 'copy', 'xor', etc.
  *     For complete list of modes, please @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation/ globalCompositeOperation}
  *
  * @property {Boolean} [imageSmoothingEnabled=true]
  *     Image smoothing for canvas rendering (only if the canvas drawer is used). Note: Ignored
  *     by some (especially older) browsers which do not support this canvas property.
  *     This property can be changed in {@link Viewer.DrawerBase.setImageSmoothingEnabled}.
  *
  * @property {String|CanvasGradient|CanvasPattern|Function} [placeholderFillStyle=null]
  *     Draws a colored rectangle behind the tile if it is not loaded yet.
  *     You can pass a CSS color value like "#FF8800".
  *     When passing a function the tiledImage and canvas context are available as argument which is useful when you draw a gradient or pattern.
  *
  * @property {Object} [subPixelRoundingForTransparency=null]
  *     Determines when subpixel rounding should be applied for tiles when rendering images that support transparency.
  *     This property is a subpixel rounding enum values dictionary [{@link BROWSERS}] --> {@link SUBPIXEL_ROUNDING_OCCURRENCES}.
  *     The key is a {@link BROWSERS} value, and the value is one of {@link SUBPIXEL_ROUNDING_OCCURRENCES},
  *     indicating, for a given browser, when to apply subpixel rounding.
  *     Key '*' is the fallback value for any browser not specified in the dictionary.
  *     This property has a simple mode, and one can set it directly to
  *     {@link SUBPIXEL_ROUNDING_OCCURRENCES.NEVER}, {@link SUBPIXEL_ROUNDING_OCCURRENCES.ONLY_AT_REST} or {@link SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS}
  *     in order to apply this rule for all browser. The values {@link SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS} would be equivalent to { '*', SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS }.
  *     The default is {@link SUBPIXEL_ROUNDING_OCCURRENCES.NEVER} for all browsers, for backward compatibility reason.
  *
  * @property {Number} [degrees=0]
  *     Initial rotation.
  *
  * @property {Boolean} [flipped=false]
  *     Initial flip state.
  *
  * @property {Boolean} [overlayPreserveContentDirection=true]
  *     When the viewport is flipped (by pressing 'f'), the overlay is flipped using ScaleX.
  *     Normally, this setting (default true) keeps the overlay's content readable by flipping it back.
  *     To make the content flip with the overlay, set overlayPreserveContentDirection to false.
  *
  * @property {Number} [minZoomLevel=null]
  *
  * @property {Number} [maxZoomLevel=null]
  *
  * @property {Boolean} [homeFillsViewer=false]
  *     Make the 'home' button fill the viewer and clip the image, instead
  *     of fitting the image to the viewer and letterboxing.
  *
  * @property {Boolean} [panHorizontal=true]
  *     Allow horizontal pan.
  *
  * @property {Boolean} [panVertical=true]
  *     Allow vertical pan.
  *
  * @property {Boolean} [constrainDuringPan=false]
  *
  * @property {Boolean} [wrapHorizontal=false]
  *     Set to true to force the image to wrap horizontally within the viewport.
  *     Useful for maps or images representing the surface of a sphere or cylinder.
  *
  * @property {Boolean} [wrapVertical=false]
  *     Set to true to force the image to wrap vertically within the viewport.
  *     Useful for maps or images representing the surface of a sphere or cylinder.
  *
  * @property {Number} [minZoomImageRatio=0.9]
  *     The minimum percentage ( expressed as a number between 0 and 1 ) of
  *     the viewport height or width at which the zoom out will be constrained.
  *     Setting it to 0, for example will allow you to zoom out infinity.
  *
  * @property {Number} [maxZoomPixelRatio=1.1]
  *     The maximum ratio to allow a zoom-in to affect the highest level pixel
  *     ratio. This can be set to Infinity to allow 'infinite' zooming into the
  *     image though it is less effective visually if the HTML5 Canvas is not
  *     available on the viewing device.
  *
  * @property {Number} [smoothTileEdgesMinZoom=1.1]
  *     A zoom percentage ( where 1 is 100% ) of the highest resolution level.
  *     When zoomed in beyond this value alternative compositing will be used to
  *     smooth out the edges between tiles. This will have a performance impact.
  *     Can be set to Infinity to turn it off.
  *     Note: This setting is ignored on iOS devices due to a known bug (See {@link https://github.com/openseadragon/openseadragon/issues/952})
  *
  * @property {Boolean} [iOSDevice=?]
  *     True if running on an iOS device, false otherwise.
  *     Used to disable certain features that behave differently on iOS devices.
  *
  * @property {Boolean} [autoResize=true]
  *     Set to false to prevent polling for viewer size changes. Useful for providing custom resize behavior.
  *
  * @property {Boolean} [preserveImageSizeOnResize=false]
  *     Set to true to have the image size preserved when the viewer is resized. This requires autoResize=true (default).
  *
  * @property {Number} [minScrollDeltaTime=50]
  *     Number of milliseconds between canvas-scroll events. This value helps normalize the rate of canvas-scroll
  *     events between different devices, causing the faster devices to slow down enough to make the zoom control
  *     more manageable.
  *
  * @property {Number} [rotationIncrement=90]
  *     The number of degrees to rotate right or left when the rotate buttons or keyboard shortcuts are activated.
  *
  * @property {Number} [maxTilesPerFrame=1]
  *     The number of tiles loaded per frame. As the frame rate of the client's machine is usually high (e.g., 50 fps),
  *     one tile per frame should be a good choice. However, for large screens or lower frame rates, the number of
  *     loaded tiles per frame can be adjusted here. Reasonable values might be 2 or 3 tiles per frame.
  *     (Note that the actual frame rate is given by the client's browser and machine).
  *
  * @property {Number} [pixelsPerWheelLine=40]
  *     For pixel-resolution scrolling devices, the number of pixels equal to one scroll line.
  *
  * @property {Number} [pixelsPerArrowPress=40]
  *     The number of pixels viewport moves when an arrow key is pressed.
  *
  * @property {Number} [visibilityRatio=0.5]
  *     The percentage ( as a number from 0 to 1 ) of the source image which
  *     must be kept within the viewport.  If the image is dragged beyond that
  *     limit, it will 'bounce' back until the minimum visibility ratio is
  *     achieved.  Setting this to 0 and wrapHorizontal ( or wrapVertical ) to
  *     true will provide the effect of an infinitely scrolling viewport.
  *
  * @property {Object} [viewportMargins={}]
  *     Pushes the "home" region in from the sides by the specified amounts.
  *     Possible subproperties (Numbers, in screen coordinates): left, top, right, bottom.
  *
  * @property {Number} [imageLoaderLimit=0]
  *     The maximum number of image requests to make concurrently. By default
  *     it is set to 0 allowing the browser to make the maximum number of
  *     image requests in parallel as allowed by the browsers policy.
  *
  * @property {Number} [clickTimeThreshold=300]
  *      The number of milliseconds within which a pointer down-up event combination
  *      will be treated as a click gesture.
  *
  * @property {Number} [clickDistThreshold=5]
  *      The maximum distance allowed between a pointer down event and a pointer up event
  *      to be treated as a click gesture.
  *
  * @property {Number} [dblClickTimeThreshold=300]
  *      The number of milliseconds within which two pointer down-up event combinations
  *      will be treated as a double-click gesture.
  *
  * @property {Number} [dblClickDistThreshold=20]
  *      The maximum distance allowed between two pointer click events
  *      to be treated as a double-click gesture.
  *
  * @property {Number} [springStiffness=6.5]
  *
  * @property {Number} [animationTime=1.2]
  *     Specifies the animation duration per each {@link OpenSeadragon.Spring}
  *     which occur when the image is dragged, zoomed or rotated.
  *
  * @property {OpenSeadragon.GestureSettings} [gestureSettingsMouse]
  *     Settings for gestures generated by a mouse pointer device. (See {@link OpenSeadragon.GestureSettings})
  * @property {Boolean} [gestureSettingsMouse.dragToPan=true] - Pan on drag gesture
  * @property {Boolean} [gestureSettingsMouse.scrollToZoom=true] - Zoom on scroll gesture
  * @property {Boolean} [gestureSettingsMouse.clickToZoom=true] - Zoom on click gesture
  * @property {Boolean} [gestureSettingsMouse.dblClickToZoom=false] - Zoom on double-click gesture. Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  * @property {Boolean} [gestureSettingsMouse.dblClickDragToZoom=false] - Zoom on dragging through
  * double-click gesture ( single click and next click to drag).  Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  * @property {Boolean} [gestureSettingsMouse.pinchToZoom=false] - Zoom on pinch gesture
  * @property {Boolean} [gestureSettingsMouse.zoomToRefPoint=true] - If zoomToRefPoint is true, the zoom is centered at the pointer position. Otherwise,
  *     the zoom is centered at the canvas center.
  * @property {Boolean} [gestureSettingsMouse.flickEnabled=false] - Enable flick gesture
  * @property {Number} [gestureSettingsMouse.flickMinSpeed=120] - If flickEnabled is true, the minimum speed to initiate a flick gesture (pixels-per-second)
  * @property {Number} [gestureSettingsMouse.flickMomentum=0.25] - If flickEnabled is true, the momentum factor for the flick gesture
  * @property {Boolean} [gestureSettingsMouse.pinchRotate=false] - If pinchRotate is true, the user will have the ability to rotate the image using their fingers.
  *
  * @property {OpenSeadragon.GestureSettings} [gestureSettingsTouch]
  *     Settings for gestures generated by a touch pointer device. (See {@link OpenSeadragon.GestureSettings})
  * @property {Boolean} [gestureSettingsTouch.dragToPan=true] - Pan on drag gesture
  * @property {Boolean} [gestureSettingsTouch.scrollToZoom=false] - Zoom on scroll gesture
  * @property {Boolean} [gestureSettingsTouch.clickToZoom=false] - Zoom on click gesture
  * @property {Boolean} [gestureSettingsTouch.dblClickToZoom=true] - Zoom on double-click gesture. Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
    * @property {Boolean} [gestureSettingsTouch.dblClickDragToZoom=true] - Zoom on dragging through
  * double-click gesture ( single click and next click to drag).  Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.

  * @property {Boolean} [gestureSettingsTouch.pinchToZoom=true] - Zoom on pinch gesture
  * @property {Boolean} [gestureSettingsTouch.zoomToRefPoint=true] - If zoomToRefPoint is true, the zoom is centered at the pointer position. Otherwise,
  *     the zoom is centered at the canvas center.
  * @property {Boolean} [gestureSettingsTouch.flickEnabled=true] - Enable flick gesture
  * @property {Number} [gestureSettingsTouch.flickMinSpeed=120] - If flickEnabled is true, the minimum speed to initiate a flick gesture (pixels-per-second)
  * @property {Number} [gestureSettingsTouch.flickMomentum=0.25] - If flickEnabled is true, the momentum factor for the flick gesture
  * @property {Boolean} [gestureSettingsTouch.pinchRotate=false] - If pinchRotate is true, the user will have the ability to rotate the image using their fingers.
  *
  * @property {OpenSeadragon.GestureSettings} [gestureSettingsPen]
  *     Settings for gestures generated by a pen pointer device. (See {@link OpenSeadragon.GestureSettings})
  * @property {Boolean} [gestureSettingsPen.dragToPan=true] - Pan on drag gesture
  * @property {Boolean} [gestureSettingsPen.scrollToZoom=false] - Zoom on scroll gesture
  * @property {Boolean} [gestureSettingsPen.clickToZoom=true] - Zoom on click gesture
  * @property {Boolean} [gestureSettingsPen.dblClickToZoom=false] - Zoom on double-click gesture. Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  * @property {Boolean} [gestureSettingsPen.pinchToZoom=false] - Zoom on pinch gesture
  * @property {Boolean} [gestureSettingsPen.zoomToRefPoint=true] - If zoomToRefPoint is true, the zoom is centered at the pointer position. Otherwise,
  *     the zoom is centered at the canvas center.
  * @property {Boolean} [gestureSettingsPen.flickEnabled=false] - Enable flick gesture
  * @property {Number} [gestureSettingsPen.flickMinSpeed=120] - If flickEnabled is true, the minimum speed to initiate a flick gesture (pixels-per-second)
  * @property {Number} [gestureSettingsPen.flickMomentum=0.25] - If flickEnabled is true, the momentum factor for the flick gesture
  * @property {Boolean} [gestureSettingsPen.pinchRotate=false] - If pinchRotate is true, the user will have the ability to rotate the image using their fingers.
  *
  * @property {OpenSeadragon.GestureSettings} [gestureSettingsUnknown]
  *     Settings for gestures generated by unknown pointer devices. (See {@link OpenSeadragon.GestureSettings})
  * @property {Boolean} [gestureSettingsUnknown.dragToPan=true] - Pan on drag gesture
  * @property {Boolean} [gestureSettingsUnknown.scrollToZoom=true] - Zoom on scroll gesture
  * @property {Boolean} [gestureSettingsUnknown.clickToZoom=false] - Zoom on click gesture
  * @property {Boolean} [gestureSettingsUnknown.dblClickToZoom=true] - Zoom on double-click gesture. Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  * @property {Boolean} [gestureSettingsUnknown.dblClickDragToZoom=false] - Zoom on dragging through
  * double-click gesture ( single click and next click to drag).  Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  * @property {Boolean} [gestureSettingsUnknown.pinchToZoom=true] - Zoom on pinch gesture
  * @property {Boolean} [gestureSettingsUnknown.zoomToRefPoint=true] - If zoomToRefPoint is true, the zoom is centered at the pointer position. Otherwise,
  *     the zoom is centered at the canvas center.
  * @property {Boolean} [gestureSettingsUnknown.flickEnabled=true] - Enable flick gesture
  * @property {Number} [gestureSettingsUnknown.flickMinSpeed=120] - If flickEnabled is true, the minimum speed to initiate a flick gesture (pixels-per-second)
  * @property {Number} [gestureSettingsUnknown.flickMomentum=0.25] - If flickEnabled is true, the momentum factor for the flick gesture
  * @property {Boolean} [gestureSettingsUnknown.pinchRotate=false] - If pinchRotate is true, the user will have the ability to rotate the image using their fingers.
  *
  * @property {Number} [zoomPerClick=2.0]
  *     The "zoom distance" per mouse click or touch tap. <em><strong>Note:</strong> Setting this to 1.0 effectively disables the click-to-zoom feature (also see gestureSettings[Mouse|Touch|Pen].clickToZoom/dblClickToZoom).</em>
  *
  * @property {Number} [zoomPerScroll=1.2]
  *     The "zoom distance" per mouse scroll or touch pinch. <em><strong>Note:</strong> Setting this to 1.0 effectively disables the mouse-wheel zoom feature (also see gestureSettings[Mouse|Touch|Pen].scrollToZoom}).</em>
  *
  * @property {Number} [zoomPerDblClickDrag=1.2]
  *     The "zoom distance" per double-click mouse drag. <em><strong>Note:</strong> Setting this to 1.0 effectively disables the double-click-drag-to-Zoom feature (also see gestureSettings[Mouse|Touch|Pen].dblClickDragToZoom).</em>
  *
  * @property {Number} [zoomPerSecond=1.0]
  *     Sets the zoom amount per second when zoomIn/zoomOut buttons are pressed and held.
  *     The value is a factor of the current zoom, so 1.0 (the default) disables zooming when the zoomIn/zoomOut buttons
  *     are held. Higher values will increase the rate of zoom when the zoomIn/zoomOut buttons are held. Note that values
  *     < 1.0 will reverse the operation of the zoomIn/zoomOut buttons (zoomIn button will decrease the zoom, zoomOut will
  *     increase the zoom).
  *
  * @property {Boolean} [showNavigator=false]
  *     Set to true to make the navigator minimap appear.
  *
  * @property {Element} [navigatorElement=null]
  *     The element to hold the navigator minimap.
  *     If an element is specified, the Id option (see navigatorId) is ignored.
  *     If no element nor ID is specified, a div element will be generated accordingly.
  *
  * @property {String} [navigatorId=navigator-GENERATED DATE]
  *     The ID of a div to hold the navigator minimap.
  *     If an ID is specified, the navigatorPosition, navigatorSizeRatio, navigatorMaintainSizeRatio, navigator[Top|Left|Height|Width] and navigatorAutoFade options will be ignored.
  *     If an ID is not specified, a div element will be generated and placed on top of the main image.
  *
  * @property {String} [navigatorPosition='TOP_RIGHT']
  *     Valid values are 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', or 'ABSOLUTE'.<br>
  *     If 'ABSOLUTE' is specified, then navigator[Top|Left|Height|Width] determines the size and position of the navigator minimap in the viewer, and navigatorSizeRatio and navigatorMaintainSizeRatio are ignored.<br>
  *     For 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', and 'BOTTOM_RIGHT', the navigatorSizeRatio or navigator[Height|Width] values determine the size of the navigator minimap.
  *
  * @property {Number} [navigatorSizeRatio=0.2]
  *     Ratio of navigator size to viewer size. Ignored if navigator[Height|Width] are specified.
  *
  * @property {Boolean} [navigatorMaintainSizeRatio=false]
  *     If true, the navigator minimap is resized (using navigatorSizeRatio) when the viewer size changes.
  *
  * @property {Number|String} [navigatorTop=null]
  *     Specifies the location of the navigator minimap (see navigatorPosition).
  *
  * @property {Number|String} [navigatorLeft=null]
  *     Specifies the location of the navigator minimap (see navigatorPosition).
  *
  * @property {Number|String} [navigatorHeight=null]
  *     Specifies the size of the navigator minimap (see navigatorPosition).
  *     If specified, navigatorSizeRatio and navigatorMaintainSizeRatio are ignored.
  *
  * @property {Number|String} [navigatorWidth=null]
  *     Specifies the size of the navigator minimap (see navigatorPosition).
  *     If specified, navigatorSizeRatio and navigatorMaintainSizeRatio are ignored.
  *
  * @property {Boolean} [navigatorAutoResize=true]
  *     Set to false to prevent polling for navigator size changes. Useful for providing custom resize behavior.
  *     Setting to false can also improve performance when the navigator is configured to a fixed size.
  *
  * @property {Boolean} [navigatorAutoFade=true]
  *     If the user stops interacting with the viewport, fade the navigator minimap.
  *     Setting to false will make the navigator minimap always visible.
  *
  * @property {Boolean} [navigatorRotate=true]
  *     If true, the navigator will be rotated together with the viewer.
  *
  * @property {String} [navigatorBackground='#000']
  *     Specifies the background color of the navigator minimap
  *
  * @property {Number} [navigatorOpacity=0.8]
  *     Specifies the opacity of the navigator minimap.
  *
  * @property {String} [navigatorBorderColor='#555']
  *     Specifies the border color of the navigator minimap
  *
  * @property {String} [navigatorDisplayRegionColor='#900']
  *     Specifies the border color of the display region rectangle of the navigator minimap
  *
  * @property {Number} [controlsFadeDelay=2000]
  *     The number of milliseconds to wait once the user has stopped interacting
  *     with the interface before beginning to fade the controls. Assumes
  *     showNavigationControl and autoHideControls are both true.
  *
  * @property {Number} [controlsFadeLength=1500]
  *     The number of milliseconds to animate the controls fading out.
  *
  * @property {Number} [maxImageCacheCount=200]
  *     The max number of images we should keep in memory (per drawer).
  *
  * @property {Number} [timeout=30000]
  *     The max number of milliseconds that an image job may take to complete.
  *
  * @property {Number} [tileRetryMax=0]
  *     The max number of retries when a tile download fails. By default it's 0, so retries are disabled.
  *
  * @property {Number} [tileRetryDelay=2500]
  *     Milliseconds to wait after each tile retry if tileRetryMax is set.
  *
  * @property {Boolean} [useCanvas=true]
  *     Deprecated. Use the `drawer` option to specify preferred renderer.
  *
  * @property {Number} [minPixelRatio=0.5]
  *     The higher the minPixelRatio, the lower the quality of the image that
  *     is considered sufficient to stop rendering a given zoom level.  For
  *     example, if you are targeting mobile devices with less bandwidth you may
  *     try setting this to 1.5 or higher.
  *
  * @property {Boolean} [mouseNavEnabled=true]
  *     Is the user able to interact with the image via mouse or touch. Default
  *     interactions include draging the image in a plane, and zooming in toward
  *     and away from the image.
  *
  * @property {Boolean} [showNavigationControl=true]
  *     Set to false to prevent the appearance of the default navigation controls.<br>
  *     Note that if set to false, the customs buttons set by the options
  *     zoomInButton, zoomOutButton etc, are rendered inactive.
  *
  * @property {OpenSeadragon.ControlAnchor} [navigationControlAnchor=TOP_LEFT]
  *     Placement of the default navigation controls.
  *     To set the placement of the sequence controls, see the
  *     sequenceControlAnchor option.
  *
  * @property {Boolean} [showZoomControl=true]
  *     If true then + and - buttons to zoom in and out are displayed.<br>
  *     Note: {@link OpenSeadragon.Options.showNavigationControl} is overriding
  *     this setting when set to false.
  *
  * @property {Boolean} [showHomeControl=true]
  *     If true then the 'Go home' button is displayed to go back to the original
  *     zoom and pan.<br>
  *     Note: {@link OpenSeadragon.Options.showNavigationControl} is overriding
  *     this setting when set to false.
  *
  * @property {Boolean} [showFullPageControl=true]
  *     If true then the 'Toggle full page' button is displayed to switch
  *     between full page and normal mode.<br>
  *     Note: {@link OpenSeadragon.Options.showNavigationControl} is overriding
  *     this setting when set to false.
  *
  * @property {Boolean} [showRotationControl=false]
  *     If true then the rotate left/right controls will be displayed as part of the
  *     standard controls. This is also subject to the browser support for rotate
  *     (e.g. viewer.drawer.canRotate()).<br>
  *     Note: {@link OpenSeadragon.Options.showNavigationControl} is overriding
  *     this setting when set to false.
  *
  * @property {Boolean} [showFlipControl=false]
  *     If true then the flip controls will be displayed as part of the
  *     standard controls.
  *
  * @property {Boolean} [showSequenceControl=true]
  *     If sequenceMode is true, then provide buttons for navigating forward and
  *     backward through the images.
  *
  * @property {OpenSeadragon.ControlAnchor} [sequenceControlAnchor=TOP_LEFT]
  *     Placement of the default sequence controls.
  *
  * @property {Boolean} [navPrevNextWrap=false]
  *     If true then the 'previous' button will wrap to the last image when
  *     viewing the first image and the 'next' button will wrap to the first
  *     image when viewing the last image.
  *
  *@property {String|Element} zoomInButton
  *     Set the id or element of the custom 'Zoom in' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} zoomOutButton
  *     Set the id or element of the custom 'Zoom out' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} homeButton
  *     Set the id or element of the custom 'Go home' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} fullPageButton
  *     Set the id or element of the custom 'Toggle full page' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} rotateLeftButton
  *     Set the id or element of the custom 'Rotate left' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} rotateRightButton
  *     Set the id or element of the custom 'Rotate right' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} previousButton
  *     Set the id or element of the custom 'Previous page' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {String|Element} nextButton
  *     Set the id or element of the custom 'Next page' button to use.
  *     This is useful to have a custom button anywhere in the web page.<br>
  *     To only change the button images, consider using
  *     {@link OpenSeadragon.Options.navImages}
  *
  * @property {Boolean} [sequenceMode=false]
  *     Set to true to have the viewer treat your tilesources as a sequence of images to
  *     be opened one at a time rather than all at once.
  *
  * @property {Number} [initialPage=0]
  *     If sequenceMode is true, display this page initially.
  *
  * @property {Boolean} [preserveViewport=false]
  *     If sequenceMode is true, then normally navigating through each image resets the
  *     viewport to 'home' position.  If preserveViewport is set to true, then the viewport
  *     position is preserved when navigating between images in the sequence.
  *
  * @property {Boolean} [preserveOverlays=false]
  *     If sequenceMode is true, then normally navigating through each image
  *     resets the overlays.
  *     If preserveOverlays is set to true, then the overlays added with {@link OpenSeadragon.Viewer#addOverlay}
  *     are preserved when navigating between images in the sequence.
  *     Note: setting preserveOverlays overrides any overlays specified in the global
  *     "overlays" option for the Viewer. It's also not compatible with specifying
  *     per-tileSource overlays via the options, as those overlays will persist
  *     even after the tileSource is closed.
  *
  * @property {Boolean} [showReferenceStrip=false]
  *     If sequenceMode is true, then display a scrolling strip of image thumbnails for
  *     navigating through the images.
  *
  * @property {String} [referenceStripScroll='horizontal']
  *
  * @property {Element} [referenceStripElement=null]
  *
  * @property {Number} [referenceStripHeight=null]
  *
  * @property {Number} [referenceStripWidth=null]
  *
  * @property {String} [referenceStripPosition='BOTTOM_LEFT']
  *
  * @property {Number} [referenceStripSizeRatio=0.2]
  *
  * @property {Boolean} [collectionMode=false]
  *     Set to true to have the viewer arrange your TiledImages in a grid or line.
  *
  * @property {Number} [collectionRows=3]
  *     If collectionMode is true, specifies how many rows the grid should have. Use 1 to make a line.
  *     If collectionLayout is 'vertical', specifies how many columns instead.
  *
  * @property {Number} [collectionColumns=0]
  *     If collectionMode is true, specifies how many columns the grid should have. Use 1 to make a line.
  *     If collectionLayout is 'vertical', specifies how many rows instead. Ignored if collectionRows is not set to a falsy value.
  *
  * @property {String} [collectionLayout='horizontal']
  *     If collectionMode is true, specifies whether to arrange vertically or horizontally.
  *
  * @property {Number} [collectionTileSize=800]
  *     If collectionMode is true, specifies the size, in viewport coordinates, for each TiledImage to fit into.
  *     The TiledImage will be centered within a square of the specified size.
  *
  * @property {Number} [collectionTileMargin=80]
  *     If collectionMode is true, specifies the margin, in viewport coordinates, between each TiledImage.
  *
  * @property {String|Boolean} [crossOriginPolicy=false]
  *     Valid values are 'Anonymous', 'use-credentials', and false. If false, canvas requests will
  *     not use CORS, and the canvas will be tainted.
  *
  * @property {Boolean} [ajaxWithCredentials=false]
  *     Whether to set the withCredentials XHR flag for AJAX requests.
  *     Note that this can be overridden at the {@link OpenSeadragon.TileSource} level.
  *
  * @property {Boolean} [loadTilesWithAjax=false]
  *     Whether to load tile data using AJAX requests.
  *     Note that this can be overridden at the {@link OpenSeadragon.TileSource} level.
  *
  * @property {Object} [ajaxHeaders={}]
  *     A set of headers to include when making AJAX requests for tile sources or tiles.
  *
  * @property {Boolean} [splitHashDataForPost=false]
  *     Allows to treat _first_ hash ('#') symbol as a separator for POST data:
  *     URL to be opened by a {@link OpenSeadragon.TileSource} can thus look like: http://some.url#postdata=here.
  *     The whole URL is used to fetch image info metadata and it is then split to 'http://some.url' and
  *     'postdata=here'; post data is given to the {@link OpenSeadragon.TileSource} of the choice and can be further
  *     used within tile requests (see TileSource methods).
  *     NOTE: {@link OpenSeadragon.TileSource.prototype.configure} return value should contain the post data
  *     if you want to use it later - so that it is given to your constructor later.
  *     NOTE: usually, post data is expected to be ampersand-separated (just like GET parameters), and is NOT USED
  *     to fetch tile image data unless explicitly programmed, or if loadTilesWithAjax=false 4
  *     (but it is still used for the initial image info request).
  *     NOTE: passing POST data from URL by this feature only supports string values, however,
  *     TileSource can send any data using POST as long as the header is correct
  *     (@see OpenSeadragon.TileSource.prototype.getTilePostData)
  */

 /**
  * Settings for gestures generated by a pointer device.
  *
  * @typedef {Object} GestureSettings
  * @memberof OpenSeadragon
  *
  * @property {Boolean} dragToPan
  *     Set to false to disable panning on drag gestures.
  *
  * @property {Boolean} scrollToZoom
  *     Set to false to disable zooming on scroll gestures.
  *
  * @property {Boolean} clickToZoom
  *     Set to false to disable zooming on click gestures.
  *
  * @property {Boolean} dblClickToZoom
  *     Set to false to disable zooming on double-click gestures. Note: If set to true
  *     then clickToZoom should be set to false to prevent multiple zooms.
  *
  * @property {Boolean} pinchToZoom
  *     Set to false to disable zooming on pinch gestures.
  *
  * @property {Boolean} flickEnabled
  *     Set to false to disable the kinetic panning effect (flick) at the end of a drag gesture.
  *
  * @property {Number} flickMinSpeed
  *     If flickEnabled is true, the minimum speed (in pixels-per-second) required to cause the kinetic panning effect (flick) at the end of a drag gesture.
  *
  * @property {Number} flickMomentum
  *     If flickEnabled is true, a constant multiplied by the velocity to determine the distance of the kinetic panning effect (flick) at the end of a drag gesture.
  *     A larger value will make the flick feel "lighter", while a smaller value will make the flick feel "heavier".
  *     Note: springStiffness and animationTime also affect the "spring" used to stop the flick animation.
  *
  */

 /**
  * @typedef {Object} DrawerOptions
  * @memberof OpenSeadragon
  * @property {Object} webgl - options if the WebGLDrawer is used. No options are currently supported.
  * @property {Object} canvas - options if the CanvasDrawer is used. No options are currently supported.
  * @property {Object} html - options if the HTMLDrawer is used. No options are currently supported.
  * @property {Object} custom - options if a custom drawer is used. No options are currently supported.
  */
```

const libPictViewClass = require('pict-view');

const html = String.raw;
const css = String.raw;

const default_configuration = 
{
	"RenderOnLoad": true,
	"DefaultRenderable": "OpenSeaDragon-Wrap",
	"DefaultDestinationAddress": "#OpenSeaDragon-Container-Div",
	"EnableAnnotation": false,
	"DisableFullscreen": true,
	"DisableButtons": false,
	"PrefixUrl": '/',
	"TileSources": {},
	"ViewAddress": 'PictSectionOpenSeaDragon',
	"OSDASViewAddress": 'PictSectionOpenSeaDragonAnnotationSelector',
	"Colors": {
		"red": "red",
		"green": "green",
		"blue": "blue"
	},
	"Annotations": [],

	"Templates": [
		{
			"Hash": "OpenSeaDragon-Container",
			"Template": html`
				<div class="osd-container-wrapper" id="OSD-Containers-Wrapper">
					<div id="OpenSeaDragon-Element" class="osd-default"></div>
					<div id="OSD-Toolbar" class="osd-height-zero osd-toolbar">
						<div id="DrawingToolbar" class="osd-drawing-toolbar"></div>
						<div id="ColorPickerToolbar" class="osd-color-picker-toolbar"></div>
					</div>
				</div>
				<div id="OSD-SVG-Sandbox" class="osd-sandbox"></div>
				<style id="ColorOverrides"></style>
				<style id="SelectedColorOverride"></style>
				<style id="OSDGeneralStyling">
					.osd-sandbox {
						pointer-events: none; 
						width: 100vw; 
						height: 100vh; 
						top:0; left:0; 
						background-color: transparent; 
						position: absolute;
					}
					.osd-container-wrapper {
						width: 100%; 
						height: 100%; 
						display: flex; 
						flex-direction: column;
					}
					.osd-drawing-toolbar {
						min-width: 320px;
					}
					.osd-color-picker-toolbar {
						display: flex; 
						flex-direction: row;
					}
					.osd-default {
						margin-left: 20px; 
						height: 100%;
						width: calc(100% - 25px);
					}
					.osd-color-active {
						background-color: rgba(0, 0, 0, 0.3) !important;
					}
					.osd-with-annotations {
						height: calc(100% - 55px) !important;
					}
					.osd-height-zero {
						height: 0px !important;
					}
					.osd-width-zero {
						width: 0px !important;
					}
					.osd-color-button-class {
						margin:4px 4px 4px 0;
						background-color: transparent;
						cursor: pointer;
						border-radius: 4px;
						padding: 8px;
						width: 45px;
						height: 45px;
						border: 0px;
					}
					.osd-color-button-class:hover {
						background-color:rgba(0,0,0,0.05);
					}
					.osd-toolbar {
						height: 55px;
						width: 100%;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}
					.osd-annotations-panel-open {
						width: 80% !important
					}
					.osd-color-subcircle {
						display: block;
						height: 20px;
						width: 20px;
						border: 1px solid black;
						border-radius: 50%;
						margin: auto;
					}
				</style>
			`
		}
	],

	"Renderables": [
		{
			"RenderableHash": "OpenSeaDragon-Wrap",
			"TemplateHash": "OpenSeaDragon-Container",
			"DestinationAddress": "#OpenSeaDragon-Container-Div",
			"RenderType": "replace"
		}
	],

	"TargetElementAddress": "#OpenSeaDragon-Container-Div"
};

class PictSectionOpenSeaDragon extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, default_configuration, pOptions);

		super(pFable, tmpOptions, pServiceHash);
		this.triggerRender = false;
	}

	onBeforeInitialize()
	{
		super.onBeforeInitialize();

		this.targetElementAddress = false;
	}

	onAfterRender()
	{
		let tmpTargetElementSet = this.services.ContentAssignment.getElement('#OpenSeaDragon-Element');
		if (tmpTargetElementSet.length < 1)
		{
			this.log.error(`Could not find target element [#OpenSeaDragon-Element] for OpenSeaDragon!  Rendering won't function properly.`);
			this.targetElement = false;
			return false;
		}
		else
		{
			this.targetElement = tmpTargetElementSet[0];
		}
		let tmpToolbarElementSet = this.services.ContentAssignment.getElement('#DrawingToolbar');
		if (tmpToolbarElementSet.length < 1)
		{
			this.log.error(`Could not find target element [#DrawingToolbar] for Annotator Toolbar!  Annotations won't function properly.`);
			this.toolbarElement = false;
			return false;
		}
		else
		{
			this.toolbarElement = tmpToolbarElementSet[0];
		}

		// Settings for configuring OpenSeaDragon.
		this.osdSettings = 
		{
			element: this.targetElement,
			prefixUrl: this.options.PrefixUrl,
			tileSources: this.options.TileSources,
			showFullPageControl: !this.options.DisableFullscreen,
			showZoomControl: !this.options.DisableButtons,
			showHomeControl: !this.options.DisableButtons
		};

		// Color formatter for Annotorious. Works with the styleClass attribute and the color class system which is config based.
		this.format = (annotation) => {
			return 'pict-osd-' + (annotation?.underlying?.target?.styleClass || this.color || 'red');
		};

		this.customConfigureViewerSettings();

		// Instantiate the OpenSeaDragon element.
		if (this.viewer)
		{
			this.viewer.destroy();
		}
		this.viewer = OpenSeadragon(this.osdSettings);

		// Inject a stylesheet based on the set of colors passed into the component.
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
				`;
			}
		}
		else
		{
			this.assignColor('red');
			colorStyles += css`
				.pict-osd-red > * {
					stroke: red !important;
					stroke-width: 2 !important;
				}
			`;
		}
		this.pict.ContentAssignment.assignContent('#ColorOverrides', colorStyles);

		// We only need to instantiate Annotorious if a set of annotations were passed in, or annotation editing is enabled.
		this.editingEnabled = this.options.EnableAnnotation && this.toolbarElement;
		if (this.editingEnabled || this.options.Annotations?.length)
		{
			this.AnnotationsPanel = this.pict.views?.[this.options.OSDASViewAddress];
			if (!this.AnnotationsPanel)
			{
				this.triggerRender = true;
			}
			if (this.AnnotationsPanel && this.triggerRender)
			{
				this.triggerRender = false;
				this.AnnotationsPanel.render();
			}

			// Settings for configuring Annotorious.
			this.annoSettings = {
				allowEmpty: true,
				disableEditor: !this.editingEnabled,
				disableSelect: !this.editingEnabled
			};

			if (this.annotator){
				this.annotator.destroy();
			}

			// Instantiate Annotorious.
			this.annotator = OpenSeadragon.Annotorious(this.viewer, this.annoSettings);	

			// Apply the custom color formatter.
			this.annotator.formatters = [this.format];

			// Instantiate Annotorious Plugins.
			Annotorious.SelectorPack(this.annotator, 
			{
				tools: ['circle', 'ellipse', 'rect', 'freehand', 'polygon', 'line']
			});
			Annotorious.BetterPolygon(this.annotator);

			// If editing is enabled, reflow the ui to include the editing toolbar.
			if (this.editingEnabled)
			{
				this.pict.ContentAssignment.addClass('#OpenSeaDragon-Element', 'osd-with-annotations');
				this.pict.ContentAssignment.removeClass('#OSD-Toolbar', 'osd-height-zero');
				Annotorious.Toolbar(this.annotator, this.toolbarElement, { withMouse: true, withTooltip:false });
			}

			//Inject any annotations passed via config.
			if (this.options.Annotations?.length)
			{
				for (let a of this.options.Annotations)
				{
					this.annotator.addAnnotation(a);
				}
				this.AnnotationsPanel?.updateAnnotationsPanel();
			}

			// Apply hooks for the annotation events.
			this.annotator.on('createAnnotation', (annotation, overrideID) => { this.annotationCreationHook(annotation, overrideID) });
			this.annotator.on('selectAnnotation', (annotation, element) => { this.annotationSelectionHook(annotation, element); });
			this.annotator.on('updateAnnotation', (annotation, previousState) => { this.annotationUpdateHook(annotation, previousState); });
			this.annotator.on('deleteAnnotation', (annotation) => { this.annotationDeleteHook(annotation); });

			// If a custom color set was passed via config, add those custom colors to the toolbar if editing is enabled.
			if (this.colorSet && this.editingEnabled)
			{
				let colorSelectorTemplate = ``;
				for (let color of Object.keys(this.colorSet))
				{
					colorSelectorTemplate += html`
						<button type="button" class="osd-color-button-class" onclick="_Pict.views.${ this.options.ViewAddress || 'OSDSection' }.assignColor('${ color }')" id="ColorSelector${ color }">
							<div style="background-color: ${ this.colorSet[color] };" class="osd-color-subcircle"></div>
						</button>
					`;
				}
				this.pict.ContentAssignment.assignContent('#ColorPickerToolbar', `
					${ colorSelectorTemplate }
				`);
				this.assignColor(Object.keys(this.colorSet)[0]);
			}
			else
			{
				this.assignColor('red');
			}
		}
	}

	// Set a new tile source. Can optionally rerender the component as well.
	setTileSources(tileSources, reRender)
	{
		this.options.TileSources = tileSources;
		if (reRender)
		{
			this.render();
		}
	}

	// Set an Annotation set. Can optionally rerender component as well.
	setAnnotations(annotations, reRender)
	{
		this.annotator.clearAnnotations();
		this.options.Annotations = annotations;
		if (reRender)
		{
			this.render();
		}
	}

	/**
	 * This is expected to be overloaded with anything that needs to be added to the OpenSeaDragon configuration.
	 */
	customConfigureViewerSettings ()
	{
		// This can be overloaded to tweak this.osdSettings and this.annoSettings.
	}

	// Sets the current drawing color for annotations.
	assignColor (color)
	{
		this.color = color;
		if (this.colorSet)
		{
			for (let tempColor of Object.keys(this.colorSet))
			{
				this.pict.ContentAssignment.removeClass(`#ColorSelector${ tempColor }`, 'osd-color-active');
			}
		}

		// Set the active color in the toolbar.
		this.pict.ContentAssignment.addClass(`#ColorSelector${ color }`, 'osd-color-active');

		// Override the annotator drawing styles based on the selected color.
		this.pict.ContentAssignment.assignContent('#SelectedColorOverride', css`
			.a9s-annotation.editable.selected > g > * {
				stroke: ${ this.colorSet?.[color] || 'red' } !important;
				stroke-width: 2 !important;
			}
			.a9s-selection > g > path {
				stroke: ${ this.colorSet?.[color] || 'red' } !important;
				stroke-width: 2 !important;
			}
			.a9s-selection > * {
				stroke: ${ this.colorSet?.[color] || 'red' } !important;
				stroke-width: 2 !important;
			}
		`);
	}

	// Hook that runs when an annotation gets selected. By default, this just stores the style of the annotation element as part of the annotation.
	annotationCreationHook (annotation, overrideID)
	{
		if (annotation?.target){
			annotation.stylesheet = 
			{
				"type": "CssStylesheet",
				"value": css`
					.${ this.color } { 
						stroke: ${ this.colorSet?.[this.color] } !important;
						stroke-width: 2 !important; 
					}
				`
			};
			annotation.target.styleClass = this.color;
		}
		this.AnnotationsPanel?.updateAnnotationsPanel();
	}

	// Hook that runs when an annotation gets selected. By default, this just sets the current color to whatever the selected annotation is.
	annotationSelectionHook (annotation, element)
	{
		this.assignColor(annotation?.target?.styleClass || 'red');
		this.releaseAnnotations();
	}

	// Hook that runs when an annotation gets updated. By default this is used for updating the state of the comments side bar.
	annotationUpdateHook (annotation, previousState)
	{
		this.AnnotationsPanel?.updateAnnotationsPanel();
	}

	// Hook that runs when an annotation gets delete. By default this is used for updating the state of the comments side bar.
	annotationDeleteHook (annotation)
	{
		this.AnnotationsPanel?.updateAnnotationsPanel();
	}

	// Passes an annotation selection event onto the annotator plus does some extra handling to scroll it into view.
	selectAnnotation(id)
	{
		if (this.editingEnabled)
		{
			this.annotator.selectAnnotation(id);
		}
		for (let a of this.captureAnnotations())
		{
			if (a.id === id)
			{
				this.annotationSelectionHook(a);
			}
		}

		// Pan/Zoom the OSD controller to the annotation that is being selected.
		this.annotator.fitBoundsWithConstraints(id);
	}

	// Adds a connecting line between a comment and an element.
	connectAnnotation(id)
	{
		let selectionBox = this.pict.ContentAssignment.getElement(`.r6o-editor:not(.osd-comment-holder)`);
		let isSelectionOpen = selectionBox?.[0];
		if (isSelectionOpen) {
			this.pict.ContentAssignment.assignContent(`#OSD-SVG-Sandbox`, '');
			return;
		}
		const safeID = id.replaceAll('#', '');
		this.pict.ContentAssignment.assignContent(`#OSD-SVG-Sandbox`, '');
		const commentElement = this.pict.ContentAssignment.getElement(`#OSD-Comment-${ safeID }`);
		const annotationElement = this.pict.ContentAssignment.getElement(`[data-id="${ id }"]`);
		if (!commentElement?.[0] || !annotationElement?.[0])
		{
			console.warn('An expected element was missing, cannot render annotation connection with id: ', id);
			return;
		}
		const osdElementPosition = this?.viewer?.element?.getBoundingClientRect();
		const commentPosition = commentElement?.[0]?.getBoundingClientRect();
		let annotationPosition = annotationElement?.[0]?.getBoundingClientRect();
		const isInView = () => 
		{
			return annotationPosition.top >= osdElementPosition.top &&
				   annotationPosition.left >= osdElementPosition.left &&
				   annotationPosition.left + annotationPosition.width <= osdElementPosition.left + osdElementPosition.width &&
				   annotationPosition.height + annotationPosition.height <= osdElementPosition.height + osdElementPosition.height;
		};
		const performGraphics = () => 
		{
			annotationPosition = annotationElement?.[0]?.getBoundingClientRect();
			let colorClass = '';
			let fillClass = '';
			for (let a of this.captureAnnotations())
			{
				if (a.id === id)
				{
					colorClass = 'pict-osd-' + a?.target?.styleClass;
					fillClass = 'pict-osd-fill-' + a?.target?.styleClass;
				}
			}
			const lineTemplate = html`
				<style>
					.osd-connector-svg {
						z-index: 9999999;
						width: 100%;
						height: 100%;
					}
					.osd-connector-rect.osd-connector-specific {
						stroke: transparent !important;
					}
					.osd-connector-line.osd-connector-specific {
						stroke-width: 2.5 !important;
					}
				</style>
				<svg class="${ colorClass } osd-connector-svg">
					<rect class="osd-connector-rect osd-connector-specific" fill="rgb(255, 234, 0, 0.2)" x="${ annotationPosition.left }" y="${ annotationPosition.top }" width="${ annotationPosition.width }" height="${ annotationPosition.height }" />
					<line class="osd-connector-line osd-connector-specific" x1="${ commentPosition.left + 5  }" y1="${ commentPosition.top + 5 }" x2="${ annotationPosition.left + annotationPosition.width/2 }" y2="${ annotationPosition.top + annotationPosition.height/2 }" id="line1"/>
					<circle class="${ fillClass }" cx="${ annotationPosition.left + annotationPosition.width/2 }" cy="${ annotationPosition.top + annotationPosition.height/2 }" r="5" />
				</svg>`;

			const triggeringElement = this.pict.ContentAssignment.getElement(`#OSD-Comment-Outer-${ safeID }`);
			selectionBox = this.pict.ContentAssignment.getElement(`.r6o-editor:not(.osd-comment-holder)`);
			isSelectionOpen = selectionBox?.[0];
			// Only render the svg elements if the user is still hovering and selection is not being edited.
			if (triggeringElement?.[0]?.matches(':hover') && !isSelectionOpen) {
				this.pict.ContentAssignment.assignContent(`#OSD-SVG-Sandbox`, lineTemplate);
			}
			else if (isSelectionOpen)
			{
				this.pict.ContentAssignment.assignContent(`#OSD-SVG-Sandbox`, '');
			}
		}
		if (!isInView())
		{
			this.annotator.panTo(id);
			setTimeout(()=>
			{
				annotationPosition = annotationElement?.[0]?.getBoundingClientRect();
				if (!isInView())
				{
					this.annotator.fitBoundsWithConstraints(id);
					setTimeout(()=>
					{
						performGraphics();
					}, 500);
				}
				else
				{
					performGraphics();
				}
			}, 1000)
		}
		else
		{
			performGraphics();
		}
	}

	// Removes any connecting lines between a comments and annotations.
	releaseAnnotations()
	{
		this.pict.ContentAssignment.assignContent(`#OSD-SVG-Sandbox`, '');
	}

	/*
	 * Captures the current viewport relative to the overall image.
	 */
	captureViewport ()
	{
		if (this.viewer){
			return this.viewer.viewport.getBounds();
		}
		this.log.error('OpenSeaDragon is not initialized for some reason, giving back null.');
		return null;
	}

	/*
	 * Captures the annotation objects for the currently annotated image.
	 */
	captureAnnotations ()
	{
		if (this.annotator){
			return this.annotator.getAnnotations();
		}
		return [];
	}
		
}

module.exports = PictSectionOpenSeaDragon;
module.exports.default_configuration = default_configuration;


const libPictViewClass = require('pict-view');

const html = String.raw;
const css = String.raw;

const default_configuration = {
	"RenderOnLoad": true,

	"DefaultRenderable": "OpenSeaDragon-Wrap",
	"DefaultDestinationAddress": "#OpenSeaDragon-Container-Div",
	"EnableAnnotation": false,
	"PrefixUrl": '/',
	"TileSources": {},
	"ViewAddress": 'OSDSection',
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
				<div style="width: 100%; height: 100%; display: flex; flex-direction: row;" id="OSD-Containers-Wrapper">
					<div style="width: 100%; height: 100%;" id="OSD-Container-Left">
						<div id="OpenSeaDragon-Element" style="margin-left: 20px; margin-right: 5px; width: calc(100% - 25px); height: 100%;"></div>
						<div id="OSD-Toolbar" class="osd-height-zero osd-toolbar">
							<div id="DrawingToolbar" style="min-width: 320px" ></div>
							<div id="ColorPickerToolbar" style="display: flex; flex-direction: row;"></div>
						</div>
					</div>
					<div style="width: 20%; height: 100%;" class="osd-width-zero" id="OSD-Container-Right">
						<div id="OSD-Scrollable-Comments" class="osd-scrollable-comments"></div>
					</div>
				</div>
				<style id="ColorOverrides"></style>
				<style id="SelectedColorOverride"></style>
				<style id="OSDGeneralStyling">
					.osd-scrollable-comments {
						height: 100%;
						width: 100%;
						overflow-y: scroll;
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
					.color-button-class {
						margin:4px 4px 4px 0;
						background-color: transparent;
						cursor: pointer;
						border-radius: 4px;
						padding: 8px;
						width: 45px;
						height: 45px;
						border: 0px;
					}
					.color-button-class:hover {
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

		this.initialRenderComplete = false;
	}

	onBeforeInitialize()
	{
		super.onBeforeInitialize();

		this.targetElementAddress = false;
	}

	onAfterRender()
	{
		if (!this.initialRenderComplete)
		{
			this.onAfterInitialRender();
			this.initialRenderComplete = true;
		}
	}

	onAfterInitialRender()
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
			tileSources: this.options.TileSources
		};

		// Settings for configuring Annotorious.
		this.annoSettings = {
			allowEmpty: true
		};

		// Color formatter for Annotorious. Works with the styleClass attribute and the color class system which is config based.
		this.format = (annotation) => {
			return 'pict-osd-' + (annotation?.underlying?.target?.styleClass || this.color || 'red');
		};

		this.customConfigureViewerSettings();

		// Instantiate the OpenSeaDragon element.
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
		const editingEnabled = this.options.EnableAnnotation && this.toolbarElement;
		if (editingEnabled || this.options.Annotations?.length)
		{
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
			if (editingEnabled)
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
				this.updateAnnotationsPanel();
			}

			// Apply hooks for the annotation events.
			this.annotator.on('createAnnotation', (annotation, overrideID) => { this.annotationCreationHook(annotation, overrideID) });
			this.annotator.on('selectAnnotation', (annotation, element) => { this.annotationSelectionHook(annotation, element); });
			this.annotator.on('updateAnnotation', (annotation, previousState) => { this.annotationUpdateHook(annotation, previousState); });
			this.annotator.on('deleteAnnotation', (annotation) => { this.annotationDeleteHook(annotation); });

			// If a custom color set was passed via config, add those custom colors to the toolbar if editing is enabled.
			if (this.colorSet && editingEnabled)
			{
				let colorSelectorTemplate = ``;
				for (let color of Object.keys(this.colorSet))
				{
					colorSelectorTemplate += html`
						<button type="button" class="color-button-class" onclick="_Pict.views.${ this.options.ViewAddress || 'OSDSection' }.assignColor('${ color }')" id="ColorSelector${ color }" style="color: ${ this.colorSet[color] };">&#11044;</button>
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
		this.updateAnnotationsPanel();
	}

	// Hook that runs when an annotation gets selected. By default, this just sets the current color to whatever the selected annotation is.
	annotationSelectionHook (annotation, element)
	{
		this.assignColor(annotation?.target?.styleClass || 'red');
	}

	// Hook that runs when an annotation gets updated. By default this is used for updating the state of the comments side bar.
	annotationUpdateHook (annotation, previousState)
	{
		this.updateAnnotationsPanel();
	}

	// Hook that runs when an annotation gets delete. By default this is used for updating the state of the comments side bar.
	annotationDeleteHook (annotation)
	{
		this.updateAnnotationsPanel(annotationSet);
	}

	// Update the annotations side panel to include any annotation comments/tags, should be called anytime the annotation list gets changed (create/update/delete).
	updateAnnotationsPanel(annotations) {
		const annotationSet = annotations || this.captureAnnotations();

		this.pict.ContentAssignment.assignContent('#OSD-Scrollable-Comments', '');
		let commentsTemplate = '';

		// Loop through the annotations and add any with comments or tags to the panel ui.
		for (let a of annotationSet)
		{
			let bodyCommentTemplate = '';
			let bodyTagTemplate = '';
			for (let b of a.body)
			{
				if (b.purpose === 'commenting')
				{
					bodyCommentTemplate += html`
						<div class="r6o-editable-text" style="border-top: 1px solid lightgrey; max-height: fit-content;">
							${ b.value }
						</div>
					`;
				}
				if (b.purpose === 'tagging')
				{
					bodyTagTemplate += html`
						<li>
							<span class="r6o-label">
								${ b.value }
							</span>
						</li>
					`;
				}
			}
			if (bodyCommentTemplate || bodyTagTemplate)
			{
				if (bodyCommentTemplate)
				{
					bodyCommentTemplate = html`
						<div disabled class="r6o-widget comment">
							${ bodyCommentTemplate }
						</div>
					`;
				}
				if (bodyTagTemplate)
				{
					bodyTagTemplate = html`
						<div class="r6o-widget r6o-tag">
							<ul class="r6o-taglist">
								${ bodyTagTemplate }
							</ul>
						</div>
					`;
				}
				commentsTemplate += html`
					<div class="r6o-editor r6o-arrow-top r6o-arrow-left pushed right" onclick="_Pict.views.${ this.options.ViewAddress || 'OSDSection' }.selectAnnotation('${ a.id }')" style="z-index: auto; line-height: normal; cursor: pointer; max-width: 100%; opacity: 1; position: relative !important; margin: 10px 0px 10px 0px;">
						<div class="r6o-editor-inner" style="-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-radius: 4px; border: 1px solid lightgrey;">
							${ bodyCommentTemplate }
							${ bodyTagTemplate }
						</div>
					</div>
				`;
			}
		}

		// If anything was added to the panel template, inject it back into the section and ensure the panel is open.
		if (commentsTemplate)
		{
			this.pict.ContentAssignment.assignContent('#OSD-Scrollable-Comments', commentsTemplate);
			this.pict.ContentAssignment.removeClass('#OSD-Container-Right', 'osd-width-zero');
			this.pict.ContentAssignment.addClass('#OSD-Container-Left', 'osd-annotations-panel-open');
		}
		else
		{
			// Otherwise, close the panel ui.
			this.pict.ContentAssignment.addClass('#OSD-Container-Right', 'osd-width-zero');
			this.pict.ContentAssignment.removeClass('#OSD-Container-Left', 'osd-annotations-panel-open');
		}
	}

	// Passes an annotation selection event onto the annotator plus does some extra handling to scroll it into view.
	selectAnnotation(id)
	{
		this.annotator.selectAnnotation(id);
		for (let a of this.captureAnnotations())
		{
			if (a.id === id)
			{
				this.annotationSelectionHook(a);
			}
		}

		// Pan/Zoom the OSD controller to the annotation that is being selected.
		this.annotator.fitBounds(id);
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


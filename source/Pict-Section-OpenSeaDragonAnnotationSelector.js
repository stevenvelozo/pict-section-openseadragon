const libPictViewClass = require('pict-view');

const html = String.raw;
const css = String.raw;

const default_configuration = 
{
	"RenderOnLoad": true,
	"DefaultRenderable": "OpenSeaDragonAnnotationSelector-Wrap",
	"DefaultDestinationAddress": "#OpenSeaDragonAnnotationSelector-Container-Div",
	"ViewAddress": 'PictSectionOpenSeaDragonAnnotationSelector',
	"OSDViewAddress": "PictSectionOpenSeaDragon",
	"Colors": {
		"red": "red",
		"green": "green",
		"blue": "blue"
	},
	"Templates": [
		{
			"Hash": "OpenSeaDragonAnnotationSelector-Container",
			"Template": html`
				<div class="osd-scrollable-comments" id="OSD-Scrollable-Comments">
				</div>
				<style id="OSDASGeneralStyling">
					.osd-scrollable-comments {
						height: 100%;
						width: 100%;
						overflow-y: scroll;
						padding: 5px;
						background-color: lightgrey;
					}
					.osd-editable-text {
						border-top: 1px solid lightgrey; 
						max-height: fit-content;
					}
					.osd-editor-inner {
						-webkit-box-shadow: none !important; 
						-moz-box-shadow: none !important; 
						box-shadow: none !important; 
						border-radius: 6px !important; 
						border: 1px solid lightgrey;
					}
					.osd-comment-holder {
						z-index: auto; 
						line-height: normal; 
						cursor: pointer; 
						max-width: 100%; 
						opacity: 1; 
						position: relative !important; 
						margin: 10px 0px 10px 0px;
					}
					.osd-comment-color-flag {
						height: 12px;
						width: 60%;
						border-bottom: 3px solid lightgrey;
						border-right: 3px solid lightgrey;
						display: block;
						border-radius: 6px 0px 25px 0px;
					}
					.osd-editor-inner:hover > span.osd-comment-color-flag{
						transform: translate(-2px, -2px);
						border-bottom: 5px solid lightgrey;
						border-right: 5px solid lightgrey;
					}
					.osdas-taglist {
						display: flex;
    					flex-wrap: wrap;
					}
					.osdas-widget {
						display: block !important;
					}
				</style>
			`
		}
	],

	"Renderables": [
		{
			"RenderableHash": "OpenSeaDragonAnnotationSelector-Wrap",
			"TemplateHash": "OpenSeaDragonAnnotationSelector-Container",
			"DestinationAddress": "#OpenSeaDragonAnnotationSelector-Container-Div",
			"RenderType": "replace"
		}
	],

	"TargetElementAddress": "#OpenSeaDragonAnnotationSelector-Container-Div"
}

class PictSectionOpenSeaDragonAnnotationSelector extends libPictViewClass
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
		this.OSDSection = this.pict.views?.[this.options.OSDViewAddress];
		if (!this.OSDSection)
		{
			this.triggerRender = true;
		}
		if (this.OSDSection)
		{
			if (this.triggerRender)
			{
				this.triggerRender = false;
				this.OSDSection.render();
			}
			this.updateAnnotationsPanel();
		}
	}

	// Update the annotations side panel to include any annotation comments/tags, should be called anytime the annotation list gets changed (create/update/delete).
	updateAnnotationsPanel(annotations) {
		const annotationSet = annotations || this.OSDSection?.captureAnnotations() || [];

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
						<div class="r6o-editable-text osd-editable-text">
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
						<div class="r6o-widget r6o-tag osdas-widget">
							<ul class="r6o-taglist osdas-taglist">
								${ bodyTagTemplate }
							</ul>
						</div>
					`;
				}
				commentsTemplate += html`
					<div class="osd-comment-holder r6o-editor r6o-arrow-top r6o-arrow-left pushed right" onclick="_Pict.views.${ this.options.OSDViewAddress || 'PictSectionOpenSeaDragon' }.selectAnnotation('${ a.id }')">
						<div class="r6o-editor-inner osd-editor-inner">
							<span class="osd-comment-color-flag" style="background-color: ${ this.options.Colors[a?.target?.styleClass] || 'transparent' };"></span>
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
}

module.exports = PictSectionOpenSeaDragonAnnotationSelector;
module.exports.default_configuration = default_configuration;


const libPictApplication = require('pict-application');

const libPictSectionOpenSeaDragon = require('../../source/Pict-Section-OpenSeaDragon.js');

class ExampleImageView extends libPictSectionOpenSeaDragon
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

// Need to construct the url for where the icons for openseadragon are hosted (in this case just relative in the dist folder).
const pathname = window.location.pathname;
const tokens = pathname.split('/');
tokens.pop();
const newUrl = tokens.join('/') + '/images/';

const ExampleImageConfiguration = (
{
	"ViewIdentifier": "ExamplePhotoViewer",
	"EnableAnnotation": true,
	"PrefixUrl": newUrl,
	"ViewAddress": "ExampleImageView",
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
	"Annotations": 
	[
		{
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"type": "Annotation",
			"body": [],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".pink { stroke: #ff4081 !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "FragmentSelector",
					"conformsTo": "http://www.w3.org/TR/media-frags/",
					"value": "xywh=pixel:2645.419677734375,3208.516845703125,4804.665771484375,3968.359619140625"
				},
				"styleClass": "pink"
			},
			"id": "#aba6a91a-9780-4e7b-9a3d-5380423162c7"
		},
		{
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"type": "Annotation",
			"body": [],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".cyan { stroke: #4dd0e1 !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "SvgSelector",
					"value": "<svg><line x1=\"3294.521484375\" y1=\"9533.80859375\" x2=\"10204.3251953125\" y2=\"3381.527099609375\"></line></svg>"
				},
				"renderedVia": {
					"name": "line"
				},
				"styleClass": "cyan"
			},
			"id": "#c8d1d4b9-7a15-40f2-a2c4-7e2977070fe8"
		},
		{
			"type": "Annotation",
			"body": [],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".blue { stroke: blue !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "SvgSelector",
					"value": "<svg><polygon points=\"5156.021484375,1708.80615234375 5121.77490234375,4228.82421875 9119.7294921875,3172.92822265625 7975.3447265625,2410.005126953125\" /></svg>"
				},
				"styleClass": "blue"
			},
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"id": "#2612129b-96a9-4b8c-8bef-69e12886bc56"
		},
		{
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"type": "Annotation",
			"body": [
				{
					"type": "TextualBody",
					"value": "Test Comment squiggle",
					"purpose": "commenting"
				},
				{
					"type": "TextualBody",
					"value": "Test Tag",
					"purpose": "tagging"
				},
				{
					"type": "TextualBody",
					"value": "Test Comment Reply",
					"purpose": "commenting"
				}
			],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".cyan { stroke: #4dd0e1 !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "SvgSelector",
					"value": "<svg><path d=\"M2859.190185546875 5282.3310546875 L2558.54052734375 5237.14697265625 L1744.520751953125 5147.52001953125 L1309.6341552734375 5111.05224609375 L988.37890625 5112.365234375 L787.1219482421875 5163.7802734375 L578.3851318359375 5279.74560546875 L382.9145202636719 5452.884765625 L231.9209442138672 5673.6572265625 L130.70794677734375 5917.58984375 L96.66393280029297 6110.72119140625 L113.61854553222656 6281.34228515625 L151.94410705566406 6410.97705078125 L232.88900756835938 6508.69873046875 L385.1839599609375 6592.88671875 L690.7075805664062 6653.01904296875 L1248.4622802734375 6686.08740234375 L2167.1875 6648.5888671875 L3201.23486328125 6577.080078125 L4193.65087890625 6482.27978515625 L5097.97021484375 6354.005859375 L5786.984375 6194.80322265625 L6377.5556640625 6030.09619140625 L6809.05517578125 5932.353515625 L7137.6357421875 5900.43798828125 L7398.33447265625 5901.15234375 L7550.31298828125 5928.66650390625 L7643.73974609375 5966.16943359375 L7697.9169921875 6022.60205078125 L7736.08349609375 6104.65185546875 L7755.60888671875 6218.7744140625 L7766.671875 6363.4267578125 L7758.33935546875 6543.5166015625 L7719.47216796875 6775.92626953125 L7655.95703125 7031.11181640625 L7561.79736328125 7313.01611328125 L7431.794921875 7625.50830078125 L7284.8427734375 7871.85009765625 L7077.44921875 8101.3720703125 L6847.65966796875 8295.0361328125 L6591.490234375 8431.6240234375 L6289.7802734375 8530.6484375 L5934.90966796875 8569.0771484375 L5498.54296875 8587.419921875 L4911.52587890625 8557.8828125 L4287.40576171875 8490.6845703125 L3731.925537109375 8392.0048828125 L3227.34326171875 8305.0166015625 L2858.608642578125 8252.8408203125 L2603.367919921875 8217.2607421875 L2485.54345703125 8204.525390625 L2454.01904296875 8203.71484375 L2439.26025390625 8203.033203125 L2433.2412109375 8202.25390625 L2433.2412109375 8202.25390625\"></path></svg>"
				},
				"styleClass": "cyan"
			},
			"id": "#7bfead2d-313c-4efc-a44c-58f377acfa9e"
		},
		{
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"type": "Annotation",
			"body": [
				{
					"type": "TextualBody",
					"value": "Test comment",
					"purpose": "commenting"
				},
				{
					"type": "TextualBody",
					"value": "Test Tag",
					"purpose": "tagging"
				}
			],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".red { stroke: red !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "SvgSelector",
					"value": "<svg><line x1=\"4419.302734375\" y1=\"4627.744140625\" x2=\"13797.0009765625\" y2=\"9454.41796875\"></line></svg>"
				},
				"renderedVia": {
					"name": "line"
				},
				"styleClass": "red"
			},
			"id": "#6ee8b86f-0667-4ce7-9615-63cd84b2cacf"
		},
		{
			"@context": "http://www.w3.org/ns/anno.jsonld",
			"type": "Annotation",
			"body": [
				{
					"type": "TextualBody",
					"value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
					"purpose": "commenting"
				}
			],
			"stylesheet": {
				"type": "CssStylesheet",
				"value": ".deep-purple { stroke: #673ab7 !important; stroke-width: 2 !important; }"
			},
			"target": {
				"source": "",
				"selector": {
					"type": "SvgSelector",
					"value": "<svg><ellipse cx=\"7838.73193359375\" cy=\"6904.47216796875\" rx=\"2798.57958984375\" ry=\"1622.33154296875\"></ellipse></svg>"
				},
				"styleClass": "deep-purple"
			},
			"id": "#1632ac19-51f2-4fa5-b3b7-5e6382c4ff2e"
		}
	]
});

class PostcardApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('ExampleImageView', Object.assign(libPictSectionOpenSeaDragon.default_configuration, ExampleImageConfiguration), ExampleImageView);
	}
};

module.exports = PostcardApplication

module.exports.default_configuration = ({
	"Name": "A Simple Image Annotation application",
	"Hash": "Image",

	"MainViewportViewIdentifier": "ExampleImageView",

	"pict_configuration":
		{
			"Product": "Image-Application",

			"DefaultAppData": {
			}
		}
});
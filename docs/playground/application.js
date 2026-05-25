// Application Code for the OpenSeaDragon section playground.
//
// `Base` is the synthesized wrapper PictApplication built from
// _playground.json's `WrapperKind: "view"` declaration.  It already
// registers the OpenSeaDragon view from `OpenSeaDragonViewConfig` in
// your Pict Config tab.  This file's job is to inject the external
// libraries the view depends on at runtime — OpenSeaDragon's UMD bundle
// lives at `build/openseadragon/openseadragon.min.js` on jsDelivr, which
// does NOT fit the v2 _playground schema's default `dist/<name>.min.js`
// CDN URL pattern, and the Annotorious bundles all live under the
// `@recogito/` scope which also doesn't fit.  v3 schema gap: support a
// custom `Path` override for `Source: "cdn"` imports so packages with
// non-standard CDN layouts can declare their full path inline rather
// than relying on application.js to do the async <script> dance below.
//
// Until then we async-load every external <script> in onBeforeInitializeAsync
// and stamp a sized parent on the mount div so OpenSeaDragon's 100%-height
// container has something to fill.

const _OSD_SCRIPTS =
[
	'https://cdn.jsdelivr.net/npm/openseadragon@5/build/openseadragon/openseadragon.min.js',
	'https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2.7.18/dist/openseadragon-annotorious.min.js',
	'https://cdn.jsdelivr.net/npm/@recogito/annotorious-toolbar@1.2.1/dist/annotorious-toolbar.min.js',
	'https://cdn.jsdelivr.net/npm/@recogito/annotorious-selector-pack@0.6.1/dist/annotorious-selector-pack.js',
	'https://cdn.jsdelivr.net/npm/@recogito/annotorious-better-polygon@0.2.0/dist/annotorious-better-polygon.js'
];

const _OSD_STYLESHEET = 'https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2.7.18/dist/annotorious.min.css';

function _injectStylesheet(pHref)
{
	let tmpLink = document.createElement('link');
	tmpLink.rel = 'stylesheet';
	tmpLink.href = pHref;
	document.head.appendChild(tmpLink);
}

function _loadScript(pSrc)
{
	return new Promise(function (pResolve, pReject)
	{
		let tmpScript = document.createElement('script');
		tmpScript.src = pSrc;
		tmpScript.async = false;
		tmpScript.onload = function () { pResolve(); };
		tmpScript.onerror = function () { pReject(new Error('Failed to load: ' + pSrc)); };
		document.head.appendChild(tmpScript);
	});
}

function _ensureMountSize()
{
	// OSD's `.osd-container-wrapper { height: 100%; }` needs a sized
	// parent.  The iframe's playground-content uses flex but the mount
	// div itself is a block child with content-defined height.  Stamp
	// an explicit height + width so the deep-zoom canvas has room.
	let tmpMount = document.getElementById('OpenSeaDragon-Container-Div');
	if (tmpMount)
	{
		tmpMount.style.width = '100%';
		tmpMount.style.height = '600px';
		tmpMount.style.background = '#1a1a1a';
	}
}

return class extends Base
{
	onBeforeInitializeAsync(fCallback)
	{
		// Drop the Annotorious stylesheet into <head>.  The view's own
		// CSS handles layout; this only adds the comment / tag widget
		// styling Annotorious ships separately.
		_injectStylesheet(_OSD_STYLESHEET);

		// Stamp size on the mount div BEFORE the view tries to render
		// into it — OSD reads the container's bounding rect at init.
		_ensureMountSize();

		// Sequentially load the external scripts.  Order matters:
		// OpenSeaDragon first, then Annotorious + its plugins.  async=false
		// preserves execution order, but using a Promise chain makes the
		// failure path explicit.
		let tmpChain = Promise.resolve();
		for (let i = 0; i < _OSD_SCRIPTS.length; i++)
		{
			(function (pSrc)
			{
				tmpChain = tmpChain.then(function () { return _loadScript(pSrc); });
			}(_OSD_SCRIPTS[i]));
		}

		tmpChain
			.then(function () { console.log('[OpenSeaDragon playground] external libraries loaded'); })
			.then(function () { fCallback(); })
			.catch(function (pError)
			{
				console.error('[OpenSeaDragon playground] external library load failed:', pError);
				fCallback(pError);
			});
	}
};

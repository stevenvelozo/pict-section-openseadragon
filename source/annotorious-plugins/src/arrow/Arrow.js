import { Selection } from '@recogito/annotorious/src/tools/Tool';
import { toSVGTarget } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { 
  linePointsToArrowPath,
} from './ArrowTool';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';



export default class Arrow {
    constructor(anchor, g, env) {
      this.arrowConfig = {
        maxHeight: 200,
        minHeight: 100
      };
      this.points = [anchor];

      this.env = env;

      this.group = document.createElementNS(SVG_NAMESPACE, 'g');

      this.Line = document.createElementNS(SVG_NAMESPACE, 'g');
      this.Line.setAttribute('class', 'a9s-selection pict-arrow');

      this.outer = document.createElementNS(SVG_NAMESPACE, 'path');
      this.outer.setAttribute('class', 'a9s-outer');

      this.inner = document.createElementNS(SVG_NAMESPACE, 'path');
      this.inner.setAttribute('class', 'a9s-inner');


      this.setPoints(this.points);
      // this.mask = new Mask(env.image, this.inner);

      // TODO optional: mask to dim the outside area
      // this.mask = new Mask(env.image, this.inner);
      this.Line.appendChild(this.outer);
      this.Line.appendChild(this.inner);

      // Additionally, selection remains hidden until 
      // the user actually moves the mouse
      this.group.style.display = 'none';

      // TODO optional: mask to dim the outside area
      // this.group.appendChild(this.mask.element);
      // this.group.appendChild(this.mask.element);
      this.group.appendChild(this.Line);

      g.appendChild(this.group);
    }

    setPoints = points => {
      var str = linePointsToArrowPath(points, this.arrowConfig);
      this.outer.setAttribute('d', str);
      this.inner.setAttribute('d', str);
    }

    getBoundingClientRect = () =>
      this.outer.getBoundingClientRect();

    dragTo = xy => {
      // Make visible
      this.group.style.display = null;

      this.mousepos = xy;
      
      const points = [ ...this.points, xy ];
      
      this.setPoints(points);
      // this.mask.redraw();
    }
    
    addPoint = xy => {
      this.points = [ ...this.points, xy ];
      this.setPoints(this.points); 
    }
  
    get element() {
      return this.Line;
    }

    onScaleChanged = scale => {
      this.scale = scale;
    }


    toSelection = () => 
    {
      return new Selection({
        ...toSVGTarget(this.group, this.env.image),
        renderedVia: {
          name: 'arrow'
        },
      });
    }

    destroy = () => {
      this.group.parentNode.removeChild(this.group);
      this.Line = null;    
      this.group = null;
    }
}
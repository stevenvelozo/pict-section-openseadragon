import Tool from '@recogito/annotorious/src/tools/Tool';
import { isTouchDevice } from '@recogito/annotorious/src/util/Touch';
import Arrow from './Arrow';
import EditableArrow from './EditableArrow';

const isTouch = isTouchDevice();

const rotatePoint = (cxy, xy, angleInRadians) => {
  const cosAngle = Math.cos(angleInRadians);
  const sinAngle = Math.sin(angleInRadians);

  // Translate point to origin relative to the center of rotation
  const translatedX = xy[0] - cxy[0];
  const translatedY = xy[1] - cxy[1];

  // Apply rotation formulas
  const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
  const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

  // Translate point back to its original position relative to the center of rotation
  const finalX = rotatedX + cxy[0];
  const finalY = rotatedY + cxy[1];

  return [ finalX, finalY ];
}

export const linePointsToArrowPath = (points, arrowConfig) => {
  let lineLength = 0;
  let rise = 0;
  let run = 0;
  if (points.length > 1)
  {
    rise = points[1][1] - points[0][1];
    run = points[1][0] - points[0][0];
    lineLength = Math.sqrt(Math.pow(run, 2) + Math.pow(rise, 2));
  }

  // Create and rotate arrowhead
  const arrowPoint = points[0];
  const arrowHeight = Math.min(Math.max(lineLength * .1, arrowConfig.minHeight), arrowConfig.maxHeight);
  const arrowCoords = [
    // start at point where line will meet arrowhead
    [arrowPoint[0] + arrowHeight, arrowPoint[1]],
    // left corner
    [arrowPoint[0] + arrowHeight, arrowPoint[1] + arrowHeight/2],
    // arrowpoint
    arrowPoint,
    // right corner
    [arrowPoint[0] + arrowHeight, arrowPoint[1] - arrowHeight/2],
    // back to start point
    [arrowPoint[0] + arrowHeight, arrowPoint[1]]
  ].map(pt => {
    if (points.length > 1)
    {
      return rotatePoint(arrowPoint, pt, Math.atan2(rise, run));
    }
    return pt;
  });

  // Draw line
  var headStr = arrowCoords.map(pt => `L${pt[0]} ${pt[1]}`).join(' ');
  var bodyStr = points.map(pt => `L${pt[0]} ${pt[1]}`).join(' ');
  var str = `M ${headStr.substring(1)} Z ${bodyStr}`;
  return str;
}

export default class ArrowTool extends Tool {
  constructor(g, config, env) {
    super(g, config, env);

    this._isDrawing = false;
  }

  startDrawing = (x, y) => {
    this._isDrawing = true;
    
    this.attachListeners({
      mouseMove: this.onMouseMove,
      mouseUp: this.onMouseUp,
    });
    
    this.arrow = new Arrow([x, y], this.g, this.env);
  }
  
  onMouseMove = (x, y) =>
    this.arrow.dragTo([ x, y ]);

  onMouseUp = (x, y, evt) => {
    console.log('onMouseUp', x, y, this.arrow.points);
    this.arrow.addPoint([ x, y ]); 
    // check if both coordinates are same
    if (this.arrow.points[0] == this.arrow.points[2] && this.arrow.points[1] == this.arrow.points[3]) {
      this.emit('cancel');
      this.stop();
    }
    else{
      this._isDrawing = false;
      const shape = this.arrow.element;
      shape.annotation = this.arrow.toSelection();
      this.emit('complete', shape);
      this.stop();
    }
  }

  get isDrawing() {
    return this._isDrawing;
  }

  stop = () => {
    this.detachListeners();

    this._isDrawing = false;

    if (this.arrow) {
      this.arrow.destroy();
      this.arrow = null;
    }
  }

  onScaleChanged = scale => {
    if (this.arrow)
    {
      this.arrow.onScaleChanged(scale);
    }
  }

  createEditableShape = annotation =>
    new EditableArrow(annotation, this.g, this.config, this.env);

}

ArrowTool.identifier = 'arrow';

ArrowTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*arrow/g);
}
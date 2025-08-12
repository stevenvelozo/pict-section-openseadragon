import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE, addClass, hasClass, removeClass } from '@recogito/annotorious/src/util/SVG';
import { drawEmbeddedSVG } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { format, setFormatterElSize } from '@recogito/annotorious/src/util/Formatting';
import Mask from '@recogito/annotorious/src/tools/polygon/PolygonMask';

import { toSVGTarget } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { 
  linePointsToArrowPath,
} from './ArrowTool';

// this only returns the two ends, not the arrow shape
const getPoints = shape => {
  const d = shape.querySelector('.a9s-inner').getAttribute('d');
  const pointList = d.split('L');
  console.log(d, pointList);
  const points = [];
  if(pointList.length > 0) {
    // The tip of the arrow, index 0 is where the triangle meets the line of the arrow
    var beginPoint = pointList[2].trim().split(' ');
    points.push([parseFloat(beginPoint[0]), parseFloat(beginPoint[1])]);
    var endPoint = pointList[pointList.length - 1].trim().split(' ');
    points.push([parseFloat(endPoint[0]), parseFloat(endPoint[1])]);
  }

  return points;
}

const getBBox = shape =>
  shape.querySelector('.a9s-inner').getBBox();

export default class EditableArrow extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);
    this.arrowConfig = {
      maxHeight: 200,
      minHeight: 100
    };

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    // 'g' for the editable line shape
    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');

    this.shape = drawEmbeddedSVG(annotation);
    // this.shape.querySelector('.a9s-inner')
    //   .addEventListener('mousedown', this.onGrab(this.shape));

    this.mask = new Mask(env.image, this.shape.querySelector('.a9s-inner'));

    this.containerGroup.appendChild(this.mask.element);

    this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
    this.elementGroup.setAttribute('class', 'a9s-annotation editable selected headlight-a9s-filled');
    this.elementGroup.setAttribute('data-id', annotation.id);
    this.elementGroup.appendChild(this.shape);

    this.handles = getPoints(this.shape).map((pt, i) => {
      const handle = this.drawHandle(pt[0], pt[1]);
      handle.setAttribute('pointIndex', i);
      handle.addEventListener('mousedown', this.onGrab(handle));
      this.elementGroup.appendChild(handle);
      return handle;
    });

    this.containerGroup.appendChild(this.elementGroup);
    g.appendChild(this.containerGroup);

    format(this.shape, annotation, config.formatters);

    // The grabbed element (handle or entire shape), if any
    this.grabbedElem = null;

    // Mouse grab point
    this.grabbedAt = null;
  }

  onScaleChanged = () => 
    this.handles.map(this.scaleHandle);

  setPoints = (points) => {
    var str = linePointsToArrowPath(points, this.arrowConfig);
    const inner = this.shape.querySelector('.a9s-inner');
    const outer = this.shape.querySelector('.a9s-outer');
    inner.setAttribute('d', str);
    outer.setAttribute('d', str);
    const { x, y, width, height } = outer.getBBox();

    // TODO optional: mask to dim the outside area
    // this.mask.redraw();

    setFormatterElSize(this.elementGroup, x, y, width, height);
  }

  onGrab = grabbedElem => evt => {
    if (evt.button !== 0) return;  // left click
    this.grabbedElem = grabbedElem;
    this.grabbedAt = this.getSVGPoint(evt);
    console.log('onGrab', this.grabbedElem, this.grabbedAt);
  }

  onMouseMove = evt => {
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : (coord + delta > max ? max - coord : delta);

    if (this.grabbedElem) {
      const pos = this.getSVGPoint(evt);

      const { x, y, width, height } = getBBox(this.shape);

      if (this.handles.includes(this.grabbedElem)) {

        const { naturalWidth, naturalHeight } = this.env.image;

        const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
        const dy = constrain(y, pos.y - this.grabbedAt.y, naturalHeight - height);

        const pointIndex = this.grabbedElem.getAttribute('pointIndex');

        const updatedPoints = getPoints(this.shape).map((pt, i) => {
          if (i == pointIndex)
          {
            return [pt[0] + dx, pt[1] + dy];
          }
          return pt;
        });
        console.log(pointIndex);
        console.log(updatedPoints[0], updatedPoints[1]);

        this.grabbedAt = pos;

        // Update the handle's position
        const handleX = updatedPoints[pointIndex][0];
        const handleY = updatedPoints[pointIndex][1];
        const handleInner = this.grabbedElem.querySelector('.a9s-handle-inner');
        const handleOuter = this.grabbedElem.querySelector('.a9s-handle-outer');
        handleInner.setAttribute('cx', handleX);
        handleInner.setAttribute('cy', handleY);
        handleInner.setAttribute('transform-origin', `${handleX} ${handleY}`);
        handleOuter.setAttribute('cx', handleX);
        handleOuter.setAttribute('cy', handleY);
        handleOuter.setAttribute('transform-origin', `${handleX} ${handleY}`);

        this.setPoints(updatedPoints);

        this.emit('update', 
          new Selection({
            ...toSVGTarget(this.shape, this.env.image),
            renderedVia: {
              name: 'arrow'
            },
            fillClass: _Pict?.AppData?.Annotations?.SelectedColorOverride ? _Pict?.AppData?.Annotations?.SelectedColorOverride : 'red'
          })
        );
      }
    }
  }

  onMouseUp = evt => {
    this.grabbedElem = null;
    this.grabbedAt = null;
  }

  get element() {
    return this.elementGroup;
  }

  updateState = annotation => {
    const points = getPoints(svgFragmentToShape(annotation));
    this.setPoints(points);
  }

  destroy = () => {
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  }

}
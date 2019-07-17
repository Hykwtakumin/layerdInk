import {
  Points,
  getPoint,
  addPath,
  drawPath,
  setPointerEventsEnableToAllPath,
  setPointerEventsDisableToAllPath
} from "./PathDrawer";
import {
  addPoint,
  addPointWithpCircle,
  addPolyLine,
  addDot
} from "./PointDrawer";


export class SVGCanvas {
  canvas: SVGElement;
  lastPath: SVGPathElement;
  prevEvent: PointerEvent;
  groupingList: SVGElement[];
  isDragging: boolean;
  isAllowTouch: boolean;
  color: string;
  penWidth: number;

  constructor(canvas: SVGElement) {
    /* canva setting */
    this.canvas = canvas;
    // this.canvas.addEventListener("pointerdown", this.handleDown);
    // this.canvas.addEventListener("pointermove", this.handleMove);
    // this.canvas.addEventListener("pointerup", this.handleUp);

    /* touch event */
    document.body.addEventListener("pointerdown", this.handleDown);
    document.body.addEventListener("pointermove", this.handleMove);
    document.body.addEventListener("pointerup", this.handleUp);

    /* pen setting */
    this.isAllowTouch = false;
    this.penWidth = 6;
    this.color = "#585858";
    /* other setting */
    this.groupingList = [];

  }

  /*for canvas resize*/
  resizeCanvasSize = (width: number, height: number) => {
    //this.canvas.style.width = width.toString();
    //this.canvas.style.height = height.toString();
    this.canvas.setAttribute("width", `${width}`);
    this.canvas.setAttribute("height", `${height}`);
    this.canvas.setAttribute("viewBox", `0,0,${width},${height}`);
  };

  handleDown = (event: PointerEvent) => {
    //下のレイヤーにもイベントを通したい
    //event.preventDefault();
    if (event.pointerType === "pen") {
        //canvasのpointer-eventのnoneを解除

        //this.canvas.setAttribute("pointer-events", "auto");
        //document.body.setAttribute("touch-action", "none");

        this.isDragging = true;
        const path = addPath(this.canvas, getPoint(event));
        path.setAttribute("stroke", this.color);
        path.setAttribute("stroke-width", this.penWidth.toString());
        path.classList.add("current-path");
        this.lastPath = path;
    }
  };

  handleMove = (event: PointerEvent) => {
    if (this.isDragging && event.pointerType === "pen") {
      event.preventDefault();
      drawPath(this.lastPath, getPoint(event));
    }
  };

  handleUp = (event: PointerEvent) => {
    event.preventDefault();
    this.isDragging = false;
    //pointer-eventsをnoneに設定

    //this.canvas.setAttribute("pointer-events", "none");
    //document.body.setAttribute("touch-action", "auto");

    if (this.lastPath) {
      this.lastPath.classList.remove("current-path");
      this.lastPath = null;
    }

  };
  /* clear canvas */
  clearCanvas = () => {
    while (this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
    }
  };

  redoCanvas = () => {
    if (this.canvas.lastChild) {
      this.canvas.removeChild(this.canvas.lastChild);
    }
  };

  /* change stroke color */
  changeColor = (color: string) => {
    this.color = color;
  };
}

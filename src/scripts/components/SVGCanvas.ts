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

import chromep from "chrome-promise";
import Tab = chrome.tabs.Tab;

import {handlePostLayer, getOwnerName} from "../content"


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
    //event.preventDefault();
    if (event.pointerType === "pen") {
        //canvasのpointer-eventのnoneを解除
        this.setFocus();

        this.isDragging = true;
        const path = addPath(this.canvas, getPoint(event));
        path.setAttribute("stroke", this.color);
        path.setAttribute("stroke-width", this.penWidth.toString());
        path.classList.add("current-path");
        this.lastPath = path;
    } else if (event.pointerType === "mouse") {
      //下のレイヤーにもイベントを渡す
      //SVGレイヤーのpointer-eventをnoneに設定する
      this.resetFocus();
    }
  };

  handleMove = (event: PointerEvent) => {
    if (this.isDragging && event.pointerType === "pen") {
      event.preventDefault();
      drawPath(this.lastPath, getPoint(event));
    }
  };

  handleUp = (event: PointerEvent) => {
    //event.preventDefault();
    if (event.pointerType === "pen") {
      this.isDragging = false;  
      if (this.lastPath) {
        this.lastPath.classList.remove("current-path");
        this.lastPath = null;
      }
      //this.resetFocus();
      const ownerName = getOwnerName();
     handlePostLayer(ownerName);
    }
  };
  /*pointer-eventsを無効化する*/
  resetFocus = () => {
    this.canvas.setAttribute("pointer-events", "none");
  }
  /*pointer-eventsを有効化する*/
  setFocus = () => {
    this.canvas.setAttribute("pointer-events", "auto");
  }


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

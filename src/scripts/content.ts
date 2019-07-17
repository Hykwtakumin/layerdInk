//import {loadLayer} from "./components/loadLayer";

// import "./style.css";
import { SVGCanvas } from "./components/SVGCanvas";

import {
  getPoint,
  addPath,
  drawPath,
  setPointerEventsEnableToAllPath,
  setPointerEventsDisableToAllPath
} from "./components/PathDrawer";



// const colorPicker = document.getElementById("color");
// const undoButton = document.getElementById("undo");
// const redoButton = document.getElementById("redo");
// const clearButton = document.getElementById("clear");
// const addLinkButton = document.getElementById("addLink");
// const importButton = document.getElementById("import");
// const dlButton = document.getElementById("download");

// const modeMenu = document.getElementById("editorMenu") as HTMLSelectElement;
// const widthMenu = document.getElementById("widthMenu") as HTMLSelectElement;
// const drawModeMenu = document.getElementById("drawMode") as HTMLSelectElement;

// const dialog = document.getElementById("dialog") as HTMLDialogElement;
// const modalCancel = document.getElementById("modalCancel");
// const modalConfirm = document.getElementById("modalConfirm");

// modeMenu.addEventListener("change", handleModeChange);
// widthMenu.addEventListener("change", handleWidthChange);
// drawModeMenu.addEventListener("change", handelDrawModeChange);

// colorPicker.addEventListener("change", handleColorChange);
// undoButton.addEventListener("click", handleUndo);
// redoButton.addEventListener("click", handleRedo);
// clearButton.addEventListener("click", handleClear);
// addLinkButton.addEventListener("click", handleAddLink);
// importButton.addEventListener("click", handelImpotButton);
// dlButton.addEventListener("click", handelDlButton);
document.addEventListener("keypress", handleKeyPress);

// modalCancel.addEventListener("click", handleModalCancel);
// modalConfirm.addEventListener("click", handleModalConfirm);

let oldPath: SVGElement;
let selectedPath: SVGElement;
let prevElm: SVGElement;

document.body.setAttribute("touch-action", "none");

// @ts-ignore
const root = document.createElementNS("http://www.w3.org/2000/svg","svg") as SVGElement;
root.id = "svgRoot";
root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
root.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
document.body.appendChild(root);
const svgCanvas = new SVGCanvas(root);
//svgCanvas.resizeCanvasSize(window.innerWidth, document.body.clientHeight);
//window.innerHeight
svgCanvas.resizeCanvasSize(window.innerWidth, 3000);


/* onResize */
window.onresize = () => {
  //svgCanvas.resizeCanvasSize(window.innerWidth, document.body.clientHeight);
  svgCanvas.resizeCanvasSize(window.innerWidth, 3000);
};

function handleUndo() {
  svgCanvas.redoCanvas();
}

function handleRedo() {
  if (oldPath) {
    // @ts-ignore
    svgCanvas.appendChild(oldPath);
    oldPath = null;
  }
}

function handleClear() {
  svgCanvas.clearCanvas();
}

function handelImpotButton() {}

function handelDlButton() {
  const fileName = "hyperillust.svg";

  const blobObject: Blob = new Blob(
    [new XMLSerializer().serializeToString(svgCanvas.canvas)],
    { type: "image/svg+xml;charset=utf-8" }
  );
  const dlUrl = window.URL.createObjectURL(blobObject);
  const dlLink = document.createElement("a");
  document.body.appendChild(dlLink);
  dlLink.setAttribute("href", dlUrl);
  dlLink.setAttribute("target", "_blank");
  dlLink.setAttribute("download", fileName);
  dlLink.click();
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "z") {
    /*Undo HotKey*/
    handleUndo();
  } else if (event.key === "z" && event.shiftKey) {
    /*Redo HotKey*/
    handleRedo();
  }
}

function handleExport() {}

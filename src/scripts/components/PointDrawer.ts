import { Points, getPoint } from "./PathDrawer";

export type pCircle = {
  point: {
    x: number;
    y: number;
  };
  r: number;
};

export const addPoint = (
  canvas: SVGElement,
  event: PointerEvent,
  color: string,
  width: number
) => {
  /*drawMode*/
  const circleElm: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  const points = getPoint(event);

  circleElm.setAttribute("cx", `${points.x}`);
  circleElm.setAttribute("cy", `${points.y}`);
  circleElm.setAttribute("r", `${width}`);
  circleElm.setAttribute("pointer-events", "none");
  circleElm.setAttribute("fill", color);

  canvas.appendChild(circleElm);
  return circleElm;
};

export const addDot = (canvas: SVGElement, points: Points) => {
  const circleElm: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  circleElm.setAttribute("cx", `${points.x}`);
  circleElm.setAttribute("cy", `${points.y}`);
  circleElm.setAttribute("r", `1`);
  circleElm.setAttribute("pointer-events", "none");
  circleElm.setAttribute("storke", `red`);
  circleElm.setAttribute("stroke-width", "10");

  canvas.appendChild(circleElm);
};

export const addPointWithpCircle = (
  canvas: SVGElement,
  event: PointerEvent,
  color: string,
  width: number
): pCircle => {
  const circleElm: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  const points = getPoint(event);
  const r = width * event.pressure;

  circleElm.setAttribute("cx", `${points.x}`);
  circleElm.setAttribute("cy", `${points.y}`);
  circleElm.setAttribute("r", `${r}`);
  //circleElm.setAttribute("fill", "none");
  circleElm.setAttribute("storke", `${color}`);
  circleElm.setAttribute("stroke-width", "1");
  circleElm.setAttribute("pointer-events", "none");

  canvas.appendChild(circleElm);

  const returnCircle: pCircle = {
    point: points,
    r: r
  };

  return returnCircle;
};

export const addPolyLine = (
  canvas: SVGElement,
  color: string,
  width: number,
  start: Points,
  dest: Points
): SVGPathElement => {
  const polyLineElm: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  const initPoint = `M ${start.x} ${start.y} `;
  const destPoint = `L ${dest.x} ${dest.y}`;

  polyLineElm.setAttribute("d", `${initPoint} ${destPoint}`);
  //polyLineElm.setAttribute("fill", "none");
  polyLineElm.setAttribute("stroke-width", `${width}`);
  polyLineElm.setAttribute("storke", color);
  polyLineElm.setAttribute("pointer-events", "none");
  canvas.appendChild(polyLineElm);

  return polyLineElm;
};

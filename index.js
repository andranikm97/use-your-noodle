const canvas = document.querySelector("canvas");
const canvasSize = 700;
const canvasCenter = {
  x: canvasSize / 2,
  y: canvasSize / 2,
};
const pi = Math.PI;

/**
 *
 * @type {CanvasRenderingContext2D} ctx
 */
let ctx;

function makeDrawing(noodleWidth) {
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    setupCanvas();
    drawBowl();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    drawNoodle(noodleWidth);
  }
}

function drawNoodle(noodleWidth) {
  let minBendRadius = 50;
  let maxBendRadius = 20;
  let maximumNextAngleFactor = 0.5;

  let arcCenterX = canvasCenter.x;
  let arcCenterY = canvasCenter.y;
  let radius = minBendRadius;
  let startAngle = Math.random() * 2 * pi;
  let endAngle = Math.random() * 2 * pi;
  let ccw = false;

  for (let i = 0; i < 3; i++) {
    // console.log(`${ccw ? "c" : ""}cw Arc #`, i + 1);
    // console.log(
    //   `Radius ${radius}, x ${arcCenterX}, y ${arcCenterY}, i˚ ${
    //     startAngle * (180 / pi)
    //   }, f˚ ${endAngle * (180 / pi)}`
    // );

    const outerNoodle = new Path2D();
    const innerNoodle = new Path2D();
    outerNoodle.arc(arcCenterX, arcCenterY, radius, startAngle, endAngle, ccw);
    innerNoodle.arc(
      arcCenterX,
      arcCenterY,
      radius - noodleWidth,
      startAngle,
      endAngle,
      ccw
    );

    const nextRadius = Math.max(Math.random() * minBendRadius, maxBendRadius);

    const totalRadius = radius + nextRadius;
    arcCenterX += totalRadius * Math.cos(endAngle);
    arcCenterY += totalRadius * Math.sin(endAngle);
    radius = nextRadius + noodleWidth;

    let nextEndAngle;
    let nextStartAngle;
    if (!ccw) {
      nextStartAngle = 2 * pi - (pi - endAngle);
      nextEndAngle =
        nextStartAngle - Math.random() * maximumNextAngleFactor * 2 * pi;
    } else {
      nextStartAngle = pi - (2 * pi - endAngle);
      nextEndAngle =
        nextStartAngle + Math.random() * maximumNextAngleFactor * 2 * pi;
    }

    startAngle = nextStartAngle;
    endAngle = nextEndAngle;
    ccw = !ccw;

    ctx.stroke(outerNoodle);
    ctx.stroke(innerNoodle);
  }
}

function degToRad(deg) {
  if (deg > 360) {
    deg = deg % 360;
  }
  return (deg * pi) / 180;
}

function radToDeg(rad) {
  if (rad > pi) {
    rad = rad % pi;
  }
  return 180 * (rad / pi);
}

function setupCanvas() {
  ctx.canvas.width = canvasSize;
  ctx.canvas.height = canvasSize;
}

function drawBowl() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(canvasCenter.x, canvasCenter.y, (0.95 * canvasSize) / 2, 0, 360);
  ctx.stroke();
  ctx.closePath();
}

function moveToCenter() {
  ctx.moveTo(canvasCenter.x, canvasCenter.y);
}

makeDrawing(5);

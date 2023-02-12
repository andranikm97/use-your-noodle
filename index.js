const canvas = document.querySelector("canvas");
const canvasSize = 700;
const canvasCenter = {
  x: canvasSize / 2,
  y: canvasSize / 2,
};
const pi = Math.PI;
const bowlLineWidth = 10;

/**
 *
 * @type {CanvasRenderingContext2D} ctx
 */
let ctx;

function makeDrawing(noodleWidth) {
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    setupCanvas();
    const bowlRadius = drawBowl();
    drawNoodle(bowlRadius, noodleWidth);
  }
}

function drawNoodle(bowlRadius, noodleWidth) {
  let minBendRadius = 50;
  let maxBendRadius = 20;
  let maximumNextAngleFactor = 0.5;

  const initialRadius = minBendRadius;
  let [arcCenterX, arcCenterY, startAngle, endAngle] = getNoodleInitialParams(
    bowlRadius,
    initialRadius
  );

  let radius = initialRadius;
  let ccw = false;

  for (let i = 0; i < 10; i++) {
    // console.log(`${ccw ? "c" : ""}cw Arc #`, i + 1);
    // console.log(
    //   `Radius ${radius}, x ${arcCenterX}, y ${arcCenterY}, i˚ ${
    //     startAngle * (180 / pi)
    //   }, f˚ ${endAngle * (180 / pi)}`
    // );

    const outerNoodleBorder = new Path2D();
    const innerNoodleBorder = new Path2D();
    const noodleBody = new Path2D();
    outerNoodleBorder.arc(
      arcCenterX,
      arcCenterY,
      radius,
      startAngle,
      endAngle,
      ccw
    );
    noodleBody.arc(
      arcCenterX,
      arcCenterY,
      radius - noodleWidth / 2,
      startAngle,
      endAngle,
      ccw
    );
    innerNoodleBorder.arc(
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

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke(outerNoodleBorder);
    ctx.stroke(innerNoodleBorder);

    ctx.strokeStyle = "white";
    ctx.lineWidth = noodleWidth;
    ctx.stroke(noodleBody);
  }
}

function getNoodleInitialParams(bowlRadius, initialRadius) {
  const initialAngleOnBowl = Math.random() * 2 * pi;

  const arcCenterX =
    canvasCenter.x +
    (bowlRadius - initialRadius - bowlLineWidth / 2) *
      Math.cos(initialAngleOnBowl);
  const arcCenterY =
    canvasCenter.y +
    (bowlRadius - initialRadius - bowlLineWidth / 2) *
      Math.sin(initialAngleOnBowl);

  const startAngle = initialAngleOnBowl - pi / 2;
  const endAngle = initialAngleOnBowl + pi / 2;

  return [arcCenterX, arcCenterY, startAngle, endAngle];
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
  const bowlRadius = (0.95 * canvasSize) / 2;

  ctx.strokeStyle = "black";
  ctx.lineWidth = bowlLineWidth;
  ctx.beginPath();
  ctx.arc(canvasCenter.x, canvasCenter.y, bowlRadius, 0, 360);
  ctx.stroke();

  return bowlRadius;
}

function moveToCenter() {
  ctx.moveTo(canvasCenter.x, canvasCenter.y);
}

makeDrawing(5);

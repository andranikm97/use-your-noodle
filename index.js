const canvas = document.querySelector("canvas");
const canvasSize = 700;
const canvasCenter = {
  x: canvasSize / 2,
  y: canvasSize / 2,
};
const pi = Math.PI;
const bowlLineWidth = 10;
const bowlColour = "black";

/**
 *
 * @type {CanvasRenderingContext2D} ctx
 */
let ctx;

function makeDrawing(width, minLength, maxLength, minBendRadius) {
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    setupCanvas();
    const bowlRadius = drawBowl();
    drawNoodles(bowlRadius, width, minLength, maxLength, minBendRadius);
  }
}

function drawNoodles(bowlRadius, width, minLength, maxLength, minBendRadius) {
  for (let i = 0; i < 500; i++) {
    drawNoodle(bowlRadius, width, minLength, maxLength, minBendRadius);
  }
}

function drawNoodle(bowlRadius, width, minLength, maxLength, minBendRadius) {
  let maxBendRadius = 3 * minBendRadius;

  const initialRadius = getNextArcRadius(minBendRadius, maxBendRadius);
  let [arcCenterX, arcCenterY, startAngle, endAngle] = getNoodleInitialParams(
    bowlRadius,
    initialRadius
  );

  let radius = initialRadius;
  let ccw = false;
  let targetLength = minLength + Math.random() * (maxLength - minLength);
  let noodleLength = 0;

  while (noodleLength < targetLength) {
    noodleLength += calcArcLength(radius, startAngle, endAngle);

    let nextRadius = getNextArcRadius(minBendRadius, maxBendRadius) + width;
    let [nextArcCenterX, nextArcCenterY] = getNextArcCoords(
      arcCenterX,
      arcCenterY,
      radius,
      nextRadius,
      endAngle,
      width
    );

    while (
      !checkNextArcInsideBowl(
        bowlRadius,
        nextRadius,
        nextArcCenterX,
        nextArcCenterY
      )
    ) {
      if (nextRadius > minBendRadius) {
        nextRadius = 0.9 * nextRadius;
      } else {
        if (ccw) {
          endAngle -= degToRad(10);
        } else {
          endAngle += degToRad(10);
        }
      }

      [nextArcCenterX, nextArcCenterY] = getNextArcCoords(
        arcCenterX,
        arcCenterY,
        radius,
        nextRadius,
        endAngle,
        width
      );
    }

    const [nextStartAngle, nextEndAngle] = getNextArcAngles(ccw, endAngle);

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
      radius - width / 2,
      startAngle,
      endAngle,
      ccw
    );
    innerNoodleBorder.arc(
      arcCenterX,
      arcCenterY,
      radius - width,
      startAngle,
      endAngle,
      ccw
    );

    ctx.strokeStyle = noodleBorderColour;
    ctx.lineWidth = 1;
    ctx.stroke(outerNoodleBorder);
    ctx.stroke(innerNoodleBorder);

    ctx.strokeStyle = noodleColour;
    ctx.lineWidth = width;
    ctx.stroke(noodleBody);

    radius = nextRadius;
    arcCenterX = nextArcCenterX;
    arcCenterY = nextArcCenterY;
    startAngle = nextStartAngle;
    endAngle = nextEndAngle;
    ccw = !ccw;
  }
}

function getNextArcAngles(currentArcIsccw, currentArcEndAngle) {
  let maximumNextAngleFactor = 0.5;
  const nextStartAngle = (currentArcIsccw ? 1 : -1) * pi + currentArcEndAngle;
  const nextEndAngle =
    nextStartAngle +
    (currentArcIsccw ? 1 : -1) *
      Math.random() *
      maximumNextAngleFactor *
      2 *
      pi;
  return [nextStartAngle, nextEndAngle];
}

function getNextArcCoords(
  currentArcCenterX,
  currentArcCenterY,
  currentArcRadius,
  nextArcRadius,
  currentArcEndAngle,
  noodleWidth
) {
  const totalRadius = currentArcRadius + nextArcRadius - noodleWidth;
  return [
    currentArcCenterX + totalRadius * Math.cos(currentArcEndAngle),
    currentArcCenterY + totalRadius * Math.sin(currentArcEndAngle),
  ];
}

function checkNextArcInsideBowl(bowlRadius, arcRadius, arcCenterX, arcCenterY) {
  const distToOrigin = Math.sqrt(
    Math.pow(arcCenterX - canvasCenter.x, 2) +
      Math.pow(arcCenterY - canvasCenter.y, 2)
  );
  return distToOrigin + arcRadius <= bowlRadius - bowlLineWidth;
}

function getNextArcRadius(minBendRadius, maxBendRadius) {
  return minBendRadius + Math.random() * (maxBendRadius - minBendRadius);
}

function calcArcLength(radius, startAngle, endAngle) {
  startAngle = radToDeg(startAngle) % 360;
  endAngle = radToDeg(endAngle) % 360;
  diffAngle = Math.abs(endAngle - startAngle);
  return 2 * pi * radius * (diffAngle / 360);
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

  ctx.strokeStyle = bowlColour;
  ctx.lineWidth = bowlLineWidth;
  ctx.beginPath();
  ctx.arc(canvasCenter.x, canvasCenter.y, bowlRadius, 0, 360);
  ctx.stroke();

  return bowlRadius;
}

function moveToCenter() {
  ctx.moveTo(canvasCenter.x, canvasCenter.y);
}

const noodleColour = "#FCE4B1";
const noodleBorderColour = "black";
const noodleWidth = 10;
const noodleMinLength = 200;
const noodleMaxLength = 1000;
const noodleMinBendRadius = 20;
makeDrawing(noodleWidth, noodleMinLength, noodleMaxLength, noodleMinBendRadius);

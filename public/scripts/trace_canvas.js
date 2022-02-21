const canvas = document.querySelectorAll('canvas')[0]
const context = canvas.getContext('2d');
let lineWidth = 0
let points = []

function drawOnCanvas (stroke) {
  context.strokeStyle = 'blue'
  context.lineCap = 'round'
  context.lineJoin = 'round'

  const l = stroke.length - 1
  if (stroke.length >= 3) {
    const xc = (stroke[l].x + stroke[l - 1].x) / 2
    const yc = (stroke[l].y + stroke[l - 1].y) / 2
    context.lineWidth = stroke[l - 1].lineWidth
    context.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc)
    context.stroke()
    context.beginPath()
    context.moveTo(xc, yc)
  } else {
    const point = stroke[l];
    context.lineWidth = point.lineWidth
    context.strokeStyle = point.color
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.stroke()
  }
}

let background = new Image();
background.src = 'shared/1/library/b7l556/outline.png';
background.onload = () => {
  // canvas.width = background.width;
  // canvas.height = background.height;
  canvas.width = window.innerWidth * 2
  canvas.height = window.innerHeight * 2
  // make image fill canvas but keep aspect ratio
  let image_width, image_height;
  if (background.width > background.height) {
    image_width = canvas.width;
    image_height = background.height * (canvas.width / background.width);
  } else {
    image_height = canvas.height;
    image_width = background.width * (canvas.height / background.height);
  }
  context.drawImage(background, 0, 0, image_width, image_height);
  canvas.addEventListener("touchstart", e => {
    if (e.touches && e.touches[0] && e.touches[0].touchType == 'stylus') {
      e.preventDefault();
      let pressure = 0.1;
      let x, y;
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX * 2
      y = e.touches[0].pageY * 2

      lineWidth = Math.log(pressure + 1) * 40
      context.lineWidth = lineWidth// pressure * 50;

      points.push({ x, y, lineWidth })
      drawOnCanvas(points)
    }
  });

  canvas.addEventListener("touchmove", e => {
    if (e.touches && e.touches[0] && e.touches[0].touchType == 'stylus') {
      let pressure = 0.1
      let x, y
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX * 2
      y = e.touches[0].pageY * 2

      // smoothen line width
      lineWidth = (Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8)
      points.push({ x, y, lineWidth })

      drawOnCanvas(points);
    }
  });

  canvas.addEventListener("touchend", e => {
    if (e.touches && e.touches[0] && e.touches[0].touchType == 'stylus') {
      let pressure = 0.1;
      let x, y;

      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX * 2
      y = e.touches[0].pageY * 2

      requestIdleCallback(function () { points = []})

      lineWidth = 0
    }
  });
}



window.clear_canvas = () => {
}
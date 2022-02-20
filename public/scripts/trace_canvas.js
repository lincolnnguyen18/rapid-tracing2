const canvas = document.querySelectorAll('canvas')[0]
const context = canvas.getContext('2d');

const $bottom_right = document.querySelectorAll('.bottom-right')[0];

let background = new Image();
background.src = 'shared/1/library/b7l556/outline.png';
background.onload = () => {
  canvas.width = background.width;
  canvas.height = background.height;
  context.drawImage(background, 0, 0);
}

window.clear_canvas = () => {
}

canvas.addEventListener("touchstart", e => {
  console.log(e.touches);
});
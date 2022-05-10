const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const img = document.querySelector('#fire');

const move = (e) => {
  ctx.drawImage(img, e.x - img.width / 2, e.y - img.height / 2);
}

canvas.addEventListener('pointerdown', () => {
  canvas.addEventListener('pointermove', move);
});

// testt
canvas.addEventListener('pointerup', () => {
  canvas.removeEventListener('pointermove', move);
})
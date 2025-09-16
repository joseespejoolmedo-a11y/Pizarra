const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizeSlider = document.getElementById('size');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

let drawing = false;
let paths = [];
let currentPath = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  redraw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startDraw(x,y){
  drawing = true;
  currentPath = [{x,y,color:colorPicker.value,size:sizeSlider.value}];
}

function draw(x,y){
  if(!drawing) return;
  const point = {x,y,color:colorPicker.value,size:sizeSlider.value};
  currentPath.push(point);
  ctx.strokeStyle = point.color;
  ctx.lineWidth = point.size;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const prev = currentPath[currentPath.length - 2];
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function endDraw(){
  if(!drawing) return;
  drawing = false;
  paths.push(currentPath);
}

function redraw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const path of paths){
    ctx.beginPath();
    for (let i=1; i<path.length; i++){
      ctx.strokeStyle = path[i].color;
      ctx.lineWidth = path[i].size;
      ctx.lineCap = 'round';
      ctx.moveTo(path[i-1].x, path[i-1].y);
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  }
}

// Eventos ratón
canvas.addEventListener('mousedown', e => startDraw(e.offsetX, e.offsetY));
canvas.addEventListener('mousemove', e => draw(e.offsetX, e.offsetY));
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);

// Eventos táctiles
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  startDraw(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  draw(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchend', endDraw);

undoBtn.onclick = () => { paths.pop(); redraw(); };
clearBtn.onclick = () => { paths = []; redraw(); };
saveBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = 'pizarra.png';
  link.href = canvas.toDataURL();
  link.click();
};

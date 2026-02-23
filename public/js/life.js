const fps = 12;
let cells = [];
let snapshots = [];
const elementWidth = 32;
let gridX = 0;
let gridY = 0;
let container = null;
let state = [];

function populate() {
  cells = cells.slice(0, gridX * gridY - 1);

  while (cells.length < gridX * gridY) {
    cells.push(Math.round(Math.random()));
  }
}

function getCell(x, y) {
  return state[y * gridX + x];
}

function snapshot() {
  state = [...cells];

  for (let i = 0; i < state.length; i++) {
    const col = i % gridX;
    const row = Math.floor(i / gridX);

    const _x = col === 0 ? gridX - 1 : col - 1;
    const x = col;
    const x_ = col + 1 >= gridX ? 0 : col + 1;
    const _y = row === 0 ? gridY - 1 : row - 1;
    const y = row;
    const y_ = row + 1 >= gridY ? 0 : row + 1;

    const tl = getCell(_x, _y);
    const t = getCell(x, _y);
    const tr = getCell(x_, _y);
    const r = getCell(x_, y);
    const br = getCell(x_, y_);
    const b = getCell(x, y_);
    const bl = getCell(_x, y_);
    const l = getCell(_x, y);

    const neighbors = tl + t + tr + r + br + b + bl + l;

    if (neighbors < 2) {
      cells[i] = 0;
    }

    if (neighbors > 3) {
      cells[i] = 0;
    }

    if (neighbors === 3) {
      cells[i] = 1;
    }
  }

  snapshots.push([...cells]);
  snapshots = snapshots.slice(-3);
  if (snapshots.length === 3 && JSON.stringify(snapshots[0]) === JSON.stringify(snapshots[2])) {
    cells = [];
    populate();
  }
}

function render() {
  let elements = container.getElementsByTagName('span');

  while (elements.length > gridX * gridY) {
    container.removeChild(elements[elements.length - 1]);
  }

  while (elements.length < gridX * gridY) {
    container.appendChild(document.createElement('span'));
  }

  for (n = 0; n < elements.length; n++) {
    if (cells[n] === 1) {
      elements[n].className = 'active';
    } else {
      elements[n].className = '';
    }
  }
}

function tick() {
  snapshot();
  render();

  setTimeout(() => {
    requestAnimationFrame(tick);
  }, 1000 / fps);
}

function onResize() {
  gridX = Math.floor(container.offsetWidth / elementWidth);
  gridY = Math.floor(container.offsetHeight / elementWidth) - 1;

  container.style.gridTemplateColumns = `repeat(${gridX}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridY}, 1fr)`;

  populate();
}

function init() {
  container = document.getElementById('life');
  startTime = Date.now();
  onResize();
  populate();
  tick();
}

window.addEventListener('load', init);
window.addEventListener('resize', onResize);

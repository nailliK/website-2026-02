const fps = 12;
let resetSeconds = 15;
let startTime;
let currentTime;
let nodes = [];
const elementWidth = 24;
let gridX = 0;
let gridY = 0;
let container = null;
let state = [];

function populate() {
  nodes = nodes.slice(0, gridX * gridY - 1);

  while (nodes.length < gridX * gridY) {
    nodes.push(Math.round(Math.random()));
  }
}

function snapshot() {
  state = [...nodes];

  for (let i = 0; i < state.length; i++) {
    const col = i % gridX;
    const tl = col > 0 ? state[i - gridX - 1] : 0;
    const t = state[i - gridX] ?? 0;
    const tr = col < gridX - 1 ? state[i - gridX + 1] : 0;
    const r = col < gridX - 1 ? state[i + 1] : 0;
    const br = col < gridX - 1 ? state[i + gridX + 1] : 0;
    const b = state[i + gridX] ?? 0;
    const bl = col > 0 ? state[i + gridX - 1] : 0;
    const l = col > 0 ? state[i - 1] : 0;

    const neighbors = tl + t + tr + r + br + b + bl + l;

    if (neighbors < 2) {
      nodes[i] = 0;
    }

    if (neighbors > 3) {
      nodes[i] = 0;
    }

    if (neighbors === 3) {
      nodes[i] = 1;
    }
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
    if (nodes[n] === 1) {
      elements[n].className = 'active';
    } else {
      elements[n].className = '';
    }
  }
}

function tick() {
  currentTime = Date.now();

  if (currentTime >= startTime + resetSeconds * 1000) {
    startTime = Date.now();
    nodes = [];
    populate();
  }

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

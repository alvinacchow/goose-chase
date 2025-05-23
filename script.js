const goose = document.getElementById('goose');
const gooseSize = 100; 
const moveDistance = window.innerWidth * 0.03;
let isGooseMoving = false;
let isInteracting = false;
let frameIndex = 0;
const audio = document.getElementById('bg-audio');
audio.volume = 0.5; 

const gooseFrames = [
    'goose-1.png',
    'goose-2.png',
    'goose-3.png'
];

const enableAudio = () => {
    audio.play();
};

function getGooseSize() {
    return goose.offsetWidth; 
}

function centerGoose() {
    const gooseSize = getGooseSize();
    const centerX = window.innerWidth / 2 - gooseSize / 2;
    const centerY = window.innerHeight / 2 - gooseSize / 2;
    goose.style.left = `${centerX}px`;
    goose.style.top = `${centerY}px`;
}

function animateGooseStep() {
    goose.style.backgroundImage = `url('${gooseFrames[frameIndex]}')`;
    frameIndex = (frameIndex + 1) % gooseFrames.length;
}

function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
}

function handlePointerMove(x, y) {
  const gooseSize = goose.offsetWidth;
  const gooseX = goose.offsetLeft + gooseSize / 2;
  const gooseY = goose.offsetTop + gooseSize / 2;

  const dx = gooseX - x;
  const dy = gooseY - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 150) {
    isGooseMoving = true;
    const angle = Math.atan2(dy, dx);
    const newX = goose.offsetLeft + Math.cos(angle) * moveDistance;
    const newY = goose.offsetTop + Math.sin(angle) * moveDistance;

    const maxX = window.innerWidth - gooseSize;
    const maxY = window.innerHeight - gooseSize;

    goose.style.left = `${Math.min(Math.max(newX, 0), maxX)}px`;
    goose.style.top = `${Math.min(Math.max(newY, 0), maxY)}px`;
  } else {
    isGooseMoving = false;
  }
}

document.addEventListener('mousemove', (event) => {
  handlePointerMove(event.clientX, event.clientY);
});

document.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (touch) {
    handlePointerMove(touch.clientX, touch.clientY);
  }
});

setInterval(() => {
    if (isGooseMoving) {
        document.body.style.backgroundColor = getRandomColor();
    }
}, 1000); 

setInterval(() => {
    if (isGooseMoving) {
        animateGooseStep();
    }
}, 50); 

document.addEventListener('click', enableAudio);
document.addEventListener('mousemove', enableAudio);
window.addEventListener('DOMContentLoaded', centerGoose);
window.addEventListener('resize', () => {
    centerGoose();
});
window.addEventListener('mouseout', (event) => {
  if (!event.relatedTarget || event.relatedTarget.nodeName === "HTML") {
    isGooseMoving = false;
  }
});
document.addEventListener('touchend', () => {
  isGooseMoving = false;
});
document.addEventListener('touchcancel', () => {
  isGooseMoving = false;
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.pause();
  } else {
    audio.play();
  }
});
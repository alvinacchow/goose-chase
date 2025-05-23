const goose = document.getElementById('goose');
const gooseSize = 100; 
const moveDistance = window.innerWidth * 0.03;
let isGooseMoving = false;
let isInteracting = false;
let frameIndex = 0;
const audio = document.getElementById('bg-audio');
audio.volume = 0.5;
let lastWrapTime = 0;
const wrapCooldown = 200;  
let postWrapCooldown = false;
const postWrapDuration = 300; 

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


function resetGooseToOtherSide(side) {

  const gooseWidth = goose.offsetWidth;
  const gooseHeight = goose.offsetHeight;

  switch (side) {
    case 0:
      goose.style.left = `-50px`;
      goose.style.top = `${goose.offsetTop}px`;
      break;
    case 1:
      goose.style.left = `${window.innerWidth + 50}px`;
      goose.style.top = `${goose.offsetTop}px`;
      break;
    case 2:
      goose.style.left = `${goose.offsetLeft}px`;
      goose.style.top = `-50px`;
      break;
    case 3:
      goose.style.left = `${goose.offsetLeft}px`;
      goose.style.top = `${window.innerHeight + 50}px`;
      break;
  }
}



function isGooseOffScreen() {
  const rect = goose.getBoundingClientRect();
  const completelyLeft = rect.right < 0;
  const completelyRight = rect.left > window.innerWidth;
  const completelyAbove = rect.bottom < 0;
  const completelyBelow = rect.top > window.innerHeight;
  if (completelyRight) {
    return 0;
  }
  else if (completelyLeft) {
    return 1;
  }
  else if (completelyBelow) {
    return 2;
  }
  else if (completelyAbove) {
    return 3;
  }
  return -1;
}


function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function handlePointerMove(x, y) {
  if (postWrapCooldown) return;

  const gooseSize = goose.offsetWidth;
  const gooseX = goose.offsetLeft + gooseSize / 2;
  const gooseY = goose.offsetTop + gooseSize / 2;

  const dx = gooseX - x;
  const dy = gooseY - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 150) {
    isGooseMoving = true;
    const angle = Math.atan2(dy, dx);
    let newX = goose.offsetLeft + Math.cos(angle) * moveDistance;
    let newY = goose.offsetTop + Math.sin(angle) * moveDistance;

    goose.style.left = `${newX}px`;
    goose.style.top = `${newY}px`;
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

setInterval(() => {
  const now = Date.now();
  if (now - lastWrapTime < wrapCooldown) return;

  let indicator = isGooseOffScreen();
  if (indicator > -1) {
    lastWrapTime = now; // Update the wrap time
    resetGooseToOtherSide(indicator);
  }
}, 100);

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
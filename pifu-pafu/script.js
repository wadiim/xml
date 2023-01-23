const svg = document.getElementsByTagName('svg')[0];
const player = document.getElementById('player');
const pistol = player.getElementsByTagName('rect')[0];
const body = player.getElementsByTagName('circle')[0];
const play = document.getElementById('play');
const gameOver = document.getElementById('gameOver');
const scoreElement = document.getElementById('score');
const scoreElementValue = scoreElement.getElementsByTagName('tspan')[0];
const back = document.getElementById('back');

var timeoutId;
var mousePosition;
var input;
var bullets;
var zombies;
var isGameRunning;
var spawnInterval;
var score;

function showMenu() {
  play.setAttribute('display', 'inline');
  play.onclick = startGame;
}

function startGame() {
  loadPlayer();

  mousePosition = {
    x : window.innerWidth / 2,
    y : 0
  };
  input = {
    keyW : false,
    keyA : false,
    keyS : false,
    keyD : false
  };
  bullets = [];
  zombies = [];
  isGameRunning = true;
  spawnInterval = 4000;
  score = 0;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  createZombie();

  play.setAttribute('display', 'none');
  scoreElement.setAttribute('display', 'inline');
  window.requestAnimationFrame(update);
}

function stopGame() {
  isGameRunning = false;
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  clearTimeout(timeoutId);
  gameOver.setAttribute('display', 'inline');

  const circle = back.getElementsByTagName('circle')[0];
  const path = back.getElementsByTagName('path')[0];
  circle.setAttribute('cx', Number(circle.getAttribute('r')) + 8);
  circle.setAttribute('cy', window.innerHeight - circle.getAttribute('r') - 8);
  path.setAttribute('transform', 'translate(' + 8 + ','
  + (Number(window.innerHeight) - 57) + ')');
  back.onclick = resetGame;
  back.setAttribute('display', 'inline');
}

function resetGame() {
  back.setAttribute('display', 'none');
  scoreElement.setAttribute('display', 'none');
  gameOver.setAttribute('display', 'none');
  player.setAttribute('display', 'none');

  // Clean up.
  while (bullets.length > 0) {
    svg.removeChild(bullets.pop().element);
  }
  while (zombies.length > 0) {
    svg.removeChild(zombies.pop());
  }

  showMenu();
}

function setPlayerPosition(x, y) {
  pistol.setAttribute('x', x - (pistol.getAttribute('width') / 2));
  pistol.setAttribute('y', y - pistol.getAttribute('height'));
  body.setAttribute('cx', x);
  body.setAttribute('cy', y);
}

function getPlayerXPosition() {
  return body.getAttribute('cx');
}

function getPlayerYPosition() {
  return body.getAttribute('cy');
}

function loadPlayer() {
  setPlayerPosition(window.innerWidth / 2, window.innerHeight / 2);
  player.setAttribute('display', 'inline');
}

function movePlayer(dx, dy) {
  let newX = Number(getPlayerXPosition()) + dx;
  let newY = Number(getPlayerYPosition()) + dy;

  if (newX < 0 + body.getAttribute('r')
  || newX > window.innerWidth - body.getAttribute('r')
  || newY < 0 + body.getAttribute('r')
  || newY > window.innerHeight - body.getAttribute('r')) {
    return;
  } else {
    setPlayerPosition(newX, newY);
  }
}

function getFireAngle(x, y) {
  let cx = getPlayerXPosition();
  let cy = getPlayerYPosition();
  return Math.atan2(y - cy, x - cx) * 180 / Math.PI + 90;
}

function aim(x, y) {
  pistol.setAttribute('transform',
  'rotate(' + getFireAngle(x, y) + ','
  + getPlayerXPosition() + ','
  + getPlayerYPosition() + ')');
}

function handleKeyDown(event) {
  switch (event.keyCode) {
    case 87:
    input.keyW = true;
    break;
    case 65:
    input.keyA = true;
    break;
    case 83:
    input.keyS = true;
    break;
    case 68:
    input.keyD = true;
    break;
  }
}

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 87:
    input.keyW = false;
    break;
    case 65:
    input.keyA = false;
    break;
    case 83:
    input.keyS = false;
    break;
    case 68:
    input.keyD = false;
    break;
  }
}

function handleMouseMove(event) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
}

function createBulletElement(x, y) {
  let bullet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bullet.setAttribute('cx', getPlayerXPosition());
  bullet.setAttribute('cy', getPlayerYPosition());
  bullet.setAttribute('r', 4);
  bullet.setAttribute('fill', '#af9b60');
  bullet.setAttribute('display', 'none');
  svg.appendChild(bullet);
  return bullet;
}

function handleMouseDown(event) {
  let x = getPlayerXPosition();
  let y = getPlayerYPosition();
  let b = {
    element : createBulletElement(x, y),
    angle : Math.atan2(event.clientY - y, event.clientX - x)
  };

  updateBullet(b);
  b.element.setAttribute('display', 'inline');
  bullets.push(b);
}

function updateBullet(bullet) {
  let speed = 18;
  let x = bullet.element.getAttribute('cx');
  let y = bullet.element.getAttribute('cy');

  bullet.element.setAttribute('cx', Number(x) + speed * Math.cos(bullet.angle));
  bullet.element.setAttribute('cy', Number(y) + speed * Math.sin(bullet.angle));
}

function createZombie() {
  let zombie = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

  let x, y;
  let rand = Math.random();
  if (rand < 0.25) {
    x = Math.random() * (-200);
    y = Math.random() * (window.innerHeight + 400) - 200;
  } else if (rand < 0.5) {
    x = Math.random() * 200 + window.innerWidth;
    y = Math.random() * (window.innerHeight + 400) - 200;
  } else if (rand < 0.75) {
    x = Math.random() * (window.innerWidth + 400) - 200;
    y = Math.random() * (-200);
  } else {
    x = Math.random() * (window.innerWidth + 400) - 200;
    y = Math.random() * 200 + window.innerHeight;
  }

  zombie.setAttribute('cx', x);
  zombie.setAttribute('cy', y);
  zombie.setAttribute('r', 16);
  zombie.setAttribute('fill', '#688655');
  svg.appendChild(zombie);
  zombies.push(zombie);

  timeoutId = setTimeout(function() {
    if (spawnInterval > 400) {
      spawnInterval *= 0.9;
    }
    createZombie();
  }, spawnInterval);
}

function updateZombie(zombie) {
  let speed = 2;
  let x = zombie.getAttribute('cx');
  let y = zombie.getAttribute('cy');
  let angle = Math.atan2(getPlayerYPosition() - y, getPlayerXPosition() - x);

  zombie.setAttribute('cx', Number(x) + speed * Math.cos(angle));
  zombie.setAttribute('cy', Number(y) + speed * Math.sin(angle));
}

function update() {
  let dx = 0;
  let dy = 0;
  let step = 4;

  if (input.keyW == true) {
    dy -= step;
  }
  if (input.keyA == true) {
    dx -= step;
  }
  if (input.keyS == true) {
    dy += step;
  }
  if (input.keyD == true) {
    dx += step;
  }

  // handle diagonal movement.
  if (dx != 0 && dy != 0) {
    dx = dx * Math.sqrt(2) / 2;
    dy = dy * Math.sqrt(2) / 2;
  }

  for (let b of bullets) {
    updateBullet(b);
  }

  // Remove the bullet that is off the screen, if any.
  if (bullets.length > 0) {
    let lastBullet = bullets[bullets.length - 1];
    let bx = lastBullet.element.getAttribute('cx');
    let by = lastBullet.element.getAttribute('cy');
    let br = lastBullet.element.getAttribute('r');
    if (bx < 0 - br || bx > window.innerWidth + Number(br)
    || by < 0 - br || by > window.innerHeight + Number(br)) {
      svg.removeChild(bullets.pop().element);
    }
  }

  for (let z of zombies) {
    updateZombie(z);
  }

  let px = getPlayerXPosition();
  let py = getPlayerYPosition();
  let pr = body.getAttribute('r');

  // Handle collisions.
  for (let zi = 0; zi < zombies.length; ++zi) {
    let zx = zombies[zi].getAttribute('cx');
    let zy = zombies[zi].getAttribute('cy');
    let zr = zombies[zi].getAttribute('r');

    if (Math.sqrt(Math.pow(zx - px, 2) + Math.pow(zy - py, 2))
    <= Number(zr) + Number(pr)) {
      stopGame();
    }

    for (let bi = 0; bi < bullets.length; ++bi) {
      let bx = bullets[bi].element.getAttribute('cx');
      let by = bullets[bi].element.getAttribute('cy');
      let br = bullets[bi].element.getAttribute('r');
      if (Math.sqrt(Math.pow(zx - bx, 2) + Math.pow(zy - by, 2))
      <= Number(zr) + Number(br)) {
        svg.removeChild(bullets[bi].element);
        svg.removeChild(zombies[zi]);
        bullets.splice(bi, 1);
        zombies.splice(zi, 1);
        score += 10;
        break;
      }
    }
  }

  scoreElementValue.innerHTML = score;

  movePlayer(dx, dy);
  aim(mousePosition.x, mousePosition.y);

  if (isGameRunning) {
    window.requestAnimationFrame(update);
  }
}

window.addEventListener('load', showMenu);

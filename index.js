const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scalingFactor = 3.5;
let depth_perspective = innerWidth / scalingFactor;
let height_perspective = innerHeight / scalingFactor;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.targetX = x;
    this.targetY = y;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  setPosition(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  updatePosition() {
    const speed = 6; // Change this value to adjust the speed
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > speed) {
      this.x += (dx / distance) * speed;
      this.y += (dy / distance) * speed;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }

    this.boundPosition();
  }

  boundPosition() {
    // Bounding trapezoid coordinates
    const topLeft = { x: depth_perspective, y: innerHeight - height_perspective };
    const bottomLeft = { x: 0, y: innerHeight };
    const topRight = { x: innerWidth - depth_perspective, y: innerHeight - height_perspective };
    const bottomRight = { x: innerWidth, y: innerHeight };

    // Calculate line equations for the trapezoid edges
    const leftSlope = (bottomLeft.y - topLeft.y) / (bottomLeft.x - topLeft.x);
    const rightSlope = (bottomRight.y - topRight.y) / (bottomRight.x - topRight.x);

    // Calculate y-values at player's x position for left and right bounds
    const leftBoundY = leftSlope * (this.x - bottomLeft.x) + bottomLeft.y;
    const rightBoundY = rightSlope * (this.x - bottomRight.x) + bottomRight.y;

    // Check bounds and adjust player's position if necessary
    if (this.y < leftBoundY) this.y = leftBoundY;
    if (this.y < rightBoundY) this.y = rightBoundY;
    if (this.y < topLeft.y) this.y = topLeft.y;
  }
}

class blankRoom {
  constructor() {}

  draw() {
    // below draws a blank room
    c.beginPath();

    //top outer left
    c.moveTo(0, 0);

    // draws line to upper inner left corner
    c.lineTo(depth_perspective, height_perspective);

    // moves to upper inner left corner
    c.moveTo(depth_perspective, height_perspective);

    // draws line to bottom inner left corner
    c.lineTo(depth_perspective, innerHeight - height_perspective);

    // draws line to bottom outer left corner
    c.lineTo(0, innerHeight);

    // moves to bottom inner left corner
    c.moveTo(depth_perspective, innerHeight - height_perspective);

    // draw line to bottom inner right corner
    c.lineTo(innerWidth - depth_perspective, innerHeight - height_perspective);

    // draw line to bottom outer right corner
    c.lineTo(innerWidth, innerHeight);

    // move to bottom inner right corner
    c.moveTo(innerWidth - depth_perspective, innerHeight - height_perspective);

    // draw line to upper inner right corner
    c.lineTo(innerWidth - depth_perspective, height_perspective);

    // draw line to upper outer right corner
    c.lineTo(innerWidth, 0);

    // move to upper inner right corner
    c.moveTo(innerWidth - depth_perspective, height_perspective);

    // draw line to upper inner left corner
    c.lineTo(depth_perspective, height_perspective);

    c.stroke();
  }
}

const room = new blankRoom();
const player = new Player(500, 900, 15, "red");

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log("x: " + x + " y: " + y);

  player.setPosition(x, y);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  room.draw();
  player.updatePosition();
  player.draw();
}

canvas.addEventListener("mousedown", function (e) {
  getCursorPosition(canvas, e);
});

animate();

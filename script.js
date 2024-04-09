/** @type {HTMLCanvasElement} */

const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
ctx.font = "25px Impact";

class Alien {
    constructor(game) {
        this.game = game;
        this.image = largeImg;
        this.spriteWidth = 360;
        this.spriteHeight = 360;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.count = 0;
        this.maxCount = 200;
        this.maxFrame = 38;
        this.frameY = 0;
        this.frameX = 0;
    }
    draw(ctx) {
        this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        ctx.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    update() {}
}

class Idle extends Alien {
    start() {
        this.text = "IDLE! Press 2 to CHARGE or 3 to SWARM";
        this.frameY = 0;
    }
    update() {
        if (this.game.keys.has("2")) {
            this.game.setAlienStates(1);
        } else if (this.game.keys.has("3")) {
            this.game.setAlienStates(2);
        }
    }
}
class Charge extends Alien {
    start() {
        this.text = `CHARGING! Wait ${this.maxCount} to IDLE or Press 3 to SWARM`;
        this.count = 0;
        this.frameY = 1;
    }
    update() {
        if (this.game.keys.has("3")) {
            this.game.setAlienStates(2);
        }
        this.count++;
        console.log(this.count);
        if (this.count > this.maxCount) {
            this.game.setAlienStates(0);
        }
    }
    draw(ctx) {
        super.draw(ctx);
        ctx.fillText(this.count, 15, 30);
    }
}
class Swarm extends Alien {
    start() {
        this.text = "SWARMING! Press 1 to IDLE or Press 2 to CHARGE";
        this.frameY = 2;
    }
    update() {
        if (this.game.keys.has("1")) {
            this.game.setAlienStates(0);
        } else if (this.game.keys.has("2")) {
            this.game.setAlienStates(1);
        }
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.infoEl = info;
        this.keys = new Set();
        this.alienStates = [new Idle(this), new Charge(this), new Swarm(this)];
        this.alien;
        this.setAlienStates(0);

        window.addEventListener("keydown", (e) => {
            this.keys.add(e.key);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.clear();
        });
    }
    render(ctx) {
        this.alien.update();
        this.alien.draw(ctx);
    }
    setAlienStates(state) {
        this.alien = this.alienStates[state];
        this.alien.start();
        this.infoEl.textContent = this.alien.text;
    }
}

const game = new Game(canvas);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
}
animate();

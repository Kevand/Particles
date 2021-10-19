let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

export default class Particles {
  constructor(
    x,
    y,
    shape,
    count,
    size,
    speed,
    angle,
    spread,
    disapearing,
    color,
    continous
  ) {
    this.disapearing = disapearing;
    this.count = count;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
    this.spread = spread;
    this.color = color;
    this.shape = shape;
    this.continous = continous;

    this.init();
  }

  init() {
    this.particles = [];
    if (!this.continous) {
      for (let i = 0; i < this.count; i++) {
        this.particles[i] = new Particle(
          this.getPosition().x,
          this.getPosition().y,
          this.size,
          this.speed,
          this.angle,
          this.spread,
          this.disapearing,
          this.color,
          this.shape
        );
      }
    }
  }

  getPosition() {
    let x, y;
    if (Array.isArray(this.x)) x = this.x[0] + Math.random() * this.x[1];
    else x = this.x;
    if (Array.isArray(this.y)) y = this.y[0] + Math.random() * this.y[1];
    else y = this.y;

    return { x: x, y: y };
  }

  //every tick draw
  draw() {
    this.particles.forEach((p) => {
      p.draw();
    });
  }

  //every tick update
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if (this.particles[i].size <= 0 || this.particles[i].alpha == 0) {
        this.particles.splice(i, 1);
      }
    }
    if (this.continous && this.particles.length < this.count) {
      this.particles.push(
        new Particle(
          this.getPosition().x,
          this.getPosition().y,
          this.size,
          this.speed,
          this.angle,
          this.spread,
          this.disapearing,
          this.color,
          this.shape
        )
      );
    }
  }
}

//particle class
class Particle {
  constructor(x, y, size, speed, angle, spread, disapearing, color, shape) {
    //initializing everything
    this.disapearing = disapearing;
    this.x = x;
    this.y = y;
    this.size = size - 1 + Math.random() * 2;
    this.initSize = this.size;
    this.defaultSpeed = speed - 3 + Math.random() * 6;
    this.speed = this.defaultSpeed;
    this.spread = spread > 360 ? 360 : spread;
    this.angle = angle - this.spread / 2 + Math.random() * this.spread;
    this.alpha = 1;
    this.shape = shape;
    this.alphaSpeed = Math.random() / 10;
    if (Array.isArray(color)) {
      this.color = hex2rgba(
        color[Math.round(Math.random() * (color.length - 1))]
      );
    } else if (color == "colorful") {
      this.color = randomRGB();
    } else {
      this.color = hex2rgba(color);
    }
    this.rotation = 0;
  }

  draw() {
    //setting styles for particles
    ctx.fillStyle =
      "rgba(" +
      this.color.r +
      "," +
      this.color.g +
      "," +
      this.color.b +
      "," +
      this.alpha +
      ")";
    ctx.strokeStyle =
      "rgba(" +
      this.color.r +
      "," +
      this.color.g +
      "," +
      this.color.b +
      "," +
      this.alpha +
      ")";

    if (this.shape == "circle") {
      //drawing circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    } //drawing cube
    else if (this.shape == "cube") {
      ctx.save();
      let c = this.getParticlesCenter();
      ctx.translate(c.x, c.y);
      ctx.rotate((Math.PI / 180) * this.rotation);
      let r = this.getRotatedParticle();
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    }
  }

  //get partcile center x and y
  getParticlesCenter() {
    return {
      x: this.x + this.size / 2,
      y: this.y + this.size / 2,
    };
  }

  //getting rotated particle
  getRotatedParticle() {
    return {
      x: this.size / -2,
      y: this.size / -2,
      w: this.size,
      h: this.size,
    };
  }

  //update function
  update() {
    //move at specific angle
    this.x += this.speed * Math.cos((this.angle * Math.PI) / 180);
    this.y += this.speed * Math.sin((this.angle * Math.PI) / 180);
    //decreasing size over time
    this.size -= 0.1;
    //speed from audio signal
    this.speed = this.defaultSpeed;
    //decreasing speed over time
    this.speed *= 0.99;
    //rotating over time
    this.rotation += 2;

    //checking if disapering is true then slowly dispear (equaly to size of praticle)
    if (this.disapearing) this.alpha = this.size / this.initSize;
  }
}

//converting hex color to rgb
function hex2rgba(hex) {
  let h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

//return random rgb color
function randomRGB() {
  return {
    r: Math.round(Math.random() * 255),
    g: Math.round(Math.random() * 255),
    b: Math.round(Math.random() * 255),
  };
}



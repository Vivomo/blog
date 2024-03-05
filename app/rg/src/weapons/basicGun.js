import * as PIXI from 'pixi.js';
import {isOutOfBoundaries} from "../utils/coordinate.js";

export default class BasicGun {
  constructor (hero) {
    this.hero = hero;
    this.app = hero.app;
    this.level = 1;
    this.bullets = [];
    this.speed = 2;
    this.shoot();
    setInterval(() => {
      this.shoot();
    }, 1000)
    this.app.ticker.add(() => {
      this.update();
    });
  }

  fire () {

  }

  shoot() {
    const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    const app = this.app;
    angles.forEach((angle) => {
      for (let i = 0; i < 3; i++) {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0xffffff);
        bullet.drawRect(0, 0, 10, 5);
        bullet.endFill();
        bullet.x = this.hero.x;
        bullet.y = this.hero.y;
        bullet.rotation = angle;
        this.bullets.push(bullet);
        app.stage.addChild(bullet);
      }
    });
  }

  update() {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.x += Math.cos(bullet.rotation) * this.speed;
      bullet.y += Math.sin(bullet.rotation) * this.speed;

      if (isOutOfBoundaries(bullet, this.app)) {
        this.app.stage.removeChild(bullet);
        return false;
      }
      return true;
    });

  }
}
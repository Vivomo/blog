import * as PIXI from 'pixi.js';
import {isOutOfBoundaries} from "../utils/coordinate.js";
import Bullet from "../components/bullet.js";

export default class BasicGun {
  constructor (hero) {
    this.hero = hero;
    this.app = hero.app;
    this.level = 1;
    this.bullets = [];
    this.speed = 5;
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
    // const angles = [0];
    const app = this.app;
    angles.forEach((angle) => {
      // for (let i = 0; i < 3; i++) {
        const bullet = new Bullet({
          x: this.hero.x,
          y: this.hero.y,
          rotation: angle
        });

        this.bullets.push(bullet);
        app.stage.addChild(bullet.graph);
      // }
    });
  }

  update() {
    this.bullets = this.bullets.filter((bullet) => {
      if (bullet.destroyed) {
        return false;
      }
      bullet.x += Math.cos(bullet.rotation) * this.speed;
      bullet.y += Math.sin(bullet.rotation) * this.speed;

      if (isOutOfBoundaries(bullet, this.app)) {
        this.app.stage.removeChild(bullet.graph);
        bullet.destroy();
        return false;
      }
      return true;
    });

  }
}
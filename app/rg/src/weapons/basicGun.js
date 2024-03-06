import * as PIXI from 'pixi.js';
import {isOutOfBoundaries} from "../utils/coordinate.js";
import Bullet from "../components/bullet.js";
import BaseWeapon from "./baseWeapon.js";

export default class BasicGun extends BaseWeapon {
  constructor (hero) {
    super(hero);
    this.bullets = [];
    this.speed = 5;
    this.attack();

  }


  attack() {
    const angles = [Math.PI / 4, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
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
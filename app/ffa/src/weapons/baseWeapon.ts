import Hero from "../components/hero";
import Bullet from "../components/bullet";
import {isOutOfBoundaries} from "../utils/coordinate";

export default class BaseWeapon {

  hero: Hero;
  app: PixiMixins.Application;
  bullets: Bullet[];

  cd = 1000;
  lv = 1;
  maxLv = 8;
  damage = 10;
  speed = 10;
  name = '';

  constructor(hero) {
    this.hero = hero;
    this.app = hero.app;
    this.bullets = [];

    setTimeout(() => {
      this.start();
    }, 500)

    this.app.ticker.add(() => {
      this.update();
    });
  }

  start() {
    setInterval(() => {
      this.attack();
    }, this.cd);
  }

  attack() {

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
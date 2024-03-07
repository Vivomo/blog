import Hero from "../components/hero";
import Bullet from "../components/bullet";
import {isOutOfBoundaries} from "../utils/coordinate";
import {Assets} from "pixi.js";
import {WeaponAssetsBathPath} from "../contants";

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
  penetration = 0;
  bounces = 0;

  constructor(hero) {
    this.hero = hero;
    this.app = hero.app;
    this.bullets = [];

    setTimeout(async () => {
      await this.loader();
      this.start();
    }, 500)

    this.app.ticker.add(() => {
      this.update();
    });
  }

  async loader() {
    if (this.textureName) {
      this.texture = await Assets.load(`${WeaponAssetsBathPath}${this.textureName}.png`)
    }
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
      bullet.x += Math.cos(bullet.direction) * this.speed;
      bullet.y += Math.sin(bullet.direction) * this.speed;

      if (isOutOfBoundaries(bullet, this.app)) {
        this.app.stage.removeChild(bullet.graph);
        bullet.destroy();
        return false;
      }
      return true;
    });
  }
}
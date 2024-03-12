import BaseWeapon from "./baseWeapon";
import Bullet from "../components/bullet";
import {isOutOfBoundaries} from "../utils/coordinate";
import Hero from "../components/hero.ts";

export default class Dart extends BaseWeapon {
  constructor(hero: Hero) {
    super(hero);
    this.bounces = 3;
    this.speed = 4;
    this.radius = 10;
    this.textureName = 'dart';
  }

  attack() {
    const bullet = new Bullet({
      x: this.hero.x,
      y: this.hero.y,
      direction: this.hero.direction,
      radius: this.radius,
      bounces: this.bounces,
      texture: this.texture
    });

    this.bullets.push(bullet);
    this.app.stage.addChild(bullet.graph);

  }
  update() {
    this.bullets = this.bullets.filter((bullet) => {
      if (bullet.destroyed) {
        return false;
      }
      bullet.x += Math.cos(bullet.direction) * this.speed;
      bullet.y += Math.sin(bullet.direction) * this.speed;

      bullet.rotation += 0.2;

      if (isOutOfBoundaries(bullet, this.app)) {
        this.app.stage.removeChild(bullet.graph);
        bullet.destroy();
        return false;
      }
      return true;
    });
  }
}
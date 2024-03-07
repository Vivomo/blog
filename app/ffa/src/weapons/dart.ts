import BaseWeapon from "./baseWeapon";
import Bullet from "../components/bullet";

export default class Dart extends BaseWeapon {
  constructor(hero) {
    super(hero);
    this.bounces = 3;
    this.speed = 4;
  }

  attack() {
    const angle = Math.PI * 2 * Math.random();
    const bullet = new Bullet({
      x: this.hero.x,
      y: this.hero.y,
      rotation: angle,
      fill: 0x112448,
      radius: 6,
      type: 'circle',
      bounces: this.bounces,
    });

    this.bullets.push(bullet);
    this.app.stage.addChild(bullet.graph);

  }
}
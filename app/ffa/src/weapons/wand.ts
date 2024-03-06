import BaseWeapon from "./baseWeapon.ts";
import {calculateAngle, getNearestItem} from "../utils/coordinate";
import Bullet from "../components/bullet";

export default class Wand extends BaseWeapon {
  constructor(hero) {
    super(hero);
    this.speed = 4;
  }

  attack() {
    if (this.hero.enemies.length === 0) {
      return;
    }
    const item = getNearestItem(this.hero, this.hero.enemies);
    const angle = calculateAngle(this.hero, item);
    const bullet = new Bullet({
      x: this.hero.x,
      y: this.hero.y,
      rotation: angle,
      fill: 0x000088
    });

    this.bullets.push(bullet);
    this.app.stage.addChild(bullet.graph);
  }
}
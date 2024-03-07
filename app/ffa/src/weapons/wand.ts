import BaseWeapon from "./baseWeapon.ts";
import {calculateAngle, getNearestItem} from "../utils/coordinate";
import Bullet from "../components/bullet";

export default class Wand extends BaseWeapon {
  constructor(hero) {
    super(hero);
    this.speed = 4;
    this.textureName = 'ice-spike';
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
      width: 24,
      height: 16,
      rotation: angle,
      direction: angle,
      texture: this.texture
    });

    this.bullets.push(bullet);
    this.app.stage.addChild(bullet.graph);
  }
}
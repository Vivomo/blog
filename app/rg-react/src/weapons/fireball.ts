import BaseWeapon from "./baseWeapon";
import {calculateAngle, getNearestItem} from "../utils/coordinate";
import Bullet from "../components/bullet";

export default class Fireball extends BaseWeapon {


  constructor(hero) {
    super(hero);
    this.speed = 3;
    this.cd = 4000;
    this.radius = 20;
    this.textureName = 'fireball'
  }

  attack() {

    const angle = Math.PI * 2 * Math.random();
    for (let i = 0; i < 3; i++) {
      const bullet = new Bullet({
        x: this.hero.x,
        y: this.hero.y,
        direction: angle + Math.PI / 10 * i,
        rotation: angle + Math.PI / 10 * i,
        width: 26,
        height: 18,
        radius: this.radius,
        texture: this.texture
      });

      this.bullets.push(bullet);
      this.app.stage.addChild(bullet.graph);
    }

  }
}
import BaseWeapon from "./baseWeapon";
import {calculateAngle, getNearestItem} from "../utils/coordinate";
import Bullet from "../components/bullet";

export default class Fireball extends BaseWeapon {


  constructor(hero) {
    super(hero);
    this.speed = 3;
    this.cd = 4000;
  }

  attack() {

    const angle = Math.PI * 2 * Math.random();
    for (let i = 0; i < 3; i++) {
      const bullet = new Bullet({
        x: this.hero.x,
        y: this.hero.y,
        rotation: angle + Math.PI / 10 * i,
        fill: 0xee5c23,
        radius: 10,
        type: 'circle'
      });

      this.bullets.push(bullet);
      this.app.stage.addChild(bullet.graph);
    }

  }
}
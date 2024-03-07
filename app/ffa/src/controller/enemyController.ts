import { getDistance, getMovePointer } from '../utils/coordinate.js';
import { SafeDistance } from '../contants';
import Hero from "../components/hero";
import {EnemyType} from "../type";

export default class EnemyController {

  app: PixiMixins.Application;
  hero: Hero;
  enemies: EnemyType[];
  categories: EnemyType[];

  constructor(hero: Hero) {
    this.app = hero.app;
    this.hero = hero;
    this.enemies = [];
    this.categories = [];

    setInterval(() => {
      this.create();
    }, 500);

    this.app.ticker.add(() => {
      this.update();
    })
  }

  add(category) {
    this.categories.push(category);
  }

  create() {
    this.categories.forEach((enemy) => {
      let x, y, distance;
      do {
        x = ~~(this.app.renderer.width * Math.random());
        y = ~~(this.app.renderer.height * Math.random());
        distance = getDistance({ x, y }, this.hero);
      } while (distance < SafeDistance);

      const item = new enemy();
      item.x = x;
      item.y = y;
      this.enemies.push(item);
      this.app.stage.addChild(item.graph);
    });
  }

  update() {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.destroyed) {
        return false;
      }
      const pointer = getMovePointer(enemy, this.hero, enemy.speed);
      enemy.x = pointer.x;
      enemy.y = pointer.y;
      return true;
    });
  }
}



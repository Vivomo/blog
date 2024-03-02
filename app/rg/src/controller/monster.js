import { getDistance, getMovePointer } from '../utils/coordinate.js';
import { SafeDistance } from '../contants/index.js';

const MonsterController = {
  init(app, hero) {
    this.app = app;
    this.hero = hero;
    this.monsters = [];
    this.categories = [];

    setInterval(() => {
      this.create();
    }, 3000);

    setInterval(() => {
      this.update();
    }, 500)
  },

  add(category) {
    this.categories.push(category);
  },

  create() {
    this.categories.forEach((Monster) => {
      let x, y, distance;
      do {
        x = ~~(this.app.renderer.width * Math.random());
        y = ~~(this.app.renderer.height * Math.random());
        distance = getDistance({ x, y }, this.hero);
      } while (distance < SafeDistance);

      const item = new Monster();
      item.x = x;
      item.y = y;
      this.monsters.push(item);
      this.app.stage.addChild(item.graph);
    });
  },

  update() {
    this.monsters.forEach((monster) => {
      const pointer = getMovePointer(monster, this.hero, monster.speed);
      monster.x = pointer.x;
      monster.y = pointer.y;
    });
  }
}

export default MonsterController;
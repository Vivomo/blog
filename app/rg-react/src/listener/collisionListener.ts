import {calculateReflectedAngle, checkCollision, createGrid} from "../utils/coordinate.js";

const CollisionListener = {
  init(enemyController, hero) {

    hero.app.ticker.add(() => {
      const enemyGrid = createGrid(enemyController.enemies, hero.app.renderer);
      const bulletGrid = createGrid(hero.bullets, hero.app.renderer);
      enemyGrid.forEach((mGrid, index) => {
        mGrid.forEach((enemy) => {
          bulletGrid[index].forEach((bullet) => {
            if (enemy.destroyed || bullet.destroyed) {
              return;
            }
            const result = checkCollision(enemy, bullet);
            if (result) {
              if (bullet.bounces > 0) {
                bullet.bounces--;
                bullet.direction = calculateReflectedAngle(enemy, bullet, bullet.direction)
              } else {
                bullet.graph.destroy();
              }
              enemy.graph.destroy();

            }
          })
        })
      })
    })

  },

  start() {

  }
};

export default CollisionListener
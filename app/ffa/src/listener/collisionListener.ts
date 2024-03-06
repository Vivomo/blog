import {checkCollision, createGrid} from "../utils/coordinate.js";

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
              // hero.app.stage.removeChild(enemy.graph, bullet.graph)
              enemy.graph.destroy();
              bullet.graph.destroy();
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
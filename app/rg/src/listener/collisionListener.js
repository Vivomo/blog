import {checkCollision, createGrid} from "../utils/coordinate.js";

const CollisionListener = {
  init(monsterController, hero) {

    hero.app.ticker.add(() => {
      const monsterGrid = createGrid(monsterController.monsters, hero.app.renderer);
      const bulletGrid = createGrid(hero.bullets, hero.app.renderer);
      monsterGrid.forEach((mGrid, index) => {
        mGrid.forEach((monster) => {
          bulletGrid[index].forEach((bullet) => {
            if (monster.destroyed || bullet.destroyed) {
              return;
            }
            const result = checkCollision(monster, bullet);
            if (result) {
              // hero.app.stage.removeChild(monster.graph, bullet.graph)
              monster.graph.destroy();
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
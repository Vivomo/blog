import { Graphics } from "pixi.js";
import Hero from "../components/hero";
import {calculateAngle} from "../utils/coordinate";

export default class HeroController {

  hero: Hero;

  constructor(hero: Hero) {
    this.hero = hero;
    this.initUI();
    this.initEvent();
  }

  initUI() {
    const hero = this.hero;
    const app = hero.app;
    const graph = new Graphics();
    const controllerPosition = {
      x: app.renderer.width - 150,
      y: app.renderer.height - 150
    }
    graph.circle(controllerPosition.x, controllerPosition.y, 50)
      .fill(0xffffff, 0.2);

    graph.interactive = true;

    const graph2 = new Graphics();
    graph2.circle(controllerPosition.x, controllerPosition.y, 150)
      .fill(0xffffff, 0.2);

    graph2.interactive = true;
    graph2.on('pointermove', (e) => {
      hero.direction = calculateAngle(controllerPosition, e)
    })

    graph2.on('pointerenter', () => {
      hero.moving = true;
    });
    graph2.on('pointerleave', () => {
      hero.moving = false;
    });

    app.stage.addChild(graph2);
    app.stage.addChild(graph);
  }

  initEvent() {
    const hero = this.hero;
    const updatePosition = () => {
      if (!hero.moving) {
        return;
      }
      hero.x += Math.cos(hero.direction) * hero.speed;
      hero.y += Math.sin(hero.direction) * hero.speed;
    };

    hero.app.ticker.add(updatePosition)

  }
}

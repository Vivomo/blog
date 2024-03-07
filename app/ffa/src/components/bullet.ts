import {
  Graphics, Sprite, Texture, Assets, Container
} from "pixi.js";
import {createGraphProxy} from "../utils/proxy.js";

export default class Bullet {

  graph: Graphics | Sprite;
  radius: number;

  speed = 3;

  constructor(cfg) {
    this.radius = cfg.radius || 5;
    this.bounces = cfg.bounces || 0;
    this.direction = cfg.direction;

    let graph = new Graphics();
    // let container = new Container();

    graph.fill(cfg.fill || 0xffffff);
    if (cfg.texture) {
      graph = Sprite.from(cfg.texture);
      graph.anchor.set(0.5);
      graph.width = this.radius * 2;
      graph.height = this.radius * 2;
      // graph.position.x = 0.5;
      // graph.position.y = 0.5;

    } else if (cfg.type === 'circle') {
      graph.circle(0, 0, this.radius);
      graph.fill();
    } else {
      graph.rect(0, 0, 10, 6);
      graph.fill();
    }

    graph.x = cfg.x;
    graph.y = cfg.y;

    // container.rotation = cfg.rotation;
    // container.addChild(graph);
    this.graph = graph;

    return createGraphProxy(this);
  }
}
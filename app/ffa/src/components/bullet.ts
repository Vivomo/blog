import {
  Graphics
} from "pixi.js";
import {createGraphProxy} from "../utils/proxy.js";

export default class Bullet {

  graph: Graphics;
  radius: number;

  speed = 3;

  constructor(cfg) {
    this.radius = cfg.radius || 5;
    this.bounces = cfg.bounces || 0;

    const graph = new Graphics();
    graph.fill(cfg.fill || 0xffffff);
    if (cfg.type === 'circle') {
      graph.circle(0, 0, this.radius)
    } else {
      graph.rect(0, 0, 10, 6);
    }
    graph.fill();
    graph.x = cfg.x;
    graph.y = cfg.y;
    graph.rotation = cfg.rotation;

    this.graph = graph;

    return createGraphProxy(this);
  }
}
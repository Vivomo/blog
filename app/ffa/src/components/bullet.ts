import {
  Sprite
} from "pixi.js";
import {createGraphProxy} from "../utils/proxy.js";

export default class Bullet {

  graph: Sprite;
  radius: number;
  direction: number;
  bounces: number;

  speed = 3;

  constructor(cfg) {
    this.radius = cfg.radius || 5;
    this.bounces = cfg.bounces || 0;
    this.direction = cfg.direction;


    if (cfg.texture) {
      const graph = Sprite.from(cfg.texture);
      graph.anchor.set(0.5);
      graph.width = cfg.width || this.radius * 2;
      graph.height = cfg.height || this.radius * 2;
      graph.rotation = cfg.rotation || 0;
      graph.x = cfg.x;
      graph.y = cfg.y;
      this.graph = graph;
    }


    return createGraphProxy(this);
  }
}
import * as PIXI from "pixi.js";
import {createGraphProxy} from "../utils/proxy.js";

export default class Bullet {
  constructor(cfg) {
    const graph = new PIXI.Graphics();
    graph.fill(0xffffff);
    graph.rect(0, 0, 10, 6);
    graph.fill();
    graph.x = cfg.x;
    graph.y = cfg.y;
    graph.rotation = cfg.rotation;

    this.graph = graph;
    this.radius = 5;

    return createGraphProxy(this);
  }
}
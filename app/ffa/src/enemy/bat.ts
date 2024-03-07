import * as PIXI from 'pixi.js';
import { createGraphProxy } from '../utils/proxy.js';

const defaultCfg = {
  x: 500,
  y: 500,
  radius: 10,
  fillColor: 0x880000,
  speed: 0.1,
}

export default class Bat {
  constructor (param = {}, app, hero) {
    this.level = 1;
    this.hp = 1;
    const cfg = Object.assign({}, defaultCfg, param);
    let graph = new PIXI.Graphics();
    graph.fill(cfg.fillColor);
    graph.circle(0, 0, cfg.radius);
    graph.x = cfg.x;
    graph.y = cfg.y;
    graph.fill(cfg.fillColor);
    this.speed = cfg.speed;
    this.radius = cfg.radius;
    this.graph = graph;

    return createGraphProxy(this);
  }

}
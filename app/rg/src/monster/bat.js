import * as PIXI from 'pixi.js';

const defaultCfg = {
  x: 500,
  y: 500,
  radius: 10,
  fillColor: 0x880000,
  speed: 3,
}

export default class Bat {
  constructor (param = {}, app, hero) {
    this.level = 1;
    this.hp = 1;
    const cfg = Object.assign({}, defaultCfg, param);
    let graph = new PIXI.Graphics();
    graph.beginFill(cfg.fillColor);
    graph.drawCircle(0, 0, cfg.radius);
    graph.x = cfg.x;
    graph.y = cfg.y;
    this.speed = cfg.speed;
    this.graph = graph;

  }

  get x() {
    return this.graph.x;
  }

  get y() {
    return this.graph.y;
  }

  set x(x) {
    this.graph.x = x;
  }

  set y(y) {
    this.graph.y = y;
  }
}
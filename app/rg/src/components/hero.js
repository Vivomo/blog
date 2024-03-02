import * as PIXI from 'pixi.js';

const defaultCfg = {
  x: 500,
  y: 500,
  radius: 50,
  fillColor: 0x990000
}

export default class Hero {
  constructor (param = {}, app) {
    const cfg = Object.assign({}, defaultCfg, param);
    let graph = new PIXI.Graphics();
    graph.beginFill(cfg.fillColor);
    graph.drawCircle(0, 0, cfg.radius);
    graph.x = cfg.x;
    graph.y = cfg.y;
    this.graph = graph;
    this.app = app;

    this.weapons = [];
  }

  get x() {
    return this.graph ? this.graph.x : null;
  }

  get y() {
    return this.graph ? this.graph.y : null;
  }

  start () {

  }
}

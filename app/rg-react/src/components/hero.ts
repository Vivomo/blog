import {Graphics, Application} from 'pixi.js';
import { createGraphProxy } from '../utils/proxy.js';
import EnemyController from "../controller/enemyController";
import {WeaponType} from "../type";

const defaultCfg = {
  x: 500,
  y: 500,
  radius: 20,
  fillColor: '0x000000'
}

export default class Hero {

  graph: Graphics;
  app: Application;
  enemyController?: EnemyController;
  weapons: WeaponType[];

  moving = false;
  direction = 0;
  speed = 2;

  constructor (param = {}, app: Application) {
    const cfg = Object.assign({}, defaultCfg, param);
    let graph = new Graphics()
      .fill(cfg.fillColor)
      .circle(0, 0, cfg.radius);
    graph.x = cfg.x;
    graph.y = cfg.y;
    graph.fill(cfg.fillColor);
    this.graph = graph;
    this.app = app;
    this.weapons = [];
    // this.bullets = [];
    return createGraphProxy(this);
  }


  start () {

  }

  get bullets() {
    return this.weapons.map(weapon => weapon.bullets).flat();
  }

  get enemies() {
    if (this.enemyController) {
      return this.enemyController.enemies;
    }
  }
}

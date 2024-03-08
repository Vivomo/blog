import {
  Assets, Sprite
} from 'pixi.js';
import { createGraphProxy } from '../utils/proxy.js';
import {EnemyAssetsBathPath} from "../contants";

const defaultCfg = {
  x: 500,
  y: 500,
  radius: 10,
  fillColor: 0x880000,
  speed: 0.1,
}

export default class Bat {

  // textureName = 'bat';

  static async load() {
    Bat.texture = await Assets.load(`${EnemyAssetsBathPath}bat.png`);
  }

  constructor (param = {}) {
    this.level = 1;
    this.hp = 1;
    const cfg = Object.assign({}, defaultCfg, param);

    this.setStyle(cfg);
    this.speed = cfg.speed;
    this.radius = cfg.radius;
    return createGraphProxy(this);
  }

  async loader() {
    const texture = await Assets.load(`${EnemyAssetsBathPath}${this.textureName}.png`);
    Bat.texture = texture;
  }

  setStyle(cfg) {
    const sprite = Sprite.from(Bat.texture);
    sprite.width = 20;
    sprite.height = 20;
    sprite.x = cfg.x;
    sprite.y = cfg.y;
    this.graph = sprite;
    this.loaded = true;
  }

}
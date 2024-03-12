import {Assets, Sprite} from "pixi.js";

export default class GameMap {
  constructor() {
  }

  async load() {
    const texture = await Assets.load('/assets/bg/bg.png');
    const sprite = Sprite.from(texture);
    // sprite
    return sprite;
  }
}
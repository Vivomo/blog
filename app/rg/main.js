import './style.css'

import * as PIXI from 'pixi.js';
import HeroController from './src/controller/hero.js';
import Hero from './src/components/hero.js';
import App from './src/app.js';
import BasicGun from './src/weapons/basicGun.js';

const init = () => {

  document.querySelector('#app').appendChild(App.view);

  let hero = new Hero({}, App);
  HeroController.init(App, hero)

  App.stage.addChild(hero.graph);

  hero.weapons.push(new BasicGun(hero));
}

init();



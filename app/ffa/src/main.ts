
import * as PIXI from 'pixi.js';
import HeroController from './controller/hero';
import Hero from './components/hero';
// import App from './components/app';
import BasicGun from './weapons/basicGun';
import EnemyController from './controller/enemy';
import Bat from './enemy/bat.js';
import CollisionListener from "./listener/collisionListener";

const init = async () => {

  const App = new PIXI.Application();

  await App.init({
    background: '#1099bb',
    resizeTo: window,
  })

  document.querySelector('#app').appendChild(App.canvas);

  let hero = new Hero({}, App);
  HeroController.init(App, hero);
  EnemyController.init(hero);
  EnemyController.add(Bat);

  App.stage.addChild(hero.graph);

  hero.weapons.push(new BasicGun(hero));

  CollisionListener.init(EnemyController, hero);

  // window.hero = hero;
}

init();



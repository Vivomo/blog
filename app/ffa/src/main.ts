import { Application } from 'pixi.js';
import HeroController from './controller/hero';
import Hero from './components/hero';
// import App from './components/app';
import BasicGun from './weapons/basicGun';
import EnemyController from './controller/enemyController';
import Bat from './enemy/bat.js';
import CollisionListener from "./listener/collisionListener";
import Wand from "./weapons/wand";
import Fireball from "./weapons/fireball";
import Dart from "./weapons/dart";

const init = async () => {

  const App = new Application();

  // @ts-ignore
  await App.init({
    background: '#1099bb',
    resizeTo: window,
  });

  document.querySelector('#app').appendChild(App.canvas);

  let hero = new Hero({}, App);

  const enemyController = new EnemyController(hero);
  enemyController.add(Bat);
  hero.enemyController = enemyController;

  HeroController.init(App, hero);

  App.stage.addChild(hero.graph);

  hero.weapons.push(new BasicGun(hero));
  hero.weapons.push(new Wand(hero));
  hero.weapons.push(new Fireball(hero));
  hero.weapons.push(new Dart(hero));

  CollisionListener.init(enemyController, hero);

  // @ts-ignore
  window.hero = hero;
}

init();



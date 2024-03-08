import { Application } from 'pixi.js';
import HeroController from './controller/heroController';
import Hero from './components/hero';
import BasicGun from './weapons/basicGun';
import EnemyController from './controller/enemyController';
import Bat from './enemy/bat.js';
import CollisionListener from "./listener/collisionListener";
import Wand from "./weapons/wand";
import Fireball from "./weapons/fireball";
import Dart from "./weapons/dart";
import GameMap from "./components/map";

const init = async () => {

  const App = new Application();

  await App.init({
    background: '#1099bb',
    resizeTo: window,
  });

  document.querySelector('#app')!.appendChild(App.canvas);

  const gameMap = new GameMap();
  const mapSprite = await gameMap.load();
  mapSprite.width = App.renderer.width;
  mapSprite.height = App.renderer.height;

  App.stage.addChild(mapSprite);

  let hero = new Hero({}, App);

  const enemyController = new EnemyController(hero);

  Bat.load().then(() => {
    enemyController.add(Bat);
  });

  hero.enemyController = enemyController;
  new HeroController(hero);
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



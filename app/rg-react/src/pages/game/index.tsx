import { useEffect } from "react";
import { Application } from "pixi.js";
import CollisionListener from "../../listener/collisionListener.ts";
import Dart from "../../weapons/dart.ts";
import Fireball from "../../weapons/fireball.ts";
import Wand from "../../weapons/wand.ts";
import BasicGun from "../../weapons/basicGun.ts";
import HeroController from "../../controller/heroController.ts";
import Bat from "../../enemies/bat.ts";
import EnemyController from "../../controller/enemyController.ts";
import Hero from "../../components/hero.ts";
import GameMap from "../../components/map.ts";

const Game = () => {

  const init = async () => {
    const App = new Application();

    await App.init({
      background: '#1099bb',
      resizeTo: window,
    });

    document.querySelector('#game')!.appendChild(App.canvas);

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
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div id={'game'}>

    </div>
  );
};

export default Game;
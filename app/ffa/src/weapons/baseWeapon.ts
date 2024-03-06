export default class BaseWeapon {
  cd = 1000;
  lv = 1;
  maxLv = 8;
  damage = 10;
  speed = 10;
  name = '';

  constructor(hero) {
    this.hero = hero;
    this.app = hero.app;
    setInterval(() => {
      this.attack();
    }, this.cd);

    this.app.ticker.add(() => {
      this.update();
    })
  }

  attack() {

  }

  update() {

  }
}
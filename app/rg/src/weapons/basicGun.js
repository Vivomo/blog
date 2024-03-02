import * as PIXI from 'pixi.js';

export default class BasicGun {
  constructor (hero) {
    this.hero = hero;
    this.app = hero.app;
    this.level = 1;
    this.bullets = [];
    this.shoot();
    setInterval(() => {
      this.shoot();
    }, 1000)
    this.app.ticker.add(() => {
      this.update();
    });
  }

  fire () {

  }

  shoot() {
    const directions = ['up', 'down', 'left', 'right'];
    const app = this.app;
    directions.forEach((dir) => {
      for (let i = 0; i < 3; i++) {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0xffffff);
        bullet.drawRect(0, 0, 5, 10); // 子弹大小
        bullet.endFill();
        bullet.x = this.hero.x;
        bullet.y = this.hero.y;
        bullet.direction = dir; // 记录子弹的方向
        this.bullets.push(bullet);
        app.stage.addChild(bullet);
      }
    });
  }

  update() {
    this.bullets.forEach((bullet) => {
      switch (bullet.direction) {
        case 'up':
          bullet.y -= 10;
          break;
        case 'down':
          bullet.y += 10;
          break;
        case 'left':
          bullet.x -= 10;
          break;
        case 'right':
          bullet.x += 10;
          break;
        default:
          break;
      }

      // 如果子弹超出屏幕，移除它
      if (
        bullet.x < 0 ||
        bullet.x > this.app.renderer.width ||
        bullet.y < 0 ||
        bullet.y > this.app.renderer.height
      ) {
        this.app.stage.removeChild(bullet);
      }
    });
  }
}
import './style.css'

import * as PIXI from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';

import HeroController from './src/controller/hero.js';
import Hero from './src/components/hero.js';
import app from './src/app.js';
import BasicGun from './src/weapons/basicGun.js';
import EnemyController from './src/controller/enemy.js';
import Bat from './src/enemy/bat.js';
import CollisionListener from "./src/listener/collisionListener.js";

const init = () => {

  document.querySelector('#app').appendChild(app.view);



  // const app = new PIXI.Application({
  //   width: 800,
  //   height: 600,
  //   backgroundColor: 0x1099bb,
  // });
  // document.body.appendChild(app.view);

  function drawLightning(startX, startY, length, angle, depth) {
    if (depth === 0) {
      return;
    }

    const glowFilter = new GlowFilter({
      color: 0x6666FF, // 光晕的颜色
      distance: 15 * depth, // 光晕的扩散距离
      outerStrength: 2.5 * depth, // 光晕的外部强度
      quality: 0.5, // 渲染质量
      knockout: true
    });

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(depth, 0xFFFFFF, 1);
    graphics.filters = [glowFilter];

    // 计算闪电线段的结束坐标
    const endX = startX + length * Math.cos(angle * Math.PI / 180);
    const endY = startY + length * Math.sin(angle * Math.PI / 180);

    // 绘制线段
    graphics.moveTo(startX, startY);
    graphics.lineTo(endX, endY);
    app.stage.addChild(graphics);

    // 生成分支
    const branches = 1 + Math.random() * 3; // 分支数量，可调整
    for (let i = 0; i < branches; i++) {
      const newLength = length * 0.7 + Math.random() * - 0.3;
      const newAngle = angle + (Math.random() - 0.5) * 90; // 分支角度差，可调整
      const newDepth = depth - 1;

      drawLightning(endX, endY, newLength, newAngle, newDepth);
    }
  }

  function animateLightning() {
    // 每次动画前清空之前的绘图
    app.stage.removeChildren();

    // 在屏幕顶部中间位置绘制闪电
    drawLightning(app.screen.width / 2, 0, 280, 90, 5);
  }

  animateLightning();

// 间隔一段时间动态绘制闪电，模拟闪电闪动效果
  setInterval(animateLightning, 1000);

  // let hero = new Hero({}, App);
  // HeroController.init(App, hero);
  // EnemyController.init(hero);
  // EnemyController.add(Bat);
  //
  // App.stage.addChild(hero.graph);
  //
  // hero.weapons.push(new BasicGun(hero));
  //
  // CollisionListener.init(EnemyController, hero);

  // window.hero = hero;
}

init();



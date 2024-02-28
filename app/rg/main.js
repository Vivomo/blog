import './style.css'

import * as PIXI from 'pixi.js';

const init = () => {
  const app = new PIXI.Application({
    background: '#1099bb',
    resizeTo: window,
  });

  document.querySelector('#app').appendChild(app.view);

  // Create a Graphics object, set a fill color, draw a rectangle
  let obj = new PIXI.Graphics();
  obj.beginFill(0xff0000);
  obj.drawCircle(500, 500, 100);

// Add it to the stage to render
  app.stage.addChild(obj);

  app.ticker.add(() => {
    obj.x += 0.3
  })
}

init();



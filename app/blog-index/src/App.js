import './App.scss';
import { useEffect } from 'react';
import Blog from './Blog';

function App() {

  useEffect(() => {
    let q = document.getElementById('canvas-bg'),
      c = q.getContext('2d'),
      w = q.width = document.body.clientWidth,
      h = q.height = window.innerHeight,
      p = new Array(256).join('1').split('');

    let draw = () => {
      requestAnimationFrame(draw);
      c.fillStyle = 'rgba(0,0,0,0.05)';
      c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(0,255,0,0.6)';
      p = p.map((v, i) => {
        let r = Math.random();
        c.fillText(String.fromCharCode(Math.floor(2720 + r * 33)), i * 10, v);
        v += 10;
        return v > 768 + r * 1e4 ? 0 : v
      })
    };

    window.addEventListener('resize', () => {
      w = q.width = document.body.clientWidth;
      h = q.height = window.innerHeight;
    })

    draw();
  }, []);

  return (
    <div className="App">
      <canvas id="canvas-bg"/>
      <Blog/>
    </div>
  );
}

export default App;

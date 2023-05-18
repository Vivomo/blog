import './App.css';
import { useEffect } from 'react';
import { initCity } from './enter'

function App() {

  useEffect(() => {
    initCity()
  }, [])

  return (
    <div className="App">
      <canvas id="city">浏览器不支持canvas，请切换浏览器重试</canvas>
    </div>
  );
}

export default App;

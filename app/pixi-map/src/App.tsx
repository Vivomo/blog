import './App.css';
import GameContext from '@/context';
import Map from './components/map';
import { useEffect, useRef, useState } from 'react';
import MAP_CFG from './cfg/map';

function App() {

  const [renderMapData, setRenderMapData] = useState([]);
  const mapDataRef = useRef([]);

  useEffect(() => {

    setRenderMapData(MAP_CFG);
    mapDataRef.current = MAP_CFG;
  }, []);

  return (
    <GameContext.Provider value={{
      mapData: renderMapData
    }}>
      <Map/>
    </GameContext.Provider>
  )
}

export default App

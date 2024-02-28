import { createContext } from 'react';

const GameContext = createContext({
  curId: 0,
  players: [],
  mapData: [],
  onPlayerMove: () => {
    //
  },
  treasureChest: [],
  openTreasureChest: () => {
    //
  }
});

export default GameContext;
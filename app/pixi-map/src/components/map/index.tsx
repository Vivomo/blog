import * as PIXI from 'pixi.js';
import { Stage, Container, Sprite } from '@pixi/react';
// import { Loader } from '@pixi/loaders';

import MAP_CFG, { CELL_SIZE } from '../../cfg/map';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MapCell, { ICellClassCache } from '../mapCell';
import GameContext from '../../context';
import { getCellClass } from '../../utils';
import { Resource, Texture } from 'pixi.js';

const SpriteCellSize = CELL_SIZE / 3;
const width = 24;
const height = 16;
const MinOffsetX = (width - MAP_CFG[0].length) * CELL_SIZE;
const MaxOffsetX = 0;
const MinOffsetY = (height - MAP_CFG.length) * CELL_SIZE;
const MaxOffsetY = 0;

const Map = () => {


  const { x: startX, y: startY } = { x: 0, y: 0};

  const staticData = useMemo(() => {
    return Array(MAP_CFG.length).fill(0).map(() => Array(MAP_CFG[0].length).fill(0));
  }, [MAP_CFG[0].length, MAP_CFG.length]);

  const [offset, setOffset] = useState({ x: 0, y: 0});
  const [textures, setTextures] = useState<Texture<Resource>[]>([]);

  const cellClassCache = useRef<ICellClassCache>({});
  const { mapData } = useContext(GameContext);

  useEffect(() => {
    // wall_sprite
    const onKeydown = (e: KeyboardEvent) => {
      if (e.keyCode < 37 || e.keyCode > 40) {
        return;
      }
      switch (e.keyCode) {
        case 37:
          offset.x = Math.min(MaxOffsetX, offset.x + 10);
          break;
        case 38:
          offset.y = Math.min(MaxOffsetY, offset.y + 10);
          break;
        case 39:
          offset.x = Math.max(MinOffsetX, offset.x - 10);
          break;
        case 40:
          offset.y = Math.max(MinOffsetY, offset.y - 10);
          break;
      }
      setOffset({ ...offset });
    }
    document.body.addEventListener('keydown', onKeydown);

    // 加载图片资源
    const spriteSheetTexture = PIXI.Texture.from('/assets/img/wall_sprite.png');
    const _textures = Array(24).fill(0).map((_, index) => {
      const size = CELL_SIZE / 3;
      const sprite1Rect = new PIXI.Rectangle(index * size, 0, size, size);
      // @ts-ignore
      return new PIXI.Texture(spriteSheetTexture, sprite1Rect);
    });

    setTextures(_textures);

    return () => {
      document.body.removeEventListener('keydown', onKeydown);
    }
  }, []);

  if (mapData.length === 0) {
    return <div className="mi-map-wrapper"/>
  }

  console.log(offset)

  const isRenderable = (x: number, y: number) => {
    return x >= -CELL_SIZE && x < CELL_SIZE*(width + 1) && y >= -CELL_SIZE && y <= CELL_SIZE*(height + 1);
  }


  return (
    <Stage width={CELL_SIZE*width} height={CELL_SIZE*height} options={{ resolution: 1 }}>
      {
        staticData.map((row, rowIndex) => {
          const y = startY + rowIndex
          return row.map((_, colIndex) => {
            const x = startX + colIndex;
            if (!cellClassCache.current[`${y}-${x}`]) {
              cellClassCache.current[`${y}-${x}`] = getCellClass(mapData, { x, y})
            }
            const { transforms, classList } = cellClassCache.current[`${y}-${x}`];
            const positionX = x * CELL_SIZE + offset.x;
            const positionY = y * CELL_SIZE + offset.y;
            const renderable = isRenderable(positionX, positionY);
            if (!renderable) {
              return null;
            }
            return (
              <Container
                key={`${x}-${y}`}
                position={[positionX, positionY]}
                width={CELL_SIZE}
                height={CELL_SIZE}
                renderable={isRenderable(positionX, positionY)}
              >
                {
                  classList.map((item, index) => {
                    const transformStyle = transforms.find((item) => item.index === index);
                    return (
                      <Sprite
                        key={`${x}-${y}-${index}`}
                        x={(index % 3) * SpriteCellSize + SpriteCellSize / 2}
                        y={~~(index / 3) * SpriteCellSize + SpriteCellSize / 2}
                        width={SpriteCellSize}
                        height={SpriteCellSize}
                        anchor={0.5}
                        angle={transformStyle?.rotation ?? 0}
                        texture={textures[item - 1]}
                      />
                    )
                  })
                }
              </Container>
            )
          })
        })
      }
    </Stage>
  );
};

export default Map;
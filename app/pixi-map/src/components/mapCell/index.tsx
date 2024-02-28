import './styles.scss';
import { Container, Sprite } from '@pixi/react';
import { CELL_SIZE } from '../../cfg/map';

interface ITransform {
  index: number;
  rotation: number;
}

interface ICellClass {
  transforms: ITransform[];
  classList: number[];
}

export interface ICellClassCache {
  [k: string]: ICellClass
}

export interface ICoordinate {
  x: number;
  y: number;
}

interface IProps {
  coordinate: ICoordinate,
  cellClassCache: ICellClassCache;
}

const SpriteCellSize = CELL_SIZE / 3;

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, cellClassCache, textures } = props;

  const { transforms, classList } = cellClassCache[`${y}-${x}`];

  if (textures.length === 0) {
    return null;
  }


  return (
    <Container position={[x * CELL_SIZE, y * CELL_SIZE]} width={CELL_SIZE} height={CELL_SIZE}>
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
  );
};

export default MapCell;
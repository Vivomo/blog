import {GridSize} from "../contants/index.js";

export const getMovePointer = (p1, p2, d) => {
  const directionX = p2.x - p1.x;
  const directionY = p2.y - p1.y;

  const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
  const unitX = directionX / distance;
  const unitY = directionY / distance;

  const x = p1.x + unitX * d;
  const y = p1.y + unitY * d;

  return { x, y };
};


export const getDistance = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}


export const checkCollision = (p1, p2) => {
  const distance = getDistance(p1, p2);
  return distance <= p1.radius + p2.radius;
}

export const isOutOfBoundaries = (point, app) => {
  return point.x < 0 || point.y < 0 || point.x > app.renderer.width || point.y > app.renderer.height;
}

export const createGrid = (items, { width, height }) => {
  const grid = new Array(GridSize * GridSize).fill(0).map(_ => []);
  const wSize = width / GridSize;
  const hSize = height / GridSize;
  items.forEach((item) => {
    if (item.destroyed) {
      return;
    }
    const index = ~~(item.x / wSize) + ~~(item.y / hSize) * GridSize;
    grid[index] && grid[index].push(item);
  });
  return grid;
}
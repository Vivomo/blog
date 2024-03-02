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
const PADDING = 50;

const DEFAULT_R = 50;

const GRAPH_MAP = {
  CIRCLE: '1',
  RECT: '2',
  PENTAGRAM: '3'
};

class Graph {
  constructor (type, x, y, r, speedX = 0, speedY = 0) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    // this.speed = speed;
    // this.direction = direction
    if (type === GRAPH_MAP.RECT) {
      this.r = r * Math.sqrt(2);
    } else {
      this.r = r;
    }
    this.coincident = false;
  }

  // get speedX() {
  //   return this.speed * Math.cos(this.direction);
  // }
  //
  // get speedY() {
  //   return this.speed * Math.sin(this.direction);
  // }
}

const randomInt = (...args) => {
  let min = 0;
  let max;
  if (args.length === 1) {
    max = args[0];
  } else {
    [min, max] = args;
  }
  return min + ~~(Math.random() * (max - min));
}

const reflectDirection = (speedX, speedY, angle) => {
  //将速度向量(speedX,speedY)和法向量(Nx,Ny)转换为单位向量(Ix,Iy)和(Nx,Ny)
  const Ix = speedX / Math.sqrt(speedX * speedX + speedY * speedY);
  const Iy = speedY / Math.sqrt(speedX * speedX + speedY * speedY);
  const Nx = -Math.sin(angle);
  const Ny = Math.cos(angle);
  //根据反射定律计算反射光线的单位向量(Rx,Ry)
  const Rx = Ix - 2 * (Ix * Nx + Iy * Ny) * Nx;
  const Ry = Iy - 2 * (Ix * Nx + Iy * Ny) * Ny;
  //将反射光线的单位向量(Rx,Ry)转换为速度向量(speedX,speedY)
  speedX = Rx * Math.sqrt(speedX * speedX + speedY * speedY);
  speedY = Ry * Math.sqrt(speedX * speedX + speedY * speedY);
  return [speedX, speedY]
}


const updateGraphCoincident = (graphList, bounding) => {
  for (let i = 0; i < graphList.length - 1; i++) {
    let graph1 = graphList[i];
    for (let j = i + 1; j < graphList.length; j++) {
      let graph2 = graphList[j];
      if (bounding === 'rect') {
        if (Math.abs(graph1.x - graph2.x) < 100 && Math.abs(graph1.y - graph2.y) < 100) {
          graph1.coincident = true;
          graph2.coincident = true;
        }
      } else {
        const distance = Math.sqrt(Math.pow(graph1.x - graph2.x, 2) + Math.pow(graph1.y - graph2.y, 2));
        if (distance < graph1.r + graph2.r) {
          graph1.coincident = true;
          graph2.coincident = true;
        }
      }
    }
  }
}

const drawGraphList = (ctx, graphList, bounding) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  updateGraphCoincident(graphList, bounding);
  graphList.forEach((graph) => {
    switch (graph.type) {
      case GRAPH_MAP.CIRCLE:
        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        ctx.setLineDash([]);
        ctx.arc(graph.x, graph.y, 50, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case GRAPH_MAP.RECT:
        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        ctx.setLineDash([]);
        ctx.rect(graph.x - 50, graph.y - 50, 100, 100);
        ctx.stroke();
        break;
      case GRAPH_MAP.PENTAGRAM:
        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        const x = graph.x;
        const y = graph.y;
        const r = 50;

        const points = []
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 18) * Math.PI / 180;
          const px = x + r * Math.cos(angle);
          const py = y + r * Math.sin(angle);
          points.push([px, py]);
        }

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(points[0][0], points[0][1]); // 1
        ctx.lineTo(points[2][0], points[2][1]); // 3
        ctx.lineTo(points[4][0], points[4][1]); // 5
        ctx.lineTo(points[1][0], points[1][1]); // 2
        ctx.lineTo(points[3][0], points[3][1]); // 4
        ctx.closePath();
        ctx.stroke();
        break;
    }

    if (graph.coincident) {
      ctx.strokeStyle = '#f00';
    } else {
      ctx.strokeStyle = '#0f0';
    }
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    if (bounding === 'rect') {
      ctx.rect(graph.x - 50, graph.y - 50, 100, 100);
    } else {
      ctx.arc(graph.x, graph.y, graph.r, 0, Math.PI * 2);
    }
    ctx.stroke();
  });
};

// 外接矩形判定
(() => {
  const insert = document.getElementById('insert-br');
  const graphSelect = document.getElementById('graph-br');
  const canvas = document.getElementById('bounding-rectangle');
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 1;
  const maxX = canvas.width - PADDING;
  const maxY = canvas.height - PADDING;
  let graphList = [];

  insert.addEventListener('click', () => {
    const graphValue = graphSelect.value;
    const x = randomInt(PADDING, maxX);
    const y = randomInt(PADDING, maxY);
    graphList.push(new Graph(graphValue, x, y, DEFAULT_R));

    drawGraphList(ctx, graphList, 'rect');
  });

})();

// 外接圆判定
(() => {
  const insert = document.getElementById('insert-bc');
  const graphSelect = document.getElementById('graph-bc');
  const canvas = document.getElementById('bounding-circle');
  const ctx = canvas.getContext('2d');
  const maxX = canvas.width - PADDING;
  const maxY = canvas.height - PADDING;
  let graphList = [];

  insert.addEventListener('click', () => {
    const graphValue = graphSelect.value;
    const x = randomInt(PADDING, maxX);
    const y = randomInt(PADDING, maxY);
    graphList.push(new Graph(graphValue, x, y, DEFAULT_R));

    drawGraphList(ctx, graphList, 'circle');
  });

})();

(() => {
  const insert = document.getElementById('insert-ba');
  const canvas = document.getElementById('circle-animate');
  const cw = canvas.width;
  const ch = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f0';
  const maxX = cw - PADDING;
  const maxY = ch - PADDING;
  let graphList = [];

  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    graphList.forEach((graph) => {
      let { x, y, r } = graph;
      graph.x += graph.speedX;
      graph.y += graph.speedY;
      // 边界检测
      if (x + r > cw) {
        graph.x = 2 * cw - x - 2 * r;
        graph.speedX *= -1;
      }
      if (x - r < 0) {
        graph.x = 2 * r - x;
        graph.speedX *= -1;
      }
      if (y + r > ch) {
        graph.y = 2 * ch - y - 2 * r;
        graph.speedY *= -1;
      }
      if (y - r < 0) {
        graph.y = 2 * r - y;
        graph.speedY *= -1;
      }

      ctx.beginPath();
      ctx.arc(graph.x, graph.y, graph.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  };

  insert.addEventListener('click', () => {
    const x = randomInt(PADDING, maxX);
    const y = randomInt(PADDING, maxY);
    // const r = randomInt(DEFAULT_R - 30, DEFAULT_R + 30);
    const speedX = randomInt(-10, 10);
    const speedY = randomInt(-10, 10);
    graphList.push(new Graph(GRAPH_MAP.CIRCLE, x, y, 50, speedX, speedY));
  });

  animate();
})();


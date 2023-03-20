class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
    this.edges = [];
    this.normals = [];
    this.calculateEdges();
  }

  //计算每条边和对应的法向量
  calculateEdges() {
    for (let i = 0; i < this.vertices.length; i++) {
      let j = (i + 1) % this.vertices.length;
      let edge = {
        x: this.vertices[j].x - this.vertices[i].x,
        y: this.vertices[j].y - this.vertices[i].y
      };
      let normal = { x: edge.y, y: -edge.x };
      this.edges.push(edge);
      this.normals.push(normal);
    }
  }

  //计算多边形在某个轴上的投影范围
  project(axis) {
    let min = Infinity;
    let max = -Infinity;
    for (let v of this.vertices) {
      let dot = v.x * axis.x + v.y * axis.y; //点乘运算
      if (dot < min) min = dot;
      if (dot > max) max = dot;
    }
    return {min: min, max: max};
  }
}

const SATCollision = (polygon1, polygon2) => {
  let axes = polygon1.normals.concat(polygon2.normals);
  for (let axis of axes) {
    let projection1 = polygon1.project(axis);
    let projection2 = polygon2.project(axis);
    if (projection1.max < projection2.min || projection2.max < projection1.min) {
      return false;
    }
  }
  return true;
};


(() => {
  const clear = document.getElementById('clear-sat');
  const create = document.getElementById('create-polygon');
  const check = document.getElementById('check-polygon');
  const canvas = document.getElementById('sat');
  const resultTxt = document.getElementById('sat-result');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0f0';
  ctx.beginPath();

  let points = [];
  let polygon1 = null;
  let polygon2 = null;

  clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygon1 = null;
    polygon2 = null;
    points = [];
    resultTxt.innerText = '';
  });

  check.addEventListener('click', () => {
    if (polygon1 && polygon2) {
      const result = SATCollision(polygon1, polygon2);
      resultTxt.innerText = result ? '是' : '否';
    } else {
      alert('请先创建两个凸多边形');
    }
  });

  create.addEventListener('click', () => {
    if (points.length < 3) {
      alert('顶点不够');
      return;
    }
    const [firstPoint, ...otherPoints] = points;
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (let point of otherPoints) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    if (!polygon1) {
      polygon1 = new Polygon(points);
    } else if (!polygon2) {
      polygon2 = new Polygon(points);
    }
    points = [];
  });

  canvas.addEventListener('click', (e) => {
    if (polygon2) {
      alert('请先清空画布');
      return;
    }
    const point = {
      x: e.offsetX,
      y: e.offsetY
    };
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    points.push(point);
  });
})();

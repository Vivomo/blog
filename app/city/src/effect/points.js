import * as THREE from 'three'

export class Points{
  constructor(scene, { size, opacity, range, count, setAnimation, setPosition, url }) {
    this.scene = scene;

    // 范围
    this.range = range;
    // 雪花的个数
    this.count = count;

    this.pointList = [];

    this.size = size
    this.opacity = opacity
    this.setAnimation = setAnimation
    this.setPosition = setPosition
    this.url = url

    this.init();
  }

  init() {

    // 材质
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
      depthTest: false,
    })

    // 几何对象
    this.geometry = new THREE.BufferGeometry();

    // 添加顶点信息
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2,
      )

      this.setPosition(position);

      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList);

    this.point = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.point);
  }

  animation() {
    this.pointList.forEach(position => {
      this.setAnimation(position);
    })

    this.point.geometry.setFromPoints(this.pointList);
  }
}

import * as THREE from 'three'
import { Points } from './points'

export default class Rain{
  constructor(scene) {

    this.points = new Points(scene, {
      size: 10,
      opacity: 0.4,
      range: 1000,
      count: 800,
      setAnimation(position) {
        position.y -= position.speedY;

        // 边界检查
        if (position.y <= 0) {
          position.y = this.range / 2;
        }
      },
      setPosition(position) {
        position.speedY = 12
      },
      url: '../../src/assets/rain.png',
    })
    // this.scene = scene;
    //
    // // 范围
    // this.range = 1000;
    // // 个数
    // this.count = 800;
    //
    // this.pointsList = [];
    //
    // this.init();
  }

  init() {
    // 创建粒子
    this.material = new THREE.PointsMaterial({
      size: 10,
      map: new THREE.TextureLoader().load('../../src/assets/rain.png'),
      transparent: true,
      opacity: 0.4,
      depthTest: false,
    })

    this.geometry = new THREE.BufferGeometry();
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2,
      )

      position.speedY = 20;

      this.pointsList.push(position)
    }

    this.geometry.setFromPoints(this.pointsList)

    this.points = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.points)
  }

  animation() {
    // this.pointsList.forEach(position => {
    //   position.y -= position.speedY;
    //
    //   // 边界检查
    //   if (position.y <= 0) {
    //     position.y = this.range / 2;
    //   }
    // })
    //
    // this.points.geometry.setFromPoints(this.pointsList);

    this.points.animation();
  }
}

import * as THREE from 'three'
import { color } from '../config'

export default class Road{
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;

    this.createFly({
      // 起始点
      source: {
        x: 300,
        y: 0,
        z: -200,
      },
      // 终止点
      target: {
        x: -500,
        y: 0,
        z: -240,
      },
      range: 200,
      height: 300,
      color: color.fly,
      size: 30,
    })
  }

  createFly(options) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-320, 0, 160),
      new THREE.Vector3(-150, 0, -40),
      new THREE.Vector3(-10, 0, -35),
      new THREE.Vector3(40, 0, 40),
      new THREE.Vector3(30, 0, 150),
      new THREE.Vector3(-100, 0, 310),
    ])

    // 获取粒子
    const points = curve.getPoints(400);

    const positions = []
    const aPositions = []
    points.forEach((item, index) => {
      positions.push(item.x, item.y, item.z)
      aPositions.push(index)
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color)
        },
        u_range: {
          value: options.range
        },
        u_size: {
          value: options.size
        },
        u_total: {
          value: 400,
        },
        u_time: this.time,
      },
      vertexShader: `
        attribute float a_position;
        
        uniform float u_time;
        uniform float u_size;
        uniform float u_range;
        uniform float u_total;
      
        varying float v_opacity;
        
        void main() {
           float size = u_size;
           float total_number = u_total * mod(u_time, 1.0);
           
           if (total_number > a_position && total_number < a_position + u_range) {
           
             // 拖尾效果
             float index = (a_position + u_range - total_number) / u_range;
             size *= index;
             
             
             v_opacity = 1.0;
           } else {
             v_opacity = 0.0;
           }
           
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
           gl_PointSize = size / 10.0;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying float v_opacity;
        
        void main() {
          gl_FragColor = vec4(u_color, v_opacity);
        }
      `,
      transparent: true,
    })

    const point = new THREE.Points(geometry, material)

    this.scene.add(point);
  }
}

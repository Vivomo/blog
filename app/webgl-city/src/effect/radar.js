import * as THREE from 'three';
import { color } from '../config';

export default class Radar {
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;

    this.init();
  }

  init() {
    const radius = 50;

    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 雷达的颜色
        u_color: {
          value: new THREE.Color(color.radarColor)
        },

        // 变化的值
        u_time: this.time,
        // 半径

        u_radius: {
          value: radius,
        },
      },
      transparent: true,
      side: THREE.DoubleSide,

      vertexShader: `
        varying vec2 v_position;
      
        void main() {
          v_position = vec2(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 v_position;
        
        uniform float u_time;
        uniform vec3 u_color;
        uniform float u_radius;
        
        void main() {
          float angle = atan(v_position.x, v_position.y);
          
          float new_angle = mod(angle + u_time, 3.1415926 * 2.0);
          
          // 计算距离
          float dis = distance(vec2(0.0,0.0), v_position);
          
          // 外层圆环的宽度
          float borderWidth = 2.0;
          
          float f_opacity = 0.0;
          
          // 在圆环上
          if (dis > u_radius - borderWidth) {
            f_opacity = 1.0;
          }
          
          // 雷达扫描的显示
          if (dis < u_radius - borderWidth) {
            f_opacity = 1.0 - new_angle;
          }
          
          // 处于雷达之外
          if (dis > u_radius) {
            f_opacity = 0.0;
          }
          
          gl_FragColor = vec4(u_color, f_opacity);
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(-Math.PI / 2);
    mesh.position.set(300,0,0);

    this.scene.add(mesh);
  }
}

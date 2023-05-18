import * as THREE from 'three';
import { formatUrl } from '../utils/index.js';

export default class Background {
  constructor (scene) {
    this.scene = scene;
    this.url = formatUrl('/assets/black-bg.png');
    this.init();
  }

  init() {
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.SphereGeometry(5000, 32, 32);

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url)
    });

    const sphere = new THREE.Mesh(geometry, material);

    this.scene.add(sphere);
  }
}
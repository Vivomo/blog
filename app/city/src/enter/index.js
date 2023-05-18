import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import City from './city.js';


import '../base/index.css';

const initCamera = (scene) => {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.set(1000, 500, 100);
  scene.add(camera);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新投影矩阵
    camera.updateProjectionMatrix();
  });
  return camera;
}

const initRenderer = () => {
  const canvas = document.getElementById('city');
  const renderer = new THREE.WebGL1Renderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  renderer.setClearColor(new THREE.Color(0x000000));

  return renderer;
}

const initLights = (scene) => {
  scene.add(new THREE.AmbientLight(0xadadad));
  const directionLight = new THREE.DirectionalLight(0xffffff);
  directionLight.position.set(0, 0, 0)
  scene.add(directionLight);
}

const animate = (params) => {
  const {renderer, scene, camera, city, controls} = params;
  requestAnimationFrame(() => {
    city.start();
    renderer.render(scene, camera);
    controls.update();
    animate(params);
  })
}

const initControls = (renderer, camera) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  return controls;
}

export const initCity = () => {
  const scene = new THREE.Scene();
  const camera = initCamera(scene);
  const renderer = initRenderer();
  const controls = initControls(renderer, camera);
  initLights(scene);

  const clock = new THREE.Clock()
  const city = new City(scene, camera, clock);
  animate({renderer, scene, camera, city, controls});
}
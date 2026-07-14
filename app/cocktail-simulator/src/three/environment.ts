import * as THREE from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/**
 * 环境贴图占位:
 * 把 HDR 素材放到 public/env/environment.hdr 即可自动生效;
 * 素材缺失时回退到 three 内置的 RoomEnvironment(程序化生成的室内环境)。
 */
export async function setupEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
): Promise<void> {
  const url = '/env/environment.hdr'
  try {
    const head = await fetch(url, { method: 'HEAD' })
    const type = head.headers.get('content-type') ?? ''
    if (head.ok && !type.includes('text/html')) {
      const tex = await new RGBELoader().loadAsync(url)
      tex.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = tex
      return
    }
  } catch {
    /* 无素材,走回退 */
  }
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
}

import * as THREE from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/**
 * 环境贴图:
 * 优先 public/env/environment.hdr(RGBE),
 * 其次 public/env/environment.png|.jpg(等距柱状 LDR),
 * 都没有时回退到 three 内置 RoomEnvironment(仅照明,不改背景)。
 *
 * 有素材时同时写入 scene.environment(反射) 与 scene.background(可见背景)。
 */
export async function setupEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
): Promise<void> {
  if (await tryLoadHdr(scene, '/env/environment.hdr')) return
  if (await tryLoadLdr(scene, '/env/environment.png')) return
  if (await tryLoadLdr(scene, '/env/environment.jpg')) return

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
}

function applyEnvMap(scene: THREE.Scene, tex: THREE.Texture): void {
  tex.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = tex
  scene.background = tex
}

async function assetExists(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: 'HEAD' })
    const type = head.headers.get('content-type') ?? ''
    return head.ok && !type.includes('text/html')
  } catch {
    return false
  }
}

async function tryLoadHdr(scene: THREE.Scene, url: string): Promise<boolean> {
  if (!(await assetExists(url))) return false
  try {
    const tex = await new RGBELoader().loadAsync(url)
    applyEnvMap(scene, tex)
    return true
  } catch {
    return false
  }
}

async function tryLoadLdr(scene: THREE.Scene, url: string): Promise<boolean> {
  if (!(await assetExists(url))) return false
  try {
    const tex = await new THREE.TextureLoader().loadAsync(url)
    tex.colorSpace = THREE.SRGBColorSpace
    applyEnvMap(scene, tex)
    return true
  } catch {
    return false
  }
}

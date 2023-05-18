import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const fbxLoader = new FBXLoader();
export const loadFBX = (url) => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(url, (obj) => {
      resolve(obj)
    }, () => {}, (error) => {
      reject(error)
    })
  })
}
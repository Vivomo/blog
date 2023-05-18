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

const online = window.location.href.includes('weimu.xyz');

export const formatUrl = (url) => {
  if (online) {
    return `/app/city/dist${url}`
  }
  return url;
}
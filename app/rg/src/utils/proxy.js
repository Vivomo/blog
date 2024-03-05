export const createGraphProxy = (obj) => {
  return new Proxy(obj, {
    get(target, prop) {
      if (target.hasOwnProperty(prop)) {
        return target[prop];
      } else if (prop in target.graph) {
        return target.graph[prop];
      } else {
        return undefined;
      }
    },
    set(target, prop, value) {
      if (target.hasOwnProperty(prop)) {
        target[prop] = value;
      } else if (prop in target.graph) {
        target.graph[prop] = value;
      } else {
        return false;
      }
      return true;
    },
  });
}
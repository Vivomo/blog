export const createGraphProxy = (obj) => {
  return new Proxy(obj, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      } else if (prop in target.graph) {
        return target.graph[prop];
      } else {
        return undefined;
      }
    },
    set(target, prop, value) {
      if (prop in target) {
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
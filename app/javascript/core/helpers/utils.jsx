export const camelToUnderscore = (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase();

function isArray(a) {
  return Array.isArray(a);
}

function isObject(o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

export function keysToSnake(o, depth = 2) {
  if (depth <= 0) {
    return o;
  }
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[camelToUnderscore(k)] = keysToSnake(o[k], depth - 1);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i) => keysToSnake(i, depth - 1));
  }

  return o;
}

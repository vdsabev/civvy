import { notify } from './notify';

export const catchError = (promise) => {
  promise.catch(notify.error);
  return promise;
};

export const setPropToAttr = (propKey, attrKey) => (state, actions, e) => ({ [propKey]: e.currentTarget[attrKey] });

export const invoke = (key, ...args) => (x) => {
  const f = x[key];
  if (typeof f === 'function') return x[key](...args);
};

export const preventDefault = invoke('preventDefault');

export const select = (deepKey, initialValue) => {
  if (!deepKey) return initialValue;
  return deepKey.split('.').reduce((value, key) => value != null ? value[key] : value, initialValue);
};

export const values = (obj, keyAlias) =>
  obj ?
    Object.keys(obj).map((key) => keyAlias ? { ...obj[key], [keyAlias]: key } : obj[key])
    :
    []
;

export const arrayToObject = (array, keyAlias = 'key') => array.reduce((obj, value) => ({ ...obj, [value.key]: value }), {});

export const shade = (hex, percent) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = parseInt((r * (100 + percent) / 100).toString(), 10);
  g = parseInt((g * (100 + percent) / 100).toString(), 10);
  b = parseInt((b * (100 + percent) / 100).toString(), 10);

  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);

  let rr = ((r.toString(16).length === 1) ? `0${r.toString(16)}` : r.toString(16));
  let gg = ((g.toString(16).length === 1) ? `0${g.toString(16)}` : g.toString(16));
  let bb = ((b.toString(16).length === 1) ? `0${b.toString(16)}` : b.toString(16));

  return `#${rr}${gg}${bb}`;
};

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

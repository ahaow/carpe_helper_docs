# 方法库

## 深拷贝

```js
function isObject(source) {
  return typeof source === "object" && source !== null;
}

function cloneDeep(source, hash = new WeakMap()) {
  if (!isObject(source)) {
    return source;
  }

  if (hash.has(source)) {
    return hash.get(source);
  }

  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target);

  Reflect.ownKeys((key) => {
    if (isObject(source[key])) {
      target[key] = cloneDeep(source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}
```

## 柯里化

```js
function curry(fn, length) {
  length = length || fn.length;
  return function (...args) {
    if (args.length >= length) {
      return fn.apply(this, args);
    } else {
      return curry(fn.bind(this, ...args), length - args.length);
    }
  };
}
```

## urlParams

```js
export const urlParams = (url) => {
  let res = {};
  if (url.includes("?")) {
    let str = url.split("?")[1];
    let arr = str.split("&");
    arr.forEach((item) => {
      let key = item.split("=")[0];
      let value = item.split("=")[1];
      res[key] = value;
    });
  }
  return res;
};
```

# 工具库

## cloneDeep

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

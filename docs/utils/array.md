## 数组移动

```js
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
```

## 数组去重

```js
function unique(arr) {
  let newArr = [];
  let map = new Map();
  arr.forEach((item) => {
    if (!map.has(item)) {
      map.set(item, true);
      newArr.push(item);
    }
  });
  return newArr;
}
```

<span style="color:#262626; font-weight: bold;">更详细的关于数组去重 → <a>地址</a></span>

## 数组对象去重

```js
// 原理同上, 但需要数组对象里面的一个唯一属性
function unique(arr, id) {
  let newArr = [];
  let map = new Map();
  arr.forEach((item) => {
    if (!map.has(item[id])) {
      map.set[(item[id], true)];
      newArr.push(item);
    }
  });
  return newArr;
}
```

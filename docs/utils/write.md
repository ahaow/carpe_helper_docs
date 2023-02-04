# 手写系列

<!-- 具体地址: [codepen](https://github.com/ahaow/codepen/tree/main/%E6%89%8B%E5%86%99%E7%B3%BB%E5%88%97) -->

## 数组相关

### 数组扁平化

**一级扁平化**

方法 1:

```js
function flatten1(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach((n) => {
        newArr.push(n);
      });
    } else {
      newArr.push(item);
    }
  });
  return newArr;
}
```

方法 2:

```js
function flatten2(arr) {
  let newArr = [];
  arr.forEach((item) => {
    newArr = newArr.concat(item);
  });
  return newArr;
}
```

**彻底扁平化(递归)**

方法 1:

```js
function flattenDeep1(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      const flattenItem = flattenDeep1(item);
      flattenItem.forEach((n) => {
        newArr.push(n);
      });
    } else {
      newArr.push(item);
    }
  });
  return newArr;
}
```

方法 2:

```js
function flattenDeep2(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      let flattenItem = flattenDeep2(item);
      newArr = newArr.concat(flattenItem);
    } else {
      newArr = newArr.concat(item);
    }
  });
  return newArr;
}
```

### 数组去重

```js
let arr = [
  1,
  1,
  "1",
  "1",
  true,
  true,
  "true",
  {},
  {},
  "{}",
  null,
  null,
  undefined,
  undefined,
];
```

**利用 Set**

```js
function unique1(arr) {
  return Array.from(new Set(arr));
}
```

**利用 Map 或者 Object**

```js
function unique2(arr) {
  let newArr = [];
  let map = new Map();
  arr.forEach((item) => {
    if (!map.has(item)) {
      newArr.push(item);
      map.set(item, true);
    }
  });
  return newArr;
}
```

注意: Object 有问题，无法判断 1 和 "1", {}, {}, 不建议使用

**利用: indexOf 或者 includes**

```js
function unique4(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (newArr.indexOf(item) == -1) {
      newArr.push(item);
    }
  });
  return newArr;
}

function unique5(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (!newArr.includes(item)) {
      newArr.push(item);
    }
  });
  return newArr;
}
```

**利用 filter 返回符合条件的集合**

```js
function unique6(arr) {
  let newArr = arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
  return newArr;
}
```

### 数组转化为树结构

```js
const arr = [
  { id: 1, name: "部门A", parentId: 0 },
  { id: 2, name: "部门B", parentId: 1 },
  { id: 3, name: "部门C", parentId: 1 },
  { id: 4, name: "部门D", parentId: 2 },
  { id: 5, name: "部门E", parentId: 2 },
  { id: 6, name: "部门F", parentId: 3 },
];

function arrayToTree(arr) {
  let idToTreeNode = new Map();
  let root = null;

  arr.forEach((item) => {
    const { id, name, parentId } = item;
    const treeNode = { id, name };
    // id 和 treeNode的映射
    idToTreeNode.set(id, treeNode);

    const parentNode = idToTreeNode.get(parentId);
    if (parentNode) {
      if (parentNode.children == null) parentNode.children = [];
      parentNode.children.push(treeNode);
    }
    if (parentId == 0) {
      root = treeNode;
    }
  });
  return root;
}

console.log(arrayToTree(arr));
```

### 树结构转化为数组

```js
const root = {
  id: 1,
  name: "部门A",
  children: [
    {
      id: 2,
      name: "部门B",
      children: [
        {
          id: 4,
          name: "部门D",
        },
        {
          id: 5,
          name: "部门E",
        },
      ],
    },
    {
      id: 3,
      name: "部门C",
      children: [
        {
          id: 6,
          name: "部门F",
        },
      ],
    },
  ],
};

function treeToArray(tree) {
  let nodeToParent = new Map();
  let arr = [];

  let queue = [];
  queue.unshift(tree); // 入栈

  while (queue.length > 0) {
    const currentNode = queue.pop(); // 出栈
    if (currentNode == null) break;

    const { id, name, children = [] } = currentNode;
    // 创建 item, arr并push进去
    const parentNode = nodeToParent.get(currentNode);
    const parentId = parentNode?.id || 0;
    const item = { id, name, parentId };
    arr.push(item);

    children.forEach((child) => {
      nodeToParent.set(child, currentNode);
      queue.unshift(child);
    });
  }
  return arr;
}

console.log(treeToArray(root));
```

## Function 相关

### bind

```js
Function.prototype.myBind = function (context) {
  let self = this;
  let args = [...arguments].slice(1);
  let fNOP = function () {};
  let fBound = function () {
    let bindArgs = [...arguments].slice(0);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};

function person() {
  console.log(this.name, arguments);
}
let obj = {
  name: "carpe",
};
let fn = person.myBind(obj, 1, 2, 3);
fn();
```

### call

```js
Function.prototype.myCall3 = function (context) {
  // 1. 如果context传入null或者undefined, 则设置为window
  context = context ? Object(context) : window;
  // 2. 绑定this
  context.fn = this;
  // 3. 处理args
  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  }
  // 4. 执行args
  let result = eval(`context.fn(${args})`);
  // 5. 删除fn
  delete context.fn;
  return result;
};

Function.prototype.myCall6 = function (context) {
  context = context ? Object(context) : window;
  context.fn = this;
  let args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};

let obj = {
  name: "carpe",
};
function person() {
  console.log(this.name, arguments);
}
person.myCall3(obj, 1, 2, 3, 4);
person.myCall6(obj, 1, 2, 3, 4);
```

### apply

```js
Function.prototype.myApply6 = function (context, arr) {
  context = context ? Object(context) : window;
  context.fn = this;
  let result;
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
  }
  delete context.fn;
  return result;
};

let obj = {
  name: "carpe",
};
function person() {
  console.log(this.name, arguments);
}
person.myApply6(obj, [1, 2, 3, 4]);
```

### cloneDeep

> 深拷贝

```js
function isObject(source) {
  return typeof source === "object" && source != null && source != undefined;
}

function cloneDeep(source, map = new Map()) {
  if (!isObject(source)) return;

  if (map.has(source)) {
    return map.get(source);
  }

  let target = Array.isArray(source) ? [] : {};
  map.set(source, target);

  Reflect.ownKeys(source).forEach((key) => {
    if (isObject(source[key])) {
      target[key] = cloneDeep(source[key], map);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

let target = {
  str: "string",
  num: 123,
  arr: [1, 2, 3],
  obj: {
    a: "a",
    b: "c",
  },
  fn: function () {},
};

let clone = cloneDeep(target);
clone.arr = 66;
clone.obj = "object";

console.log(target);
console.log(clone);
```

### curry

> 柯里化，在计算机科学中，柯里化（Currying）是把接收多个参数的函数变成接收单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。

**函数柯里化的主要作用和特点就是参数复用、提前返回和延迟执行**

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
function add(a, b, c) {
  console.log(a, b, c, a + b + c);
}

let fn1 = curry(add);

let fn2 = fn1(1)(2);
fn2(3);
```

### debounce

> 防抖

```js
function debounce(fn, wait, immediate) {
  let timeout = null;
  return function (...args) {
    if (timeout != null) {
      clearTimeout(timeout);
    }

    if (!timeout && immediate) {
      fn.apply(this, args);
    }

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

function ajax() {
  console.log("ajax...");
}

const debounceAjax = debounce(ajax, 2000, true);

const btn = document.getElementById("btn");

btn.addEventListener("click", debounceAjax);
```

### throttle

> 节流

```js
function throttle(fn, wait) {
  let timeout = null;
  let last;
  return function (...args) {
    let now = +new Date();
    if (last && now - last < wait) {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, wait);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
}

function ajax() {
  console.log("ajax...");
}

const throttleAjax = throttle(ajax, 2000);

const btn = document.getElementById("btn");

btn.addEventListener("click", throttleAjax);
```

### new

```js
function _new() {
  // 1. 获取构造函数
  let _constructor = [].shift.call(arguments);
  // 2. 创建一个空对象
  let obj = new Object();
  // 3. 将构造函数的原型挂载到对象上
  obj.__proto__ = _constructor.prototype;

  // const obj = Object.create(constructor.prototype);
  // 等价于
  // const obj = new Object();
  // obj.__proto__ = _constructor.prototype;

  // 4. 将构造函数的实例挂载到对象上
  let result = _constructor.apply(obj, arguments);
  // 5. 优先返回
  return result instanceof Object ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
let p1 = _new(Person, "carpe", 28);
console.log(p1);
```

**关于第五步的补充**

1. 如果构造函数没有显式`return`，（通常情况）那么`p1`就是新创建的对象`obj`
2. 如果构造函数返回的不是一个对象，比如 1、"abc"、那么`p1`还是新创建的对象`obj`

```js
function Person() {
  return 1;
}
```

3. 如果构造函数显式返回了一个对象，比如 `{}` 、 `function() {}`, 那么 `p1` 就不是新创建的对象`obj`了, 而是显式`return`的这个对象

```js
function Person() {
  // 函数也是对象
  return function () {};
}
```

4. so 在 `_new` 函数最后一句代码是:

```js
return result instanceof Object ? res : obj;
```

5. 注意: 模拟实现的函数`_new`传入的参数只能是构造函数，不能是类

```js
class Animal {}
_new(Animal);

// 会报错：Class constructor Animal cannot be invoked without 'new'// 类只能通过new来创建
```

### instanceof

```js
function _instanceof(L, R) {
  // L 代表实例, R 代表构造函数
  let C = R.prototype;
  L = L.__proto__;
  while (true) {
    if (L == null) {
      return false;
    }
    if (C === L) {
      return true;
    }
    L = L.__proto__;
  }
}
console.log(_instanceof(p1, Person));
```

### extends

> js 的完美继承是寄生组合继承

```js
function Parent(name) {
  this.name = name;
  this.sayName = function () {
    console.log(this.name);
  };
}
Parent.prototype.age = 20;
Parent.prototype.sayAge = function () {
  console.log(this.age);
};

function Child(name) {
  Parent.call(this, name);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### urlParams

```js
const urlParams = (url) => {
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

## 业务

### setTimeout 实现 setInterval

```js
let timeWorker = {};

function customInterval(fn, time) {
  // 定义一个key, 来标识此定时器
  let key = Symbol();
  // 定义一个递归函数，持续调用定时器
  function execute(fn, time) {
    timeWorker[key] = setTimeout(() => {
      fn();
      execute(fn, time);
    }, time);
  }
  execute(fn, time);
  return key;
}

function customClearInterval(key) {
  if (key in timeWorker) {
    clearTimeout(timeWorker[key]);
    delete timeWorker[key];
  }
}

let time1 = costomInterval(() => {
  console.log(111);
}, 1000);

console.log("time1", time1, timeWorker);
```

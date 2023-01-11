# 基础

## Object.defienProperty、Proxy 区别

### proxy 对比 Object.defineProperty 的优点

#### proxy 的优点

1. Proxy 可以直接监听对象而非属性
2. Proxy 可以直接监听数组的变化
3. Proxy 有多达 13 种拦截方法，不限于 apply，ownKeys， deleteProperty，has 等是 Object.defineProperty 不具备的
4. Proxy 是 ES6 新标准

### Objeect.defineProperty 的优点

1. 兼容好，支持 IE9

### Object.defineProperty 的缺点

1. 无法对数组进行监听，采用的是对数组的方法重写 (push,pop,shift,unshift 等等)，对此进行双向绑定和数据监听的操作
2. 效率好，这主要是因为对多层数据进行一次性的递归操作，如果数据很多或者是很深层次，这样性能非常差
3. 因为局限性，无法对新加、删除的数据进行监听，所以使用在 Vue2 中要使用$set 进行手动添加

- `Object.defineProperty()`递归遍历所有对象的所有属性，当数据层级较深时，会造成性能影响
- `Object.defineProperty()`只能作用在对象上，不能作用在数组上
- `Object.defineProperty()`只能监听定义时的属性，不能监听新增属性
- 由于`Object.defineProperty()`不能作用于数组, vue2 选择通过重写数组方法原型的方式对数组数据进行监听，但是仍然无法监听数组索引的变化和长度的变更

### Vue3 中双向绑定，使用 Proxy 和 Reflect 进行双向绑定

优点： proxy 可以对对象，数组进行拦截和监听

缺点：proxy 会发出多次 get/set 响应

解决方法：

1. 使用类似于`debounce`的操作，对其进行优化，使其值响应一次
2. vue3 解决方式，判断 key 是否是 target 的自身属性，以及 value 是否和 `target[key]` 相等，可以避免多余的 set/get 操作

**Proxy 只能代理一层，无法深度监听**

1. 使用深度递归，对每一层进行监听，巧妙的使用 `Reflect.get()`会返回对象内层结构的特性（下一层），判断下一层是否还是对象，并且使用深度递归操作，但是在性能上又很大的影响
2. 使用 weakMap, 使用两个 weakMap 来保存原始数据和可响应数据， 访问数据时会从保存的数库中查找，如果没有再对其进行 proxy 操作

### Object.defienProperty 实现响应式

```js
// 触发更新视图
function updateView() {
  console.log("视图更新");
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向 oldArrayProperty，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
["push", "pop", "unshift", "shift", "splice"].forEach((methodName) => {
  arrProto[methodName] = function () {
    updateView(); // 触发视图更新
    oldArrayProperty[methodName].call(this, ...arguments);
    // Array.prototype.push.call(this, ...arguments)
  };
});

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
  // 深度监听
  observer(value);
  // 核心 API
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        // 深度监听
        observer(newValue);

        // 设置新值
        // 注意, value 一直在闭包中, 此处设置完之后, 再 get 时也是会获取最新的值
        value = newValue;

        // 触发更新视图
        updateView();
      }
    },
  });
}

// 监听对象属性
function observer(target) {
  if (typeof target !== "object" || target == null) {
    // 不是对象或者数组
    return target;
  }

  if (Array.isArray(target)) {
    target.__proto__ = arrProto;
  }

  // 重新定义各个属性（for in 也可以遍历数组）
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}

// 准备数据
const data = {
  name: "zhangsan",
  age: 20,
  info: {
    address: "北京", // 需要深度监听
  },
  nums: [10, 20, 30],
};

// 监听数据
observer(data);

// 测试
data.name = "lisi";
data.age = 21;
console.log("age", data.age);
data.x = "100"; // 新增属性，监听不到 —— 所以有 Vue.set
delete data.name; // 删除属性，监听不到 —— 所有已 Vue.delete
data.info.address = "上海"; // 深度监听
```

### Proxy 实现响应式

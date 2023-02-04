## js-code

### set, WeakSet

> set 对象允许你存储任何类型的唯一值(也是不重复的值的集合)，无论是基础对象还是引用对象

Set 有`add`, `has`,`delete`,`size`, `clear`, `keys`, `values`, `forEach`, `entries`等属性和方法

WeakSet 只有`add`, `has`, `delete`方法

#### 区别

1. WeakSet 只有 3 个方法, Set 则有多个方法
2. WeakSet 的成员只能是对象，不能有其他值，Set 的成员可以是任意值

```js
let set = new Set([1, "2", {}, {}, function () {}, 3, null, undefined]);

let ws = new WeakSet();
// ws.add(1)  Invalid value used in weak set
ws.add({});
```

3. WeakSet 中的对象都是弱引用, 即垃圾回收机制不考虑 WeakSet 对该对象的引用, 也就是说如果其他对象不再引用该对象, 那么垃圾回收机制会自动回收该对象所占用的内存，不会考虑对象还在 WeakSet 中（核心）

```js
let obj = {
  name: "carpe",
};
let ws = new WeakSet();
ws.add(obj);

console.log(ws);
console.log(ws.has(obj)); // true

obj = null;
console.log(ws); // 有值，仅仅是因为垃圾回收机制还没有执行
console.log(ws.has(obj)); // false
```

#### 为什么 WeakSet 没有 size, forEach, keys, values, entries 方法

因为 WeakSet 是弱引用, 随时都会被垃圾回收掉, 但具体回收时间是不确定的, 所有不支持

#### WeakSet 使用场景

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="wrap">
      <button id="btn">确认</button>
    </div>
    <script>
      const wrap = document.getElementById("wrap");
      const btn = document.getElementById("btn");
      const disableElemenets = new WeakSet();
      disableElemenets.add(btn);

      btn.addEventListener("click", () => {
        wrap.removeChild(btn);
      });
    </script>
  </body>
</html>
```

### Map 和 WeakMap

#### Map

`Map`类似于对象, 但是键名不限于字符串, `Object`结构提供于`键-值`, `Map`结构提供于`值-值`

```js
const btn = document.getElementById("btn");
const map = new Map();
map.set(btn, "btn-map");
console.log(map.get(btn));
console.log(map);
```

##### Map 特点

1. `Map`默认情况不包括任何键, 所有的键都是自己添加进去的, 不同于`Object`原型链上有一些默认的键
2. `Map`的键可以是任何数据类型, 连函数都可以
3. `Map`的键值个数可以通过`size`轻松获得, `Object`需要手动计算
4. `Map`在频繁增删键值对的场景下性能要比`Object`

##### 什么时候用 Map

1. 要添加的键值名和 Object 上的默认键值名冲突，又不想改名时，用 Map
2. 需要 String 和 Symbol 以外的数据类型做键值时，用 Map
3. 键值对很多，有需要计算数量时，用 Map
4. 需要频繁增删键值对时，用 Map

##### Map 的实例属性和方法

**实例属性**

`set`, `get`, `has`, `delete`, `clear`

**遍历方法**

`entries`, `keys`, `values`, `forEach`

#### WeakMap

##### WeakMap 和 Map 区别

1. WeakMap 只能将对象作为键名
2. WeakMap 的键名引用的对象是弱引用
3. 不可遍历

关于强引用、弱引用：[](https://github.com/ahaow/knowledge/issues/5)

##### 使用场景

**DOM 节点元数据**

因为 weakMap 不会影响垃圾回收，所以可以用来关联元数据

```js
const map = new Map();
const btn = document.getElementById("btn");
// 给这个节点关联一些元数据
map.set(btn, { disabled: true });
document.body.removeChild(btn);
// 当上面代码执行后，登录按钮从DOM树中被删除了，但由于 Map 对节点对象是强引用关系，仍然保存着对按钮的引用，所以会引起内存泄漏
```

```js
const wm = new WeakMap();
const btn = document.getElementById("btn");
wm.set(btn, { disabled: true });
document.body.removeChild(btn);
```

## setTimeout 模拟 setInterval

### 为什么要使用 setTimeout 实现 setInterval

setInterval 的作用就是每隔一段指定时间执行一个函数，但是执行不是真的到了时间立即执行

**它真正的作用是每隔一段时间将事件添加到事件队列中去**，只有当 当前的执行栈为空的时候，才能去事件列表中取出事件执行

所以就有可能会出现这样的情况： **就是当前执行栈执行的时间很长，导致事件队列中累积了多个定时器加入的事件，当执行栈结束的时候，这些事件会依次执行，因此就不能到间隔一段时间执行的效果**

### setInterval 存在的问题（案例）

```js
let startTime = new Date().getTime();
let count = 0;

setInterval(() => {
  count++;
  console.log(
    `与原设定的间隔时差了${
      new Date().getTime() - (startTime + count * 1000)
    }毫秒`
  );
}, 1000);
```

```js
let startTime = new Date().getTime();
let count = 0;

// 增加一个耗时任务
setInterval(() => {
  let i = 0;
  while (i++ < 1000000000);
}, 0);

setInterval(() => {
  count++;
  console.log(
    `与原设定的间隔时差了${
      new Date().getTime() - (startTime + count * 1000)
    }毫秒`
  );
}, 1000);
```

**setInterval**的缺点，也就显而易见了：

1. 使用`setInterval`时，某些间隔会被跳过（如果上一次执行代码没有执行，那么这次的执行代码将不会被放入队列，会被跳过）
2. 可能多个定时器会连续执行（上一次代码在队列中等待还没有被执行，然后定时器又添加第二次代码，第一次代码等待时间和执行时间刚好等于第二次代码执行）

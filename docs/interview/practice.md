# 实践篇

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

### setTimeout 模拟 setInterval (代码)

```js
let timeWorker = {};
function customInterval(fn, time) {
  // 定义一个key，来标识此定时器
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

let startTime = new Date().getTime();
let count = 0;

// 增加一个耗时任务
customInterval(() => {
  let i = 0;
  while (i++ < 1000000000);
}, 0);

customInterval(() => {
  count++;
  console.log(
    `与原设定的间隔时差了${
      new Date().getTime() - (startTime + count * 1000)
    }毫秒`
  );
}, 1000);
```

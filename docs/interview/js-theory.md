## 首页

首页...

### 浏览器和nodejs的事件循环有什么区别

#### 单线程和异步

1. JS是单线程的（无论浏览器还是nodejs）
2. 浏览器中JS执行和DOM渲染共用一个线程
3. 异步是单线程解决方案

#### 浏览器异步（宏任务和微任务）

1. 宏任务就是例如 setTimeout setInterval 网络请求（ajax）
2. 微任务就是 promise async/await Mutationobserver(不常用)
3. 微任务在下一轮DOM渲染之前执行，然后再执行宏任务

```js
console.log('start')
setTimeout(() => {
    console.log('timeout')
})
Promise.resolve().then(() => {
    console.log('promise then')
})
console.log('end')

// EventLoop

// MarcoTask Queue 宏任务队列
// setTimeout(() => {
//     console.log('timeout')
// })

// MicroTask Queue 微任务队列
// Promise.resolve().then(() => {
//     console.log('promise then')
// })

```

#### nodejs异步

1. nodejs同样也是单线程, 也需要异步
2. 异步任务也分： 宏 + 微
3. 但是它的宏任务和微任务分不同类型和优先级

#### nodejs EventLoop

1. 执行同步代码
2. 执行微任务（process.nextTick优先级更高）
3. 按顺序执行6个类型的宏任务

### 浏览器和Node中EventLoop的区别

#### 1. 浏览器的EventLoop

1. 一个函数执行栈, 一个微任务队列, 一个时间队列
2. 宏任务与微任务

**宏任务: macroTask 异步回调会进入tasks**

1. setTimeout
2. setInterval
3. setImmediate(Node)
4. requestAnimationFrame(浏览器)
5. I/O
6. UI rendering

**微任务: micarTask另一些异步任务**

1. process.nextTick(Node)
2. promise.then()
3. Object.observe
4. Mutation.observer

执行顺序: 执行栈 > 微任务 > 宏任务

#### 2. NodeJs中的eventloop

执行机制：
1. times(计时期)
2. I/O callbacks处理流、网络、tcp错误callback
3. idle、prepare node内部使用
4. poll轮询，执行poll中的I/O队列，检查定时器是否到时
5. check(检查)存放setImmediate回调
6. close callbacks关闭回调 socket.on('close')

执行过程：

1. 执行js中的同步代码
2. 执行microtask微任务，先执行NextTickQueue中的所有任务，在执行Other Microtask Queue中的所有任务。
3. 开始执行macrotask宏任务，共6个阶段，从第1个阶段开始，执行相应的每个阶段macrotask中的所有任务，注意：这里是所有每个阶段宏任务队列的所有任务，在浏览器中的eventloop只取宏任务中的第一个任务出来执行，每一个阶段的macrotask任务执行完毕后，开始执行微任务，也就是步骤2
4. Times queue -> 步骤2 -> I/O queue -> 步骤2 -> check queue -> 步骤2 -> close callback queue -> 步骤2 -> timers queue
这就是node的eventloop的简化版

#### 浏览器和Node中的eventloop的区别

1. 实现机制不同
2. nodejs可以理解成4个宏任务和2个微任务队列，但执行宏任务时，有6个步骤
3. Nodejs中，先执行全局的js代码，执行完同步代码调用栈，清空后，先从微任务队列NextTick queue中依次取出所有的任务，放入调用栈执行；再从微任务队列中的other microtask queue中依次取出所有任务放入调用栈执行。然后开始宏任务的6个阶段，每个阶段都将该宏任务队列中的所有任务都取出来执行，每个宏任务阶段执行完毕后，开始执行微任务，在开始执行下一阶段的宏任务，以此构建事件循环。
4. Microtask包括：setTimeout\setInterval\setImmediate\requestAnimation\I/O\UI rendering
5. Microtask包括：process.nextTick(Node)\promise.then()\Object.observe\Mutation.observer

### 常见的内存泄漏

```md
1. 不正当的闭包
2. 隐式全局变量
3. 脱离DOM引用
4. 遗忘的定时器: setTimeout setInterval
5. 遗忘的事件监听器 addEventListener('scroll') removeEventListener('scroll')
6. 遗忘的监听器模式(Event Bus)
7. 注意Set, Map等强引用类型
```

### js垃圾回收机制

<h5 style="margin: 12px 0; font-size: 16px;">引用计算 和 标记清除</h5>

##### 1. 引用计算

```js
对象有没有被其他所引用, 如果没有指向该对象（零引用）, 对象将会被垃圾回收。
它的策略就是跟踪记录每个变量值被使用的次数.

1. 当声明一个变量，并且将引用类型的值赋值给这个变量，那么这个值的引用次数为1
2. 如果同一个值又被赋值到另一个变量上面，那么引用次数+1
3. 如果该变量的值被其他值覆盖，则-1
4. 直到该值的引用次数为0的时候，说明没有变量使用，这个值也没法被访问了，垃圾回收器执行时，会清除掉该值
```
**问题**

循环引用

```js
function test() {
    let A = new Object()
    let B = new Object()
    A.a = B
    B.a = A
}
```

##### 优点

1. 清晰很多，当引用次数为0的时候，就会被清除掉
2. **标记清除**需要每隔一段时间进行一次，在程序中线程就必须要暂停去执行一段时间的`GC`
3. **标记清除**需要遍历`堆`里的活动和非活动来清除, 而**引用计数**只需要计算引用次数就行

##### 缺点

1. 需要一个计算器，计算器占很大的空间，因为无法确定引用数量的上限
2. 无法解决循环引用无法回收的问题


#### 标记清除

`标记清除(Mark-Sweep)`, 目前在`js`引擎中最常用的算法

此算法分为`标记`和`清除`两个阶段：

1. 标记阶段为所有的活动对象做上标记
2. 清除阶段则没有标记（也就是非活动对象）销毁

引擎在执行`GC`时，需要从出发点遍历内存中的所有的对象去打标记，而这个出发点很多，可以称为一组`根`对象，
而所有的`根`对象，其实在浏览器环境中包括又不止于`window对象`, `文档DOM树`等

1. 垃圾收集器在运行时会给内存中的所有的对象都加上一个标记, 假设内存中所有对象都是垃圾，全标记为0
2. 然后从各个`根`对象开始遍历, 销毁并回收它们所占用的内存空间
3. 最后把所有内存中的对象标记修改为0,等待下一轮垃圾回收

##### 优点

打标记就是“打”与“不打”两种情况，这使得一位二进制位（0和1）就可以为其标记，非常简单

##### 缺点

1. 在清除后，剩余的对象内存位置是不变的，也就会导致空闲内存空间不连续，出现了`内存碎片`
2. 并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表, 这就牵扯到了内存分配到问题


## 数组相关

### 类数组

<div style="margin-top:24px;"></div>

类数组：是有一个 `length` 属性 和 从零开始索引的属性， 但是没有Array的内置方法，比如 `forEach` 和 `map`

特征：

1. 是一个普通对象
2. 必须有length属性，可以有非负整数索引
3. 本身不具备数组所具备的方法

常见类数组：

1. arguments
2. DOM相关，NodeList, HTMLCollection, DOMTokenList

奇特：

字符串：具备类数组的所有特性，但是类数组一般指对象

#### 数组 和 类数组的区别

|               | 数组              | 类数组             |
| ------------- | ----------------- | ------------------ |
| toString返回  | [object Array]    | [object Object]    |
| instanceof    | Array             | Object             |
| constructor   | [Function: Array] | [Function: Object] |
| Array.isArray | true              | false              |




#### 代码判断类数组

```js
function isArrayLikeObject(arr) {
    if (arr == null || typeof arr !== "object") return false
    const lengthMaxValue = Math.pow(2, 53) -1;;
    if (!Object.prototype.hasOwnProperty.call(arr, "length"))
        return false;

    if (typeof arr.length != "number") return false;
    if (!isFinite(arr.length)) return false;
    if (Array === arr.constructor) return false;

    if (arr.length >= 0 && arr.length < lengthMaxValue) {
        return true
    } else {
        return false
    }
}
```

#### 类数组如何转为数组

* slice, concat
* Array.from
* Array.apply
* 复制，遍历


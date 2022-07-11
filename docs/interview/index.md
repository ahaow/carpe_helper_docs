# 首页

首页...

## 浏览器和nodejs的事件循环有什么区别

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

## 浏览器和Node中EventLoop的区别

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
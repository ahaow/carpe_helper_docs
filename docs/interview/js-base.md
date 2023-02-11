## 原型到原型链

### prototype

在 js 中，每个函数对象都有一个`prototype`, 这个属性指向函数的原型对象，使用原型对象的好处就是所有对象的实例共享它所包含的属性和方法

```js
function Person() {}
Person.prototype.name = 'carpe'

let p1 = new Person()
let p2 = new Person()

console.log(p1.name, p1.name)
```

![prototype](https://camo.githubusercontent.com/02789d6806b75d34b2017021f58efa3aa7a2ee6be8a0c05fb3293438884b9ec0/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065312e706e67)

### `__proto__`

每个`实例`对象(除了 null)都具有一个属性叫：`__proto__`， 这个属性会指向该对象的原型

```js
console.log(p1.__proto__ === Person.prototype) // true
```

![__proto__](https://camo.githubusercontent.com/3dde335faa15d03ffe3b907f6e5c2b5f4d2183caa4c47ac7486794bc407f663c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065322e706e67)

既然实例对象和构造函数都可以指向原型，那么原型是否有属性指向构造函数或者实例呢

### prototype 和 `__proto__` 区别

1. `prototype`是构造函数的属性
2. `__proto__`是每个实例都有的属性，指向其原型对象
3. 实例的`__proto__`与其构造函数的`prototype`指向的是同一个对象

### constuctor

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数倒是有的，这就要讲到第三个属性：constructor，每个原型都有一个 constructor 属性指向关联的构造函数。

```js
console.log(Person.prototype.constructor == Person)
```

![constuctor](https://camo.githubusercontent.com/0aaf005afda83d4e2fdd2bbe523df228b567a091317a2154181771b2706ea2ef/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065332e706e67)

### 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
function Person() {}
Person.prototype.name = 'carpe'
let p1 = new Person()

p1.name = '古尔丹'

console.log(p1.name) // 古尔丹
delete p1.name
console.log(p1.name) // carpe
```

当给实例对象添加了 `name` 属性，打印 name 时为`古尔丹`, 当删除 `name` 时 在实例里找不到 `name` 属性, 就回去实例的原型上面去找，也就是 `p1.__proto__`, 等同于 `Person.prototype` 上面去找, 则找到了 `carpe`

如果没有，原型的原型又是什么呢？

### 原型的原型

```js
console.log(Person.prototype.__proto__) // Object
```

![Object](https://camo.githubusercontent.com/ad0ee0e2594c1ac471bbb42321963c130f4fe1ef9ec70389c8ced54544d3fd6c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065342e706e67)

### 原型链

那 Object.prototype 的原型呢？

```js
console.log(Object.prototype.__proto__ === null) // true
```

null 表示“没有对象”，即该处不应该有值

所以 `Object.prototype.__proto__` 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

![null](https://camo.githubusercontent.com/9a69b0f03116884e80cf566f8542cf014a4dd043fce6ce030d615040461f4e5a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065352e706e67)

## 执行上下文

### 词法作用域和动态作用域

**作用域**： 就是指程序源代码中定义变量的区域

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限

js 采用了词法作用域（lexicai scoping）, 也就是静态作用域

#### 静态作用域与动态作用域

因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```js
var value = 1
function foo() {
    console.log(value)
}
function bar() {
    var value = 2
    foo()
}
bar()
```

**静态作用域** : 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

**动态作用域** : 执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

### 执行上下文栈

#### 可执行代码

js 的可执行代码(executable code)的类型有： 全局作用域，函数作用域，eval 作用域

当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，让我们用个更专业一点的说法，就叫做"执行上下文(execution context)"。

#### 执行上下文栈

函数多了去了，如何管理创建的那么多执行上下文呢？

所以 JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```js
ECStack = []
```

js 需要解释执行代码的时候，最开始遇到的就是全局代码，所以初始化的首先就会向执行栈压入一个全局上下文 `globalContext`, 并且只有当整个应用程序结束的时候，`ECStack`才会清空，所以在程序结束之前，`ECStack` 最底部永远有个 `globalContext`

```js
ECStack = [globalContext]
```

示例：

```js
function fun3() {
    console.log('fun3')
}
function fun2() {
    fun3()
}
function fun1() {
    fun2()
}
fun1()
```

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出

```js
// 伪代码

// fun1()
ECStack.push(<fun1> functionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(<fun2> functionContext);

// 擦，fun2还调用了fun3！
ECStack.push(<fun3> functionContext);

// fun3执行完毕
ECStack.pop();

// fun2执行完毕
ECStack.pop();

// fun1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

### 变量对象

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明

因为不同执行上下文的变量对象稍有不同，所以有区分于：全局上下文的变量对象和函数上下文的变量对象

#### 全局上下文

**全局对象**

全局对象是预定义的对象，作为 js 的全局函数和全局属性的占位符，通过使用全局对象，可以访问所有其他所有预定的对象，函数和属性

1. 可以通过 this 引用，在客户端 js 中，全局对象就是 window

```js
console.log(this)
```

2. 全局对象是由 Object 构造函数实例化的一个对象

```js
console.log(this instanceof Object)
```

3. 预定义了一堆函数和属性

```js
console.log(Math.random())
console.log(this.Math.random())
```

4. 作为全局变量的宿主

```js
var a = 1
console.log(this.a)
```

5. 客户端 js 中，全局对象有 window 属性指向自身

```js
var a = 1
console.log(window.a)

this.window.b = 2
console.log(this.b)
```

**总结** 全局上下文中的变量对象就是全局对象

#### 函数上下文

在函数上下文中，我们用活动对象来表示变量对象

活动对象是在进入函数上下文时被创建的，它通过函数的 arguments 属性初始化，arguments 属性值是 Arguments 对象

#### 函数上下文执行过程

执行上下文的代码会分为两个阶段进行处理： 分析和执行

1. 进入执行上下文
2. 代码执行

**进入执行上下文**

当进入执行上下文时，这时候还没有执行代码

变量对象会包括：

1. 函数的所有形参（如果是函数上下文）
    1. 由名称和对应值组成的一个变量对象的属性被创建
    2. 没有实参，属性值设置为 undefined
2. 函数声明
    1. 由名称和对应值（函数对象（function-object））组成一个变量对象的属性被创建
    2. 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
    1. 由名称和对应值（undefined）组成一个变量对象的属性被创建
    2. 如果变量名称跟已经声明的形参和函数相同，则变量声明不会干扰已经存在的这类属性

**示例**

```js
function foo(a) {
    var b = 2
    function c() {}
    var d = function () {}
    b = 3
}
foo(1)
```

在进入执行上下文后，这时候的 AO 是：

```js
AO = {
  arguments: {
    0: 1,
    lenght: 1
  }
  a: 1,
  b: undefiend,
  c: reference to function c() {},
  d: undefined
}
```

**代码执行**

在执行阶段，会顺序执行代码，根据代码，修改变量对象的值

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference to function c() {},
  d: reference to FunctionExpression "d"
}
```

#### 总结

1. 全局上下文的变量对象初始化是全局对象
2. 函数上下文的变量对象初始化只包括 Arguments 对象
3. 在进入执行上下文时会给变量添加形参，函数声明，变量声明等初始的属性值
4. 在代码执行阶段，会再次修改变量对象的属性值

### 作用域链

**当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级（词法层面上的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象**

这样由多个执行上下文的变量对象构成的链表就叫做作用域链

#### 函数创建

函数的作用域在函数定义的时候就决定了

因为函数有一个内部属性 `[[scope]]`，当函数创建的时候，就会保存所有的父变量对象到其中，可以理解 `[[scope]]` 就是所有父变量对象的层级链，但是注意：`[[scope]]` 并不代表完整的作用域链

**示例**

```js
function foo() {
    function bar() {}
}
```

函数创建时，各自的`[[scope]]`为：

```js
foo.[[scope]] = [
  globalContext.VO
]

bar.[[scope]] = [
  fooContext.AO,
  globalContext.VO
]
```

#### 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后， 就会将活动对象添加到作用域链的前端

这时候执行上下文的作用域链，我们命名为 Scope

```md
Scope = [AO].concat([[Scope]])
```

至此，作用域链创建完毕

#### 捋一捋

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```js
var scope = 'global scope'
function checkscope() {
    var scope2 = 'local scope'
    return scope2
}
checkscope()
```

执行过程如下：

1. checkscope 函数被创建，保存作用域链到内部属性`[[scope]]`

```js
checkscope.[[scope]] = {
  globalContext.VO
}
```

2. 执行 checkscope 函数， 创建 checkscope 函数执行上下文， checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [checkscopeContext, globalContext]
```

3. checkscope 函数并不立即执行, ，开始做准备工作，第一步： 复制函数 `[[scope]]`创建作用域链

```js
checkscopeContext = {
  Scope: checkscope.[[scope]]
}
```

4. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参，函数声明，变量声明

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0,
        },
        scope2: undefined,
    },
   Scope: checkscope.[[scope]],
}
```

5. 第三步：将活动对象压入 checkscope 作用域链顶端

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0,
        },
        scope2: undefined,
    },
    Scope: [AO, [[scope]]],
}
```

6. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0,
        },
        scope2: `local scope`,
    },
    Scope: [AO, [[scope]]],
}
```

7. 查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [globalContext]
```

## this 全面解析

### 5 种 this 绑定

#### 12312

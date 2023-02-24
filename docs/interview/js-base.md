## 原型到原型链

### prototype

在 js 中，每个函数对象都有一个`prototype`, 这个属性指向函数的原型对象，使用原型对象的好处就是所有对象的实例共享它所包含的属性和方法

```js
function Person() {}
Person.prototype.name = "carpe";

let p1 = new Person();
let p2 = new Person();

console.log(p1.name, p1.name);
```

![prototype](https://camo.githubusercontent.com/02789d6806b75d34b2017021f58efa3aa7a2ee6be8a0c05fb3293438884b9ec0/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065312e706e67)

### `__proto__`

每个`实例`对象(除了 null)都具有一个属性叫：`__proto__`， 这个属性会指向该对象的原型

```js
console.log(p1.__proto__ === Person.prototype); // true
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
console.log(Person.prototype.constructor == Person);
```

![constuctor](https://camo.githubusercontent.com/0aaf005afda83d4e2fdd2bbe523df228b567a091317a2154181771b2706ea2ef/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065332e706e67)

### 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
function Person() {}
Person.prototype.name = "carpe";
let p1 = new Person();

p1.name = "古尔丹";

console.log(p1.name); // 古尔丹
delete p1.name;
console.log(p1.name); // carpe
```

当给实例对象添加了 `name` 属性，打印 name 时为`古尔丹`, 当删除 `name` 时 在实例里找不到 `name` 属性, 就回去实例的原型上面去找，也就是 `p1.__proto__`, 等同于 `Person.prototype` 上面去找, 则找到了 `carpe`

如果没有，原型的原型又是什么呢？

### 原型的原型

```js
console.log(Person.prototype.__proto__); // Object
```

![Object](https://camo.githubusercontent.com/ad0ee0e2594c1ac471bbb42321963c130f4fe1ef9ec70389c8ced54544d3fd6c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065342e706e67)

### 原型链

那 Object.prototype 的原型呢？

```js
console.log(Object.prototype.__proto__ === null); // true
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
var value = 1;
function foo() {
  console.log(value);
}
function bar() {
  var value = 2;
  foo();
}
bar();
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
ECStack = [];
```

js 需要解释执行代码的时候，最开始遇到的就是全局代码，所以初始化的首先就会向执行栈压入一个全局上下文 `globalContext`, 并且只有当整个应用程序结束的时候，`ECStack`才会清空，所以在程序结束之前，`ECStack` 最底部永远有个 `globalContext`

```js
ECStack = [globalContext];
```

示例：

```js
function fun3() {
  console.log("fun3");
}
function fun2() {
  fun3();
}
function fun1() {
  fun2();
}
fun1();
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
console.log(this);
```

2. 全局对象是由 Object 构造函数实例化的一个对象

```js
console.log(this instanceof Object);
```

3. 预定义了一堆函数和属性

```js
console.log(Math.random());
console.log(this.Math.random());
```

4. 作为全局变量的宿主

```js
var a = 1;
console.log(this.a);
```

5. 客户端 js 中，全局对象有 window 属性指向自身

```js
var a = 1;
console.log(window.a);

this.window.b = 2;
console.log(this.b);
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
  var b = 2;
  function c() {}
  var d = function () {};
  b = 3;
}
foo(1);
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
var scope = "global scope";
function checkscope() {
  var scope2 = "local scope";
  return scope2;
}
checkscope();
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
ECStack = [checkscopeContext, globalContext];
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
};
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
};
```

7. 查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [globalContext];
```

## this 全面解析

### 5 种 this 绑定

`this`的绑定规则共有有下面五种：

1. 默认绑定（严格/非严格模式）
2. 隐式绑定
3. 显式绑定
4. new 绑定
5. 箭头绑定

#### 调用位置

调用位置就是函数在代码中**被调用的位置**(而不是声明的位置)

查找的方法：

- 分析调用栈：调用位置就是当前正在执行的函数的**前一个调用**中

```js
function baz() {
  // 当前调用栈是： baz
  // 因此，当前调用位置是全局作用域
  console.log("baz");
  bar(); // <-- bar的调用位置
}

function bar() {
  // 当前调用栈是 baz --> bar
  // 因此，当前调用栈位置在baz中
  console.log("bar");
  foo(); // <--foo 的调用位置
}

function foo() {
  // 当前调用栈是：baz --> bar --> foo
  // 因此，当前调用位置在bar中
  console.log("foo");
}

baz(); // <-- baz的调用位置
```

#### 绑定规则

##### 默认绑定

1. 独立函数调用，可以把默认绑定看作无法应用其他规则的默认规则，this 指向**全局对象**
2. 严格模式下，不能将全局对象用于默认绑定，this 会绑定到`undefiend`, 只有函数运行在非严格模式下，默认绑定才能绑定到全局对象，在严格模式下调用函数则不影响默认绑定

```js
function foo() {
  // 运行在严格模式下，this会绑定在undefined
  "use strict";
  console.log(this.a);
}

var a = 2;

foo(); //  TypeError: Cannot read properties of undefined (reading 'a')

// --------------------------------------------------

function foo() {
  console.log(this.a);
}
var a = 2;
(function () {
  "use strict";
  foo();
})();
```

##### 隐式绑定

当函数引用有**上下文对象**时，隐式绑定规则会把函数中的 this 绑定到这个上下文对象。

对象属性引用链中只有上一层或者说最后一层在调用中起作用

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};
obj.foo(); // 2
```

> 隐式丢失

被隐式绑定的函数特定情况下会丢失绑定对象，应用默认绑定，把 this 绑定到全局对象或者 undefined

```js
// 虽然bar是obj.foo的引用，但是实际上，它引用的foo函数本身
// bar()是一个不带任何修饰的函数调用，应用默认绑定

function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var bar = obj.foo; // 函数别名
var a = "global"; // a 是全局对象的属性
bar(); // "global"
```

参数传递就是隐式赋值，传入函数时也会被隐式赋值。回调函数丢失 this 绑定是非常常见的

```js
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  // fn其实就是引用的foo
  fn(); // <--调用位置
}

var obj = {
  a: 2,
  foo: foo,
};
var a = "global";
doFoo(obj.foo);
```

##### 显式绑定

通过`call(...)` 或者 `apply(...)`方法， 第一个参数是一个对象，在调用函数时将这个对象绑定到 this, 因为直接指定 this 的绑定对象，称为显式绑定

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
};
foo.call(obj); // 2. 调用foo时强制把foo的this绑定到obj
```

显式绑定也无法解决丢失绑定问题

解决方案：

- 1. 硬绑定

创建函数`bar()`，并在它的内部手动调用`foo.call(obj)`, 强制把 foo 的 this 绑定到了 obj

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

var bar = function () {
  foo.call(obj);
};

bar(); // 2
setTimeout(bar, 100); // 2

// 硬绑定的bar不可能再修改它的this
bar.call(window); // 2
```

典型应用场景是创建一个包裹函数，负责接收参数并返回值

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2,
};

var bar = function () {
  return foo.apply(obj, arguments);
};

var b = bar(3); // 2 3
console.log(b); // 5
```

- 2. API 调用的“上下文”

JS 许多内置函数提供一个可选参数，被称为“上下文”(context), 其作用和`bind(..)`一样，确保回调函数使用指定的 this, 这是函数实际上通过`call(..)` 和 `apply(..)`实际了显式绑定

```js
function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome",
};
var myArray = [1, 2, 3];
// 调用foo(...)时把this绑定到obj
myArray.forEach(foo, obj);
```

##### new 绑定

1. 在 js 中，`构造函数` 只是使用 `new` 操作符时被调用的 `普通` 函数，它们不属于某个类，也不会实例化一个类
2. 包括内置对象函数(比如`Number(..)`)在内的所有函数都可以用`new`来调用，这种函数调用被称为构造函数调用
3. 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”

使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面

- 创建一个新对象
- 这个新对象会被执行`[[Prototype]]`
- 这个新对象会绑定到函数调用的`this`
- 如果函数没有返回其他对象，那么`new`表达式中的函数调用会自动返回这个新对象

使用`new`来调用`foo(..)`时，会构造一个新对象并把它(`bar`)绑定到`foo(...)`

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

**手写一个 new 实现**

```js
function create() {
  // 创建一个空的对象
  var obj = new Object();
  // 获取构造函数，arguments中去除第一个参数
  Con = [].shift.call(arguments);
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  obj.__proto__ = Con.prototype;
  // 绑定 this 实现继承， obj 可以访问到构造函数中的属性
  let result = Con.apply(obj, arguments);
  // 优先返回构造函数返回的对象
  return result instanceof Object ? result : obj;
}
```

**代码原理解析**

1. 用`new Object()`的方式新建一个对象`obj`
2. 取出第一个参数，就是我们要传入的构造函数，此外因为 shift 会修改原数组，所以`arguments`会被去除第一个参数
3. 将`obj`的原型指向构造函数，这`obj`就可以访问构造函数原型中的属性
4. 使用`apply`，改变构造函数`this`的指向到新建的对象，这样`obj`就可以访问到构造函数中的属性
5. 返回`obj`

##### 绑定例外

**被忽略的 this**

把`null`或者`undefined`作为`this`的绑定对象传入`call`、`apply`或者`bind`， 这些值在调用时会被忽略，实际应用的是默认规则

下面两种情况下会传入`null`

- 使用`apply(...)`来“展开”一个数组，并当作参数传入一个函数
- `bind(..)`可以对参数进行柯里化（预先设置一些参数）

```js
function foo(a, b) {
  console.log("a:" + a + "，b:" + b);
}

// 把数组”展开“成参数
foo.apply(null, [2, 3]); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind(null, 2);
bar(3); // a:2，b:3
```

总是传入`null`来忽略 this 绑定可能产生一些副作用，如果某个函数确实使用`this`, 那默认绑定规则会把`this`绑定到全局对象中

> 更安全的 this

安全的做法就是传入一个特殊的对象（空对象），把`this`绑定到这个对象不会对你的程序产生任何副作用

js 中创建一个空对象最简单的方法就是`Object.create(null)`，这个和`{}`很像，但是并不会创建`Object.prototype`这个委托，所以比`{}`更空

```js
// 我们的空对象
var ø = Object.create(null);
```

##### 间接引用

间接引用下，调用这个函数会应用默认绑定规则， 间接引用最容易在赋值时发生

```js
function foo() {
  console.log(this.a);
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo()(
  // 3
  p.foo == o.ff
)(); // 2
```

##### 软绑定

- 硬绑定可以把 this 强制绑定到指定的对象（`new`除外），防止函数调用应用默认绑定规则，但是会降低函数的灵活性，使用**硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this**
- **如果给默认绑定指定一个全局对象和 undefined 以外的值，**那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力

##### this 词法

ES6 新增一个特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层（函数或者全局）作用域（词法作用域）来决定 this

### 箭头函数的 this

this 绑定一共有五种方式:

1. 默认绑定(严格/非严格模式)
2. 隐式绑定
3. 显式绑定
4. new 绑定
5. 箭头函数绑定

大部分情况下可以用一句话来概括：**this 总是指向调用该函数的对象**

但是对于箭头函数并不算这样，是根据外层（函数或者全局）作用域（**词法作用域**）来决定 this

对于箭头函数的 this 总结如下：

1. 箭头函数不绑定 this, 箭头函数的 this 相当于普通变量
2. 箭头函数的 this 寻值行为与普通变量相同，在作用域中逐级寻找
3. 箭头函数的 this 无法通过 bind, call, apply 来 直接修改(可以间接修改)
4. 无法改变作用域中 this 的指向，可以改变箭头函数的 this

[原文链接](https://github.com/yygmind/blog/issues/21)

### apply, call 实现

`call()`方法调用一个函数其具有一个指定的`this`值和分别地提供的参数(参数的列表)

`call()` 和 `apply()` 的区别于， `call()`方法接受的是**若干个参数的列表**，而`apply()`方法接受的是**一个包含多个参数的数组**

```js
var func = function (arg1, arg2) {};
func.call(this, arg1, arg2);
func.apply(this, [arg1, arg2]);
```

#### call 的模拟实现

```js
Function.prototype.myCall = function (context) {
  // 1. this参数可以传入 null 或者 undefiend， 此时 this 指向 window
  context = context ? Object(context) : window;
  // 2. 绑定this
  context.fn = this;
  // 3. 处理args
  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  }
  // 4 执行fn
  let result = eval(`context.fn(${args})`);
  // 5. 删除fn
  delete context.fn;
  return result; // this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
};
```

具体其他实现，查看手写

### bind 实现

`bind()`方法会创建一个新函数，当这个新函数被调用是，它的`this`值是传递给`bind()`的第一个参数，传入 bind 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数

bind 返回的绑定函数也能使用`new`操作符创建对象; 这种行为就像把原函数当成构造器，提供的`this`值被忽略，同时调用时的参数被提供给模拟函数

`bind`方法与`call / apply`最大的不同就是前者返回一个绑定上下文的函数，而后面两个则是直接执行了函数

**示例**

```js
var value = 2;
var foo = {
  value: 1,
};

function bar(name, age) {
  return {
    value: this.value,
    name: name,
    age: age,
  };
}

bar.call(foo, "Jack", 20);

var bindFoo1 = bar.bind(foo, "Carpe", 18);
bindFoo1(); // {value: 1, name: "Carpe", age: 18}

var bindFoo2 = bar.bind(foo, "Diem");
bindFoo2(20); // {value: 1, name: "Diem", age: 20}
```

上述可以看出`bind`有如下特征：

1. 可以指定`this`
2. 返回一个函数
3. 可以传入参数
4. 柯里化

#### 业务场景

```js
var nickname = "carpe";
function Person(name) {
  this.nickname = name;
  this.distractedGreeting = function () {
    setTimeout(function () {
      console.log("hello", this.nickname);
    }, 500);
  };
}

var person = new Person("kaiser");
person.distractedGreeting(); // hello carpe
```

这里输出的`nickname`是全局的，并不算我们创建的`person`时传入的参数，因为`setTimeout`在全局环境中执行, 所以`this`指向是`window`

这边把`setTimeout`换成异步回调也是一样的，比如接口请求回调

解决方案有下面两种

**解决方案 1：** 缓存`this`值

```js
var nickname = "carpe";
function Person(name) {
  this.nickname = name;
  var self = this;
  this.distractedGreeting = function () {
    setTimeout(function () {
      console.log("hello", self.nickname);
    }, 500);
  };
}
```

**解决方案 2：** 使用`bind`

```js
var nickname = "carpe";
function Person(name) {
  this.nickname = name;
  var self = this;
  this.distractedGreeting = function () {
    setTimeout(
      function () {
        console.log("hello", self.nickname);
      }.bind(this),
      500
    );
  };
}
```

**解决方案 3：** 使用箭头函数

#### 模拟实现

`bind()`四点特性：

1. 可以指定`this`
2. 返回一个函数
3. 可以传入参数
4. 柯里化

**第一步**

1. 针对第一点, 可以使用`call/apply`指定`this`
2. 针对第二点, 使用`return`返回一个函数

```js
Function.prototype.myBind = function (context) {
  var self = this; // this指向调用者
  return function () {
    // 实现第二点
    return self.apply(context); // 实现第一点
  };
};
```

**第二步**

3. 对于第三点，使用`arguments`获取参数数组并作为`self.apply()`的第二个参数
4. 对于第四点，获取返回函数的参数，然后同第三点的参数合并成一个参数数组，并作为`self.apply()`的第二个参数

```js
Function.prototype.myBind = function (context) {
  var self = this; // this指向调用者
  // 实现第三点，因为第一个参数是指定的this, 所以只截取第一个之后的参数
  var args = Array.prototype.slice.call(arguments, 1);

  return function () {
    // 实现第二点
    // 实现第四点，这是的arguments是指bind返回的函数传入的参数
    var bingArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs)); // 实现第一点
  };
};
```

**第三步**

`bind` 有以下一个特性

> 一个绑定函数也能使用 new 操作符创建对象: 这种行为就像把原函数当成构造器，提供的 this 值被忽略，同时调用时的参数被提供给模拟函数

```js
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    // 注释1
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs)
    );
  };
  // 注释2
  fBound.prototype = this.prototype;
  return fBound;
};
```

1. 注释 1：

   1. 当作为构造函数时，this 指向实例，此时 `this instanceof fBound` 结果为 `true`, 可以让实例获得来自绑定函数的值
   2. 当作为普通函数时，this 指向 `window`, 此时结果为 `false`, 将绑定函数的 this 指向 `context`

2. 注释 2： 修改返回函数的 `prototype` 为绑定函数的 `prototype`，实例就可以继承绑定函数的原型中的值

**第四步**

上面实现中 `fBound.prototype = this.prototype` 有一个缺点，直接修改 `fBound.prototype` 的时候，也会直接修改 `this.prototype`

并且调用 bind 的不是函数，这时候需要抛出异常

```js
// 第五版
Function.prototype.bind2 = function (context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

### new 实现

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例

**案例**

```js
function Car(color) {
  this.color = color;
}

Car.prototype.start = function () {
  console.log(this.color + "car start");
};
var car = new Car("black");
car.color; // black 访问构造函数里的属性

car.start(); // 访问原型里的属性
```

可以看出 `new` 创建的实例有以下两个特性

1. 访问到构造函数里的属性
2. 访问到原型里的属性

#### 模拟实现

当代码`new Foo(...)`执行时

1. 一个继承自`Foo.prototype`的新对象被创建
2. 使用指定的参数调用构造函数`Foo`, 并将`this`绑定到新创建的对象，`new Foo`等同于`new Foo()`, 也就是没有指定参数列表，`Foo`不带任何参数调用的情况
3. 由构造函数返回的对象就是`new`表达式的结果，如果构造函数没有显式返回一个对象，则返回步骤 1 创建的对象

#### 实现第一步

`new`返回一个新对象，通过`obj.__proto__ = Con.prototype`继承构造函数的原型，同时通过`Con.apply(obj, arguments)`调用父构造函数实现继承，获取构造函数上的属性

```js
function create() {
  // 创建一个空对象
  var obj = new Object();
  // 获取构造函数， arguments中去除第一个参数
  var Con = [].shift.call(arguments);
  // 链接到原型，obj可以访问到构造函数原型中的属性
  obj.__proto__ = Con.prototype;
  // 绑定 this 实现继承， obj可以访问到构造函数中的属性
  Con.apply(obj, arguments);
  // 返回对象
  return obj;
}
```

#### 实现第二步

关于构造函数返回值有如下三种情况：

- 返回一个对象
- 没有`return`，返回`undefined`
- 返回`undefined`以外的基本类型

**情况 1：** 返回一个对象

```js
function Car(color, name) {
  this.color = color;
  return {
    name: name,
  };
}
var car = new Car("red", "benzi");
car.color; // undefined
car.name; // benzi
```

实例 `car` 中只能访问到返回对象中的属性。

**情况 2：** 没有`return`，即返回`undefined`

```js
function Car(color, name) {
  this.color = color;
}
var car = new Car("red", "benzi");
car.color; // red
car.name; // undefined
```

实例`car`中只能返回到**构造函数中的属性**，和情况 1 完全相反

**情况 3：** 返回`undefined`以外的基本类型

```js
function Car(color, name) {
  this.color = color;
  return "new Car";
}
var car = new Car("red", "audi");
car.color; // red
car.name; // undefined
```

实例`car`中只能访问到**构造函数中的属性,**和情况 1 完全相反，结果相当于没有返回值

**所以**需要判断下返回的值是不是一个对象，如果是对象则返回这个对象，不然返回新创建的`obj`对象

```js
// 第二版
function create() {
  // 创建一个空的对象
  var obj = new Object(),
    // 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  obj.__proto__ = Con.prototype;
  // 绑定 this 实现继承，obj 可以访问到构造函数中的属性
  var ret = Con.apply(obj, arguments);
  // 优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj;
}
```

## 深拷贝原理

### 赋值，浅拷贝，深拷贝的区别

#### 赋值

赋值是将某一数值或对象赋给某个变量的过程

- 基本数据类型：赋值, 赋值之后两个变量互不影响
- 引用数据类型：赋址，两个变量具有相同的引用，指向同一个对象，相互之间有影响

**示例**

```js
let a = "carpe";
let b = a;
a = "hanzo";
console.log(a); // hanzo
console.log(b); // carpe

let obj1 = {
  name: "carpe",
  book: {
    title: "js",
    price: 45,
  },
};
let obj2 = obj1;

obj1.name = "hanzo";
obj1.book.price = 55;
console.log(obj1);
console.log(obj2);
```

通常在开发中并不希望改变变量 obj1 之后会影响到变量 obj2, 这时就需要用到浅拷贝和深拷贝

#### 浅拷贝 (Shallow Copy)

创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝. 如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象

[![pSvVc6g.png](https://s1.ax1x.com/2023/02/22/pSvVc6g.png)](https://imgse.com/i/pSvVc6g)

上图中，`SourceObject` 是原对象，其中包含基本类型属性 `field1` 和引用类型属性 `refObj`。浅拷贝之后基本类型数据 `field2` 和 `filed1` 是不同属性，互不影响。但引用类型 `refObj` 仍然是同一个，改变之后会对另一个对象产生影响。

可以理解浅拷贝只解决了第一层的问题，拷贝第一层的**基本类型值**, 以及第一层的**引用类型地址**

##### Object.assign()

`Object.assign()`方法用于将所有可枚举属性的值从一个或者多个源对象复制到目标对象, 它将返回目标对象

有些文章说`Object.assign()` 是深拷贝，其实这是不正确的

```js
let a = {
  name: "carpe",
  book: {
    price: 45,
  },
};

let b = Object.assign({}, a);
console.log(a, b);

a.name = "hanzo";
a.book.price = 666;

console.log(b.name); // carpe
console.log(b.book.price); // 666
```

##### 展开语法 Spread

```js
let a = {
  name: "carpe",
  book: {
    price: 45,
  },
};

let b = { ...a };
```

跟`Object.assign()`效果一样

##### Array.prototype.slice()

`slice()`返回一个新的数组对象, 这一对象是一个由 `begin` 和 `end` (不包括`end`) 决定的原数组的**浅拷贝**，原始数组不会被改变

```js
let a = [0, "1", [2, 3]];
let b = a.slice(0);

a[0] = 100;
a[2][1] = 222;

console.log("a", a); // [100, "1", [2, 222]]
console.log("b", b); // [0, "1", [2, 222]]
```

相应的还有`concat`都是浅拷贝

#### 深拷贝 (Deep Copy)

深拷贝会拷贝所有的属性，并拷贝属性指向的动态分配的内存. 当对象和它所引用的对象一起拷贝时即发生深拷贝. 深拷贝相比于浅拷贝速度慢并且花销大. 拷贝前后两个对象互不影响

[![pSvufJI.png](https://s1.ax1x.com/2023/02/22/pSvufJI.png)](https://imgse.com/i/pSvufJI)

##### JSON.parse(JSON.stringify(object))

```js
let a = {
  name: "carpe",
  book: {
    title: "genji & hanzo",
    price: 45,
  },
};

let b = JSON.parse(JSON.stringify(a));
a.name = "ahao";
a.book.price = 666;
console.log("a", a);
console.log("b", b);

let a = [0, "1", [2, 3]];
let b = JSON.parse(JSON.stringify(a.slice(1)));
console.log(b);
// ["1", [2, 3]]
a[1] = "99";
a[2][0] = 4;
console.log(a);
// [0, "99", [4, 3]]
console.log(b);
//  ["1", [2, 3]]
```

但是该方法有以下几个问题：

1. 会忽略`undefined`
2. 会忽略`symbol`
3. 不能序列化函数
4. 不能解决循环引用
5. 不能正确处理`new Date()`
6. 不能处理正则

- `undefined`, `symbol` 和 函数这三种情况，会直接忽略

```js
let obj = {
  name: "carpe",
  a: undefined,
  b: Symbol("666"),
  c: function () {},
};

let b = JSON.parse(JSON.stringify(obj));

console.log(obj); // {name: 'carpe', a: undefined, b: Symbol(666), c: ƒ}
console.log(b); // {name: 'carpe'}
```

- 循环引用下，会报错

```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};
obj.a = obj.b;
obj.b.c = obj.a;

let b = JSON.parse(JSON.stringify(obj));

console.log("b", b); // Uncaught TypeError: Converting circular structure to JSON
```

- `new Date`情况下，转换结果不正确

```js
new Date();
// Mon Dec 24 2018 10:59:14 GMT+0800 (China Standard Time)

JSON.stringify(new Date());
// ""2018-12-24T02:59:25.776Z""

JSON.parse(JSON.stringify(new Date()));
// "2018-12-24T02:59:41.523Z"
```

解决方法转成字符串或者时间戳就好了。

```js
// 木易杨
let date = new Date().valueOf();
// 1545620645915

JSON.stringify(date);
// "1545620673267"

JSON.parse(JSON.stringify(date));
// 1545620658688
```

- 正则情况下

```js
let obj = {
  name: "carpe",
  a: /'123'/,
};
console.log(obj);
// {name: "carpe", a: /'123'/}

let b = JSON.parse(JSON.stringify(obj));
console.log(b);
// {name: "carpe", a: {}}
```

##### 总结

| --     | 和原数据是否指向同一对象 | 第一层数据为基本数据类型 | 原数据中包含子对象       |
| ------ | ------------------------ | ------------------------ | ------------------------ |
| 赋值   | 是                       | 改变会使原数据一同改变   | 改变会使原数据一同改变   |
| 浅拷贝 | 否                       | 改变不会使原数据一同改变 | 改变会使原数据一同改变   |
| 深拷贝 | 否                       | 改变不会使原数据一同改变 | 改变不会使原数据一同改变 |

### Object.assign 原理及其实现

#### 浅拷贝 Object.assign

> Object.assign(target, ...sources)

其中 target 是目标对象，sources 是源对象，可以有多个，返回修改后的目标对象 target。

如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后来的源对象的属性将类似地覆盖早先的属性。

**浅拷贝就是拷贝第一层的基本类型值，以及第一层的引用类型地址**

`Object.assign()`中，`String` 类型和 `Symbol` 类型的属性都会被拷贝，而且不会跳过那些值为 `null` 或 `undefined` 的源对象。

```js
let a = {
  name: "carpe",
  age: 18,
};
let b = {
  b1: Symbol("b1"),
  b2: function () {},
  b3: null,
  b4: undefined,
};

let c = Object.assign(a, b);
console.log(c);

console.log(a === c); // true
```

#### Object.assign 模拟实现

1. 判断原生`Object`是否支持该函数，如果不存在的话创建一个函数`assign`, 并且使用`Object.defineProperty`将该函数绑定到`Object`上
2. 判断参数是否正确(目标对象不能为空, 我们可以直接设置{}传递进去，但必须设置值)
3. 使用`Object()`转成对象，并保存为 to, 最后返回这个对象 to
4. 使用`for..in`循环遍历出所有可枚举的自有属性, 并复制给新的目标对象(使用`hasOwnProperty`获取自有属性,即非原型链上的属性)

```js
if (typeof Object.assign2 != "function") {
  Object.defineProperty(Object, "assign2", {
    value: function (target) {
      "use strict";
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var to = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index];

        if (nextSource != null) {
          for (let nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    },
    writable: true,
    configurable: true,
  });
}
```

### 如何实现一个深拷贝

#### 1. 简单实现

深拷贝可以拆分为两部分：浅拷贝 + 递归， 浅拷贝时判断属性值是否是对象，如果是对象就进行递归操作

```js
function cloneDeep(source) {
  let target = {};
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] == "object") {
        target[key] = cloneDeep(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

#### 2. 拷贝数组

```js
function isObject(obj) {
  // 兼容数组，所以没有使用 Object.prototype.toString
  return typeof obj == "object" && obj != null;
}
```

```js
function cloneDeep(source) {
  if (!isObject(source)) return source; // 非对象返回自身

  let target = Array.isArray(source) ? [] : {};
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

#### 3. 循环引用

**使用哈希表**: 设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可.

```js
function cloneDeep(source, hash = new WeakMap()) {
  if (!isObject(source)) return source; // 非对象返回自身
  if (hash.has(source)) return hash.get(source); // 新增代码，查哈希表

  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target); // 新增代码，哈希表设值

  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key], hash); // 新增代码，传入哈希表
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

#### 4. 拷贝 Symbol

`Symbol`在`ES6`下才有，需要一些方法检测出`Symbol`类型

1. `Object.getOwnPropertySymbols(...)`
2. `Reflect.ownKeys(...)`

对于方法一可以查找一个给定对象的符号属性时返回一个 ?symbol 类型的数组。注意，每个初始化的对象都是没有自己的 symbol 属性的，因此这个数组可能为空，除非你已经在对象上设置了 symbol 属性

```js
var obj = {};
var a = Symbol("a"); // 创建新的symbol类型
var b = Symbol.for("b"); // 从全局的symbol注册?表设置和取得symbol

obj[a] = "localSymbol";
obj[b] = "globalSymbol";

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols.length); // 2
console.log(objectSymbols); // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0]); // Symbol(a)
```

对于方法二返回一个由目标对象自身的属性键组成的数组，它的返回值等同于`Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`

```js
Reflect.ownKeys({ z: 3, y: 2, x: 1 }); // [ "z", "y", "x" ]
Reflect.ownKeys([]); // ["length"]

var sym = Symbol.for("comet");
var sym2 = Symbol.for("meteor");
var obj = {
  [sym]: 0,
  str: 0,
  773: 0,
  0: 0,
  [sym2]: 0,
  "-1": 0,
  8: 0,
  "second str": 0,
};
Reflect.ownKeys(obj);
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// 注意顺序
// Indexes in numeric order,
// strings in insertion order,
// symbols in insertion order
```

#### 完整版本

```js
// 木易杨
function cloneDeep4(source, hash = new WeakMap()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source);
  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target);
  Reflect.ownKeys(source).forEach((key) => {
    // 改动
    if (isObject(source[key])) {
      target[key] = cloneDeep4(source[key], hash);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}
```

## 高阶函数

### 高阶函数浅析

高阶函数：`Higher-order-function`, 它的定义很简单，就是至少满足下列一个条件的函数：

- 接受一个或多个函数作为输入
- 输出一个函数

也就是说高阶函数是对其他函数进行操作的函数，可以将它们作为参数传递，**或者**是返回它们.

简单来说，高阶函数是一个接受函数作为参数传递将函数作为返回值输出的函数.

#### 函数作为参数传递

js 内置了一些高阶函数，`Array.prototype.map`, `Array.prototype.filter`, `Array.prototype.reduce`, 它们接受一个函数作为参数, 并应用这个函数到列表的每一个元素

##### Array.prototype.map

```js
let arr1 = [1, 2, 3, 4];
let arr2 = [];
for (let i = 0; i < arr1.length; i++) {
  arr2.push(arr1[i] * 2);
}

let arr3 = [1, 2, 3, 4];
let arr4 = arr3.map((item) => item * 2);
```

##### Array.prototype.filter

```js
const arr1 = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
const arr2 = [];
for (let i = 0; i < arr1.length; i++) {
  if (arr1.indexOf(arr1[i]) === i) {
    arr2.push(arr1[i]);
  }
}
console.log(arr2);
console.log(arr1);

const arr3 = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
const arr4 = arr3.filter((item, index) => {
  return arr3.indexOf(item) === index;
});
```

#### 函数作为返回值输出

就是返回一个函数

##### isType 函数

我们知道在判断类型的时候可以通过 Object.prototype.toString.call 来获取对应对象返回的字符串

```js
let isString = (obj) =>
  Object.prototype.toString.call(obj) === "[object String]";

let isArray = (obj) => Object.prototype.toString.call(obj) === "[object Array]";

let isNumber = (obj) =>
  Object.prototype.toString.call(obj) === "[object Number]";
```

```js
function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
}
console.log(isType("Array")([]));
console.log(isType("String")("123"));
```

### 柯里化

函数柯里化又叫部分求值

> 在数学和计算机科学中, 柯里化是一种将使用多个参数的函数转换成一系列使用一个参数的函数, 并且返回接受余下的参数而且返回结果的新函数的技术.

通俗来讲: 就是只传递给函数一部分参数来调用它，它返回一个新函数去处理剩下的参数

#### 实际应用

##### 1. 延迟计算

```js
const add = (...args) => args.reduce((a, b) => a + b);

function currying(func) {
  const args = [];
  return function result(...rest) {
    if (rest.length === 0) {
      return func(...args);
    } else {
      args.push(...rest);
      return result;
    }
  };
}

const sum = currying(add);

sum(1, 2)(3);
console.log(sum());
```

用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数, 上面的`currying`函数是一个简化写法, 判断传入的参数长度是否为 0, 若为 0 执行函数，否则收集参数

##### 2. 动态创建函数

[动态创建函数](https://github.com/yygmind/blog/issues/37)

##### 3. 参数复用

[参数复用](https://github.com/yygmind/blog/issues/37)

### 实现 currying 函数

可以理解所谓的柯里化函数，就是封装「一系列的处理步骤」，通过闭包将参数集中起来计算，最后再把需要处理的参数传进去

实现原理就是 「用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数」

```js
function currying(fn, length) {
  length = length || fn.length; // 注释1
  return function (...args) { // 注释2
    return args.length >= length // 注释3
      ? fn.apply(this, args) // 注释4
      : currying(fn.bind(this, ...args), length - args.length); // 注释5
  };
}
```

- 1. 第一次调用获取函数fn参数的长度, 后续调用获取fn剩余参数的长度
- 2. `currying`包裹之后返回一个新函数, 接受参数为`...args`
- 3. 新函数接收的参数长度是否大于等于fn剩余参数需要接收的长度
- 4. 满足要求, 执行fn函数, 传入新函数的参数
- 5. 不满足要求, 递归`currying`函数, 新的fn为`bind`返回的新函数(`bind`绑定了`...args`参数, 未执行), 新的length为fn剩余参数的长度


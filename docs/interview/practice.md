# 实践篇

## 下载普通文件与二进制流文件

### 通过文件地址直接下载

文件上传到资源服务器，后端只保存了文件地址，前端拿到后端返回的文件地址直接下载

**核心： 放置一个 a 标签，并写上 download 属性，在浏览器中打开点击下载**

```js
const link = document.createElement("a");
link.download = "xxx地址";
link.style.display = "none";
link.href = "文件地址";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

### 二进制流文件下载

文件就存在后端服务器上（通常是临时根据前端参数动态生成，用完就删）, 后端读取文件后向前端返回文件的二进制流

```js
Axios({
  method: "GET",
  url: url,
  responseType: "blob",
}).then((res) => {
  const link = document.createElement("a");
  const blob = new Blob([res.data], {
    type: "application/vnd.ms-excel",
  });
  const href = window.URL.createObjectURL(blob);
  link.download = "name";
  link.href = href;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(href);
});
```

## 前端需要掌握的设计模式

设计模式说白了就是「封装变化」，比如「创建型」封装了创建对象的变化过程，「结构型」将对象之间组合的变化封装，「行为型」则是抽离对象的变化行为。接下来，本文将以「单一功能」和「开放封闭」这两大原则作为主线，分别介绍「创建型」、「结构型」和「行为型」中最具代表性的几大设计模式。

**创建型**

- 工厂模式
- 单例模式
- 原型模式

**结构型**

- 装饰器模式
- 适配器模式
- 代理模式

**行为型**

- 策略模式
- 观察者模式
- 迭代器模式

### 工厂模式

工厂模式根据抽象程度，可分为三种，分别为简单工厂，工厂方法和抽象方法，其核心在于创建对象的过程封装起来，然后通过同一个接口创建新的对象。

简单工厂模式又叫静态工厂方法，用来创建某一种产品对象的实例，用来创建单一对象

```js
class Factory {
  constructor(username, pwd, role) {
    this.username = username;
    this.pwd = pwd;
    this.role = role;
  }
}

class CreateRoleFactory {
  static create(username, pwd, role) {
    return new Factory(username, pwd, role);
  }
}

const admin = CreateRoleFactory.create("张三", "222", "admin");
```

在实际工作中，各用户角色所具备的能力是不同的，因此简单工厂是无法满足的，这时候就可以考虑使用工厂方法来代替

工厂方法的本意是将实际创建对象的工作推迟到子类中

```js
class User {
  constructor(name, menuAuth) {
    if (new.target === User) throw new Error("User 不能为实例");
    this.name = name;
    this.menuAuth = menuAuth;
  }
}

class UserFactory extends User {
  constructor(...props) {
    super(...props);
  }
  static create(role) {
    const roleCollection = new Map([
      ["admin", () => new UserFactory("管理员", ["首页", "个人中心"])],
      ["user", () => new UserFactory("普通用户", ["首页"])],
    ]);
    return roleCollection.get(role)();
  }
}

const admin = UserFactory.create("admin");
console.log("admin", admin);
const user = UserFactory.create("user");
console.log("user", user);
```

随着业务形态的变化，一个用户可能在多个平台上同时存在，显然工厂方法也无法满足了，这时候就要用到抽象工厂

抽象工厂模式是对类的工厂抽象用来创建产品类别，不负责创建某一类产品的实例

```js
class User {
  constructor(hospital) {
    if (new.target === User) throw new Error("抽象类不能实例化!");
    this.hospital = hospital;
  }
}

class DazhouUser extends User {
  constructor(name, departmentsAuth) {
    super("dazhou_hospital");
    this.name = name;
    this.departmentsAuth = departmentsAuth;
  }
}

class ChengduUser extends User {
  constructor(name, departmentsAuth) {
    super("chengdu_hospital");
    this.name = name;
    this.departmentsAuth = departmentsAuth;
  }
}

const getAbstractUserFactory = (hospital) => {
  switch (hospital) {
    case "dazhou_hospital":
      return DazhouUser;
      break;
    case "chengdu_hospital":
      return ChengduUser;
      break;
    default:
      break;
  }
};

const DazhouClass = getAbstractUserFactory("dazhou_hospital");
const ChengduClass = getAbstractUserFactory("chengdu_hospital");

const user1 = new DazhouClass("达州", "四川");
const user2 = new ChengduClass("成都", "四川");
console.log(user1, user2);
```

**小结：** 构造函数和创建对象分离，符合开放封闭原则

**使用场景：** 比如根据权限生成不同用户

### 单例模式

单例模式理解起来比较简单，就是保证一个类只能存在一个实例，并提供一个访问它的全局接口

单例模式又分为**懒汉模式** 和 **饿汉模式** ， 其区别在于懒汉模式在调用的时候创建实例，而饿汉模式则在初始化就创建好实例

#### 懒汉模式

```js
class Single {
  static instance = null;
  static getInstance() {
    if (!Single.instance) {
      Single.instance = new Single();
    }
    return Single.instance;
  }
}

const test1 = Single.getInstance();
const test2 = Single.getInstance();
console.log(test1 === test2);
```

#### 恶汉模式

```js
class Single {
  static instance = new Single();
  static getInstance() {
    return Single.instance;
  }
}
const test1 = Single.getInstance();
const test2 = Single.getInstance();
console.log(test1 === test2);
```

**小结：** 实例如果存在，直接返回已创建的，符合开放封原则

**使用场景：** Redux, Vuex 等状态管理工具，还有我们常用的 window 对象，全局缓存等

### 原型模式

当新创建的对象和已有对象存在较大共性时，可以通过对象的复制来达到创建新的对象，这就是原型

```js
// Object.create()实现原型继承
const user = {
  name: "张三",
  age: 18,
};
let userOne = Object.create(user);
console.log("userOne", userOne.__proto__); // {name: "zhangsan", age: 18}

// 原型链继承实现原型模式
class User {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Admin extends User {
  constructor(name) {
    super(name);
  }
  setName(_name) {
    this.name = _name;
  }
}

const admin = new Admin("carpe");
console.log(admin.getName());
admin.setName("hanzo");
console.log(admin.getName());
```

**小结：** 原型模式最简单的实现方式 ---- `Object.create`

**使用场景：** 新创建对象和已有对象无较大差别时，可以使用原型模式来减少创建对象的成本

### 装饰器模式

装饰器模式（Decorator Patterm）允许向一个现有的对象添加新的功能，同时又不改变结构。 这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装

#### 实例

拿吃鸡游戏来说，游戏中每个玩家降落到岛上，刚开始是一无所有的，需要通过捡拾或掠夺装备来武装自己，然后经过互相残酷的拼杀，获得游戏的胜利。

游戏过程中，我们可以把每一个玩家当成需要装饰的主类。其余的武器当成装饰类。玩家可以被任何武器装饰，从而获得不同的能力。

下面例子中，玩家主类分别通过手枪类和狙击步枪（Kar98）类修饰后，强化了自身的 fire 方法。获取了不一样的功能。与此同时，类里的其他方法 sayName 并没有受到装饰器的影响。

```js
// 被装饰的玩家
class Player {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(`I am ${this.name}`);
  }
  fire() {
    console.log(`I can only punch!`);
  }
}

// 装饰器--手枪
class Pistol {
  constructor(player) {
    player.fire = this.fire;
  }
  fire() {
    console.log(`I shoot with my Pistol!`);
  }
}

// 装饰器--98k
class Kar98 {
  constructor(player) {
    player.fire = this.fire;
  }
  fire() {
    console.log(`I shoot with my Pistol!`);
  }
}

// 新玩家
const player = new Player("carpe");

// 打招呼
player.sayName();

// 现在还没有武器，只会用拳头
player.fire();

// 哎，捡到一个手枪，装饰上
const playerWithPistol = new Pistol(player);
playerWithPistol.fire();

// 哇！捡到一个98K，装饰上
const playerWithKar98 = new Kar98(player);
playerWithKar98.fire();
```

通过实例，可以看出装饰器模式可以动态得给出一个对象添加一些额外的功能，同时结构上更加灵活。

如果不使用装饰器模式，为了实现以上功能，就需要组合创建无数多的类，在需要的时候再去实例化

**优点：** 装饰类和被装饰类可以独立发展，不会相互耦合，装饰器模式是继承的一个替代模式，装饰模式可以动态扩展一个实现类的功能，而不必担心影响实体类

**缺点：** 如果管理不当会极大增加系统复杂度，多层装饰比较复杂，不熟悉这个模式的开发人员难以理解

#### 扩展

```ts
let Kar98 = (target: any, name: any, descriptor: any) => {
  const oldValue = descriptor.value;
  // 装饰器中替代原先的fire方法
  descriptor.value = function () {
    oldValue.apply(null, arguments);
    target.sayName();
    console.log(`${name}功能被增强`);
    console.log(`I can fire with kar98!`);
  };
};

class Player {
  sayName() {
    console.log(`I am carpe`);
  }

  @Kar98
  fire(s: string) {
    // 默认如果没有装饰器，只能拳击
    console.log(s);
  }
}

const player = new Player();

player.fire(`I can punch!`);
```

### 适配器模式

适配器模式（Adapter Pattern），是作为两个不兼容的接口之间的桥梁，这种类型的设计模式属于结构型模式

```js
class Adapter {
  specificRequest() {
    return "手机充电接口";
  }
}

class Target {
  constructor() {
    this.adapter = new Adapter();
  }
  request() {
    let info = `${this.adapter.specificRequest()}---通过适配器接入到---充电插头`;
    return info;
  }
}
let target1 = new Target();
let info = target1.request();
console.log("info", info);
```

当我们有动机地修改一个正常运行的系统的接口，这时应该考虑使用适配器模式。

**缺点：过多地使用适配器，会让系统非常凌乱，不易整体进行把握**

**好处：可以让任何两个没有关联的类一起运行。 提高了类的复用**

```js
class GoogleMap {
  show() {
    console.log("开始渲染谷歌地图");
  }
}

class BaiduMap {
  display() {
    console.log("开始渲染百度地图");
  }
}

class BaiduMapAdapter extends BaiduMap {
  constructor() {
    super();
  }
  show() {
    this.display();
  }
}

// 外部调用者
function renderMap(map) {
  map.show();
}
renderMap(new GoogleMap());
renderMap(new BaiduMapAdapter());
```

### 代理模式

代理模式就是**为对象提供一个代理，用来控制对这个对象的访问**

在我们业务开发中最常见的有四种代理类型：事件代理、虚拟代理、缓存代理和保护代理。本文主要介绍虚拟代理和缓存代理两类

#### 虚拟代理

提到虚拟代理，其最具代表性的例子就是图片预加载。预加载主要为了避免网络延迟、或者图片太大引起页面长时间留白的问题。通常的解决方案是先给 img 标签展示一个占位符，然后创建一个 Image 实力，让这个实例的 src 指向真实的图片地址，当真实图片加载完成后，再将 DOM 上的 img 标签的 src 属性指向真实图片地址。

```js
class ProxyImg {
  constructor(imgEle) {
    this.imgEle = imgEle;
    this.DEFAULT_URL = "xxx";
  }
  setUrl(targetUrl) {
    this.imgEle.src = this.DEFAULT_URL;
    const image = new Image();

    image.onload = () => {
      this.imgEle.src = targetUrl;
    };

    image.src = targetUrl;
  }
}
```

#### 缓存代理

缓存代理常用于一些计算量较大的场景。当计算的值已经被出现过的时候，不需要进行二次重复计算

以传参求和为例：

```js
const countSum = (...args) => {
  let result = 0;
  args.forEach((v) => (result += v));
  return result;
};

const proxyCountSum = (() => {
  const cache = {};
  return (...args) => {
    const argList = args.join(",");
    if (argList in cache) return cache[argList];
    return (cache[argList] = countSum(...args));
  };
})();

console.log(proxyCountSum(1, 2, 3, 4));
console.log(proxyCountSum(1, 2, 3, 4));
```

**小结：** 通过修改代理类来增加功能，符合开放封闭模式。
**使用场景：** 图片预加载、缓存服务器、处理跨域以及拦截器等。

### 策略型

介绍策略模式之前，简单实现一个常见的促销活动规则：

- 预售活动，全场 9.5 折
- 大促活动，全场 9 折
- 返场优惠，全场 8.5 折
- 限时优惠，全场 8 折

人人喊打的 if-else：

```js
const activity = (type, price) => {
  if (type === "pre") {
    return price * 0.95;
  } else if (type === "onSale") {
    return price * 0.9;
  } else if (type === "back") {
    return price * 0.85;
  } else if (type === "limit") {
    return price * 0.8;
  }
};
```

以上代码存在肉眼可见的问题：大量 if-else、可扩展性差、违背开放封闭原则等。我们使用策略模式来优化一下：

```js
const activity = new Map([
  ["pre", (price) => price * 0.95],
  ["onSale", (price) => price * 0.9],
  ["back", (price) => price * 0.85],
  ["limit", (price) => price * 0.8],
]);

const getActivityPrice = (type, price) => activity.get(type)(price);
console.log(getActivityPrice("back", 100));
```

**小结：** 定义一系列算法，将其一一封装，并且使它们可相互替换，符合开放封闭原则

**使用场景：** 表单验证、存在大量 if-else 场景、各种重构等。

### 观察者模式

观察者模式或者发布订阅模式，其用来定义对象之间的一对多依赖关系，以便当一个对象更改状态时，将通知其所有依赖关系

通过名称知道，观察者模式具有两个角色 即「发布者」和「订阅者」

正如我们工作中产品经理就是一个「发布者」，而前后端、测试可以理解为「订阅者」，以一个需求会议为例:

```js
class Publisher {
  constructor() {
    this.observers = [];
    this.prdState = null;
  }
  // 增加订阅者
  add(observer) {
    this.observers.push(observer);
  }
  // 通知所有订阅者
  notify() {
    this.observers.forEach((observer) => {
      observer.update(this);
    });
  }
  // 该方法用于获取当前的 prdState
  getState() {
    return this.prdState;
  }
  // 该方法用于改变 prdState 的值
  setState(state) {
    // prd 的值发生改变
    this.prdState = state;
    // 需求文档变更，立刻通知所有开发者
    this.notify();
  }
}

//
class Observer {
  constructor() {
    this.prdState = {};
  }
  update(publisher) {
    // 更新需求文档
    this.prdState = publisher.getState();
    // 调用工作函数
    this.work();
  }
  work() {
    // 获取需求文档
    const prd = this.prdState;
  }
}

// 创建订阅者：前端开发者 carpe
const carpe = new Observer();
// 创建订阅者：后端开发者 henry
const henry = new Observer();

// 创建发布者：产品经理 robert
const robert = new Observer();

// 定义一个文档
const prd = {
  url: "xxx",
};

// 添加订阅者
robert.add(carpe);
robert.add(henry);

robert.setState(prd);
```

经常使用 EventBus（Vue）和 EventEmitter（node）会发现，发布订阅模式和观察者模式还是有细微差别的，即所有事件的发布 / 订阅都不能由发布者和订阅者 私下联系 ，需要委托事件中心处理，以 Vue EventBus 为例：

```js
import Vue from "vue";

const EventBus = new Vue();
Vue.prototype.$bus = EventBus;

// 订阅事件
this.$bus.$on("testEvent", func);
// 发布/触发事件
this.$bus.$emit("testEvent", params);
```

整个过程都是 this.$bus 这个「事件中心」在处理。

**小结：** 为解耦而生，为事件而生，符合开放封闭原则。

**使用场景：** 跨层级通信、事件绑定等。

### 迭代器模式

迭代器模式号称 「遍历专家」，它提供一种方法顺序访问一个聚合对象中的各个元素，且不暴露该对象的内部表示。

迭代器又分为内部迭代器（`$.each` / `for...of`） 和 外部迭代器 (es6 yield)。

在 es6 之前，直接通过 forEach 遍历 DOM NodeList 和 函数的 arguments 对象，都会直接报错，因为它们都是类数组对象，在 es6 中，约定只要数据类型具备`Symbol.iterator`属性，就可以被 `for...of`循环和迭代器的 next 方法遍历

```js
function iteratorFn(a, b, c) {
  const args = arguments;
  const iterator = args[Symbol.iterator]();
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
}
iteratorFn(1, 2, 3);
```

通过 es6 内置生成器 Generator 实现迭代器并没什么难度，这里重点通 es5 实现迭代器

```js
function iteratorGenerator(list) {
  let index = 0;
  // len 记录传入集合的长度
  let len = list.length;
  return {
    // 自定义 next 方法
    next: function () {
      // 如果索引还没有超出过集合长度, done 为 false
      let done = index >= len;
      // 如果 done 为 false, 则可以继续取值
      let value = !done ? list[index++] : undefined;
      // 将当前值与遍历是否完毕 (done) 返回
      return {
        done,
        value,
      };
    },
  };
}

let iterator = iteratorGenerator([1, 2, 3]);
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

**小结：** 实现统一遍历接口，符合单一功能和开放封闭原则

**使用场景：** 有遍历的地方就有迭代器

### 写到最后

设计模式的难，在于它的抽象和分散。

抽象在于每一设计模式看例子都很好理解，真正使用起来却不知所措。

分散则是出现一个场景发现好几种设计模式都能实现。而解决抽象的最好办法就是动手实践，在业务开发中探索使用它们的可能性。

本文大致介绍了前端领域常见的 9 种设计模式，相信大家在理解的同时也不难发现，设计模式始终围绕着「封装变化」来提供代码的可读性、扩展性、易维护性。所以当我们工作生活中，始终保持“封装变化”的思想的时候，就已经开始体会到设计模式精髓了。

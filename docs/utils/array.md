## 数组常用方法

### 数组移动

```js
function swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
}
```

### 数组去重

```js
function unique(arr) {
    let newArr = []
    let map = new Map()
    arr.forEach((item) => {
        if (!map.has(item)) {
            map.set(item, true)
            newArr.push(item)
        }
    })
    return newArr
}
```

<span style="color:#262626; font-weight: bold;">更详细的关于数组去重 → <a>地址</a></span>

### 数组对象去重

```js
// 原理同上, 但需要数组对象里面的一个唯一属性
function unique(arr, id) {
    let newArr = []
    let map = new Map()
    arr.forEach((item) => {
        if (!map.has(item[id])) {
            map.set[(item[id], true)]
            newArr.push(item)
        }
    })
    return newArr
}
```

### 数据一维数组变二维数组

```js
function doubleDimensionlArr(arr, size) {
    let len = arr.length
    let lineNum = len % size == 0 ? len / size : Math.floor(len / size + 1)
    let res = []
    for (let i = 0; i < lineNum; i++) {
        let temp = arr.slice(i * size, i * size + size)
        res.push(JSON.parse(JSON.stringify(temp)))
    }
    return res
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(doubleDimensionlArr(arr, 5))
```

## 数组技巧

### 万能数据生成器

```js
const createValues = (creator, length = 10) => Array.from({ length }, creator)
```

### 随机数据生成器

```js
function randomScope() {
    return Math.random() * 100
}

const createRandomValues = (len) => createValues(randomScope, len)
console.log(createRandomValues(10))
```

### 序列数据生成器

```js
const createRange = (start, stop, step) =>
    createValues((_, i) => start + i * step, (stop - start) / step + 1)
console.log(createRange(0, 100, 10))
```

### 数据生成器

```js
function createUser(v, index) {
    return {
        name: `user-${index}`,
        age: (Math.random() * 100) >> 0,
    }
}
const users = createValues(createUser, 10)
console.log(users)
```

### 清空数组

-   Array.prototype.splice(0)
-   Array.prototype.length = 0
-   let arr = []

### 从数组删除虚值

```js
const arr1 = [false, 0, undefined, , '', NaN, 9, true, undefined, null, 'test']
const newArr = arr1.filter(Boolean)
console.log('newArray', newArray)
```

### 最大值&最小值

```js
const arr2 = [1, 2, 3]
console.log(Math.max.apply(Math, arr2))
console.log(Math.min.apply(Math, arr2))
```

### queryString

```js
const urlObj = window.location.search
    .slice(1)
    .split('&')
    .filter(Boolean)
    .reduce(function (obj, cur) {
        let arr = cur.split('=')
        if (arr.length != 2) {
            return obj
        }
        obj[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1])
        return obj
    }, {})
console.log('urlObj', urlObj)
console.log(urlObj['name'])
console.log(urlObj['age'])
```

## 数组原生方法手写

### Array.isArray

注意事项：

```js
const arr = [1, 2, 3]
const proxy = new Proxy(arr, {})
console.log(Array.isArray(proxy)) // true
```

原因：

1. Proxy 本身是函数， 没有 prototype
2. Proxy 不改变被被代理对象的外在表现

推荐写法：

1. Object.prototype.toString
2. typeof + instanceof
3. constructor

```js
function isArray1(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return false
    }
    return obj instanceof Array
}

function isArray2(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
}
```

### Array.entries, Array.keys, Array.values

`ES6 提供三个新的方法 —— entries()，keys()和 values()`

它们都返回一个遍历器对象，可以用 for…of 循环进行遍历

唯一的区别是 keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历.

#### entries 的使用

```js
let elements = [1, 2, 3, 4, 5]
let iterator = elements.entries()
const n1 = iterator.next()
const n2 = iterator.next()
for (const [k, v] of iterator) {
    console.log(k, v)
}
```

公共方法

```js
Array.prototype[Symbol.iterator] = function () {
    const O = Object(this)
    let index = 0
    const length = O.length

    function next() {
        if (index < length) {
            return { value: O[index++], done: false }
        }
        return { value: undefiend, done: true }
    }
    return {
        next,
    }
}
```

手写方法

```js
Array.prototype.entries = function () {
    const O = Object(this)
    const length = O.length
    let key = []
    for (let i = 0; i < length; i++) {
        keys.push([i, O[i]])
    }
    const itr = this[Symbol.iterator].bind(keys)()
    return {
        next: itr.next,
        [Symbol.iterator]() {
            return itr
        },
    }
}
```

#### keys 写法

```js
Array.prototype.keys = function () {
    const O = Object(this)
    const length = O.length
    let key = []
    for (let i = 0; i < length; i++) {
        keys.push([i])
    }
    const itr = this[Symbol.iterator].bind(keys)()
    return {
        next: itr.next,
        [Symbol.iterator]() {
            return itr
        },
    }
}
```

#### values 写法

```js
Array.prototype.values = function () {
    const O = Object(this)
    const length = O.length
    let key = []
    for (let i = 0; i < length; i++) {
        keys.push(O[i])
    }
    const itr = this[Symbol.iterator].bind(keys)()
    return {
        next: itr.next,
        [Symbol.iterator]() {
            return itr
        },
    }
}
```

### Array.includes

```js
function ToIntegerOrInfinity(argument) {
    let num = Number(argument)
    // + 0 和 - 0
    if (Number.isNaN(num) || num == 0) {
        return 0
    }
    if (num == Infinity || num == -Infinity) {
        return num
    }
    let inter = Math.floor(Math.abs(num))
    if (num < 0) {
        inter = -inter
    }
    return inter
}

Array.prototype.includes1 = function (item, fromIndex) {
    // call, apply调用, 严格模式
    if (this == null) {
        throw new TypeError('无效的this')
    }
    let O = Object(this)
    let len = O.length >> 0
    if (len <= 0) {
        return false
    }
    let n = ToIntegerOrInfinity(fromIndex)
    if (fromIndex === undefined) {
        n = 0
    }
    if (n === +Infinity) {
        return false
    }
    if (n === -Infinity) {
        n = 0
    }
    let k = n >= 0 ? n : len + n
    if (k < 0) {
        k = 0
    }
    for (let i = k; i < len; i++) {
        if (O[i] === item) {
            return true
        } else if (Number.isNaN(item) && Number.isNaN(O[i])) {
            return true
        }
    }
    return false
}
```

### Array.from

```js
// 类数组的特征
let maxSafeInteger = Math.pow(2, 32) - 1 // js数组最大长度

function ToIntegerOrInfinity(value) {
    let number = Number(value)
    if (isNaN(number)) {
        return 0
    }
    if (number === 0 || !isFinite(number)) {
        return number
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
}

function ToLength(value) {
    let len = ToIntegerOrInfinity(value)
    return Math.min(Math.max(len, 0), maxSafeInteger)
}

function isFunction(fn) {
    return (
        typeof fn === 'function' &&
        Object.prototype.toString(fn) === '[object Function]'
    )
}

Array.prototype.myFrom = function (arrayLike, mapFn, thisArg) {
    var C = this

    //判断对象是否为空
    if (arrayLike == null) {
        throw new TypeError(
            'Array.from requires an array-like object - not null or undefined'
        )
    }
    //检查mapFn是否是方法
    if (typeof mapFn !== 'function' && typeof mapFn !== 'undefined') {
        throw new TypeError(mapFn + 'is not a function')
    }

    var items = Object(arrayLike)
    //判断 length 为数字，并且在有效范围内。
    var len = ToLength(items.length)
    if (len <= 0) return []

    var A = isFunction(C) ? Object(new C(len)) : new Array(len)

    for (var i = 0; i < len; i++) {
        var value = items[i]
        if (mapFn) {
            A[i] =
                typeof thisArg === 'undefined'
                    ? mapFn(value, i)
                    : mapFn.call(thisArg, value, i)
        } else {
            A[i] = value
        }
    }
    return A
}

function MyArray(length) {
    const len = length * 2
    return new Array(len)
}
function MyObject(length) {
    return {
        length,
    }
}

console.log('Array.from:', Array.prototype.myFrom({ a: 1, length: '10' }))
console.log('Array.from:', Array.prototype.myFrom({ a: 1, length: 'ss' }))
console.log(
    'Array.from:',
    Array.prototype.myFrom({ 0: 1, 1: 2, 4: 5, length: 4 }, (x) => x + x)
)
console.log(
    'Array.from:MyArray',
    Array.prototype.myFrom.call(MyArray, { length: 5 })
)
console.log(
    'Array.from:MyObject',
    Array.prototype.myFrom.call(MyObject, { length: 5 })
)
```

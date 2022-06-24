# 工具库

## cloneDeep

简易深拷贝 支持 `Object` 和 `Array`, 如果需要其他类型，去使用 `lodash`

#### 案例

```js
let obj = {
    name: 'carpe',
    age: 27,
    address: ['成都', '达州'],
    objects: {
        first: 'first',
        last: 'last'
    }
}
let cloneObj = cloneDeep(obj)
```

## dataType

> 校验数据类型 类似 [object Object]

#### 案例

```js
let obj = {}
let type1 = dataType(obj) // object
let arr = []
let type2 = dataType(arr) // array
```
## urlParams

```js
const href = 'http://172.16.10.110:3006/#/test?name=123&age=23'
const params = urlParams(href)
// { name: 123, age: 23 }
```


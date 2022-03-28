# 工具库

## cloneDeep

> 简易深拷贝 支持 `Object` 和 `Array`, 如果需要其他类型，去使用 `lodash`

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

## fileFormat

> 上传文件格式校验

```js
/**
 * 
 * @param file = event.files[0] 
 * @param formats = Array<string> 需要限制的格式列表 ['.png', '.jpg']
 * @param sizeMax 限制的大小
 * @returns 
 * 
 * @returns errorSize = 400 大小
 * @returns errorFormat = 401 格式
 * @returns success = 200 
 * 
 */
const arr = ['.png', ',jpg']
fileFormat(file, arr, 50)
    .then((res) => {
        if (res === 200) {
            // success
        }
    })
    .catch((err) => {
        if (err === 400) {
            // 文件大小不符合
        } else if (err === 401) {
            // 格式列表不符合
        }
    })
```


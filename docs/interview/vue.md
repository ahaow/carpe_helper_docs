# vue相关

## computed 和 watch区别

### 两者用途不同

1. computed 用于计算产生新的数据 (有缓存)
2. watch 用于监听现有数据

## vue通信方式

### 方式

1. props 和 $emit
2. 自定义事件
3. $attr
4. $parent (指向某一个父组件)
5. $refs (指向某一个子组件)
6. provide/inject
7. vuex

### 场景

* 父子组件
* 上下级组件通信
* 全局组件
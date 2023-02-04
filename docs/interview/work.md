## H5页面如何进行首屏优化

### 路由懒加载

1. 它适合SPA单页面应用(不适用MPA多页面应用)
2. 路由拆分，优先保证首页加载

### 服务端渲染SSR

* 传统的前后端分离(SPA)渲染页面过程复杂
* SSR渲染页面简单，所以性能好
* 如果是纯H5页面, SSR是性能优化的终极方案

传统的前后端分离项目

请求HTML,JS内容 --->  执行ajax, 获取data ---> 渲染页面过程复杂

服务端渲染

请求的html里面(已经做好了js,ajax等操作)，直接渲染页面


### App预取

* 如果H5在 App WebView中展示，可以使用App预取
* 用户访问列表页时，App预加载文章首页首屏内容
* 用户进入H5页, 直接从App中获取内容, 瞬间展示首屏

### 分页

* 针对列表页面
* 默认只展示第一页内容
* 上滑加载更多

### 图片懒加载lazyload

* 针对图片展示内容多的页面
* 注意：提前设置图片尺寸，尽量重绘不重排

### Hybrid (了解)

* 提前将 HTML, JS, CSS 下载到App内部
* 在 App WebView中使用 `file://` 协议加载页面首页
* 再用Ajax获取内容并展示 (也可以结合App预取)

### 总结

* 服务端渲染SSR 是 H5的终极优化方案(成本高)
* 移动端H5要结合App能力优化


## 后端一次性返回10w条数据，你该如何渲染?

### 浏览器能否处理10w条数据

1. js没问题
2. 渲染到DOM会非常卡顿

### 自定义中间层(不现实, 只做了解)

* 自定义nodejs中间层，获取并且拆分这10w条数据
* 前端对接nodejs中间层
* 成本高

### 虚拟列表

* 只渲染可是区域的DOM
* 其他隐藏区域不显示, 只用 <div> 撑起高度

[![vPqMgU.png](https://s1.ax1x.com/2022/07/29/vPqMgU.png)](https://imgtu.com/i/vPqMgU)

## 前端常用的设计模式和使用场景 

## 实际工作中, 对vue做过哪些优化

### v-if 和 v-show

* v-if 彻底销毁组件
* v-show 使用css隐藏组件
* 大部分情况下使用v-if更好

### v-for 使用key

* 不要使用index

### 使用computed缓存

### 使用keep-alive缓存组件

* 频繁切换组件 例如tabs
* 不要乱用，缓存太多容易占内存

### 异步组件

* 针对体积较大的组件

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
    components: {
        Child: defineAsyncComponent(() => import(/* wehpackChunkName: "async-child" */ './child.vue'))
    }
}

</script>
```

### 服务端渲染SSR

## 在使用Vue过程中遇到过哪些坑 

### 内存泄漏

* 全局事件, 全局变量，全局定时器
* 自定义事件

### vue2的坑(vue3不再有)

* data新增属性用Vue.set
* data删除属性用Vue.delete
* 无法直接修改数据 arr[index] = value

### 路由切换的时候scroll到顶部

* SPA的通病

**解决方法**

* 在列表页面缓存数据和scrollTop值
* 当再次返回列表页面的时候，渲染组件，执行scrollTo(x)

## 如何统一监听Vue组件报错 

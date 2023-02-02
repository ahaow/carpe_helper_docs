# css 相关

## BFC

BFC: Block Formatting Context(块级格式化上下文)

### Box: CSS 布局的基本单位

Box 是 CSS 布局的对象和基本单位，直观来说，一个页面有很多个 Box 组成的。元素的类型和 display 属性，决定了这个 box 的类型。不同的 box，会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此 box 内的元素会以不同的方式渲染。

常见盒子：

- block-level box：display 属性为 block，list-item，table 的元素，会生成 block-level box
- inline-level box：display 属性为 inline，inline-block，inline-table 的元素，会生成 inline-level box
- run-in box：css3 特有

### Formatting Context

Formatting Context 是 W3C CSS2.1 规范中的一个概念。他是页面的一块渲染区域，并且有一套渲染规则，它决定了其子元素如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting Context 有 **Block formatting context** 和 **Inline formatting context**

### BFC 布局规则

- 内部的 Box 会在垂直方向一个接着一个地放置
- Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
- 每个盒子（块盒子和行盒子）的 margin box 的左边，与包含 border box 的左边相接触，即使存在浮动也是如此
- BFC 的区域不会与 float box 重叠
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响外面的元素。反之如此
- 计算 BFC 的高度时，浮动元素也参与计算

### 如何创建 BFC

- 根元素或者其他包含的元素
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素具有 position 为 absolute 或 fixed）
- 内联块（元素具有 `display: inline-block`）
- 表格单元格（元素具有 `display: table-cell`, HTML 表格单元格默认属性）
- 表格标题（元素具有 `display: table-caption`, HTML 表格标题默认属性）
- 具有 overflow 且 值不是 visible 的块元素
- `display: flow-root`
- `column-span: all`

### BFC 的作用

1. 利用 BFC 避免 marign 重叠
2. 自适应两栏布局
3. 清除浮动

## link 和 @import

- link 是从 html 引入，@import 是从 css 引入的
- link 会在浏览器加载页面时同步加载 css; 页面加载完成后再加载 @import 的 css
- 优先级 link > @import
- @import 是 css2.1 加入的语法，只有 IE5+ 才可识别， link 无兼容问题

## 盒模型

### 基本概念

所有 HTML 元素都可以视为一个盒子，该盒子包括：边距（margin）, 边框 (border), 填充(padding) 和 实际内容(content)

### 标准模型（w3c 模型） 和 IE 模型

差异：宽高计算方式不同

标准模型：计算元素的宽高只算 content 的宽高

IE 模型：计算元素的宽高包含 content + padding + border

### 如何设置

```css
div {
  // 设置标准模型
  box-sizing: content-box;
  // 设置ie模型
  box-sizing: border-box;
}
/* box-sizing 的默认值是 content-box */
```

### js 如何设置盒模型的宽高

假设已经获取节点 dom

```js
// 只能获取内联样式设置的宽高
dom.style.width / height;
// 获取渲染后即使运行的宽高，只支持IE
dom.currentStyle.width / heigth;
// 获取渲染后即时运行的宽高，兼容性很好
dom.getComputedStyle.width / height;
// 获取渲染后即使运行的宽高，兼容性很好，一般用来获取元素的绝对位置
dom.getBoundingClientRect().width / height;
```

## 浮动

### 相关知识

#### float 属性的取值

- left: 元素向左浮动
- right: 元素向右浮动
- none: 默认值，元素不会浮动，并会显示在其文本中出现的位置

#### 特性

- 浮动元素从普通文档流中脱离，但浮动元素影响的不仅是自己，它会影响周围的元素对其进行环绕
- 不管一个元素是行内元素还是块级元素，只要被设置了浮动，那浮动元素就会形成了一个块级框，可以设置它的宽度和高度，因此浮动元素常常用于制作横向配列的菜单，可以设置大小，并且横向排列

#### 浮动元素的展示在不同情况下会有不同的规则

- 浮动元素在浮动的时候， 其 margin 不会超过包含块的 padding
- 如果两个元素一个向左浮动，一个向右浮动，左浮动元素的 margin-right 不会和右元素的 margin-left 相邻
- 如果有多个浮动元素，浮动元素就会按顺序排下来而不会发生重叠
- 如果有多个浮动元素，后面的元素高度不会超过前面的元素，并且不会超过包含块
- 如果有非浮动元素和浮动元素同时存在，并且非浮动元素在前，则浮动元素不会高于非浮动元素
- 浮动元素会尽可能地向顶端对齐，向左或向右对齐

#### 重叠问题

- 行内元素与浮动元素发生重叠，其边框，背景和内容都会显示在浮动元素之上
- 块级元素与浮动元素发生重叠时，边框和背景会显示在浮动元素之下，内容会显示在浮动元素之下

#### clear 属性

**确保当前元素的左右两侧不会有浮动元素，clear 只对元素本身的布局起作用**

- left
- right
- both

### 父元素高度塌陷问题

**为什么要清除浮动**

一个块级元素如果没有设置高度，其高度是由子元素撑开的。 如果对子元素设置了浮动，那么子元素就会脱离文档流，也就是说父元素没有内容可以撑开其高度，这样父级元素的高度就会被忽略，这就是所谓的高度塌陷

#### 清除浮动的方法

**父元素伪元素设置清除浮动**

```css
.father {
  ...;
}

.father:: after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
```

## 移动端适配 1px

### 原因

移动端造成 `1px` 的边框变粗的原因是：

CSS 中的 1px 并不等于移动设备的 1px，这是由于不同手机有不同的像素密度。在 window 对象中有一个 devicePixelRatio 属性，它可以反映 CSS 中的像素和设备的像素比。

devicePixelRatio 的官方定义：设备物理像素和设备独立像素的比例

### 直接使用 0.5px 边框

WWWDC 对 IOS 的建议：直接使用 0.5px 边框

缺点：仅支持 IOS 8+，不支持安卓。

### 使用边框图片 border-image

```css
.border-image-1px {
  border: 1px solid transparent;
  border-image: url("../img/border") 2 repeat;
}
```

优点：可以设置单条、多条边框

缺点：修改颜色麻烦，圆角需要特殊处理

### 使用 box-shadow 模拟

```css
.box-shadow-1px {
  box-shadow: inset 0 -1px 1px -1px #e5e5e5;
}
```

优点：使用简单，圆角也能实现

缺点：边框有阴影，百分百过不了视觉走查

### 伪类 + transform + 绝对定位实现

```css
.scale-1px {
  position: relative;
}

.scale-1px::after {
  content: " ";
  width: 100%;
  height: 1px; /* no */
  background: #e5e5e5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scaleY(0.5);
}
```

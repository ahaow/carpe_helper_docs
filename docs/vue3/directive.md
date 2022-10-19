## 指令

### clickoutside

```ts
import type { Directive, App } from 'vue'
const directiveClickOutSide: Directive = {
  beforeMount(el: any, binding, vnode) {
    el.$handler = (e: Event) => {
      if (el.contains(e.target)) {
        return false
      }
      binding.value()
    }
    el.$stopProp = (e: Event) => {
      e.stopPropagation()
    }
    el.addEventListener('click', el.$stopProp)
    document.body.addEventListener('click', el.$handler)
  },
  unmounted(el) {
    el.removeEventListener('click', el.$stopProp)
    document.body.removeEventListener('click', el.$handler)
  },
}
export default directiveClickOutSide
```
**使用方法**

```vue
<template>
  <main class="org-wrap" v-show="show" v-clickOutSide="handleHideOrgsList">main</main>
</template>

<script setup lang="ts">
import { ref } from "vue";
const show = ref(false);
const handleHideOrgsList = () => {
  show.value = false;
};
</script>
```
### copy

```ts
import type { Directive, App } from 'vue'
const directiveCopy: Directive = {
  beforeMount(el: any, binding: any) {
    el.targetContent = binding.value
    const success: any = binding.arg
    el.addEventListener('click', () => {
      if (!el.targetContent) {
        return window.console.warn('没有需要复制的目标内容')
      }
      // 创建textarea标签
      const textarea = document.createElement('textarea')
      // 设置相关属性
      textarea.readOnly = true
      textarea.style.position = 'fixed'
      textarea.style.top = '-99999px'
      // 把目标内容赋值给它的value属性
      textarea.value = el.targetContent
      // 插入到页面
      document.body.appendChild(textarea)
      // 调用onselect()方法
      textarea.select()
      // 把目标内容复制进剪贴板, 该API会返回一个Boolean
      const res = document.execCommand('Copy')
      res && success
        ? success(el.targetContent)
        : window.console.log('复制成功，剪贴板内容：' + el.targetContent)
      // 移除textarea标签
      document.body.removeChild(textarea)
    })
  },
  updated(el: any, binding: any) {
    // 实时更新最新的目标内容
    el.targetContent = binding.value
  },
  unmounted(el: any) {
    el.removeEventListener('click', () => {
      // do nothing.
    })
  },
}
export default directiveCopy
```


### input-type

```ts
import type { Directive } from 'vue'

const directiveInputType: Directive = {
  beforeMount(el, binding, vnode) {
    // window.console.log(el, binding, vnode)
  },
  mounted(el, binding) {
    const _type = binding.arg
    const types = ['number', 'customize']
    if (!_type || !types.includes(_type)) {
      window.console.log(
        `使用v-input指令需要选择特定功能：v-input:type="inputValue";  type = ${types.join('/')}.`
      )
      return false
    }
    el.$handler = (el: any) => {
      switch (_type) {
        case 'number':
          el.value = el.value.replace(/[^\d]/, '')
          break
        case 'customize':
          if (el.dataset.rule && eval(el.dataset.rule)) {
            el.value = el.value.replace(eval(el.dataset.rule), '')
          }
          break
        default:
          break
      }
      trigger(el, 'input')
    }
    el.$handler(el)
  },
  updated(el) {
    el.$handler && el.$handler(el)
  },
}
// 派发自定义事件
const trigger = (el: { dispatchEvent: (arg0: Event) => void }, type: string) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
export default directiveInputType
```

### lazy-img

```ts
import type { Directive } from 'vue'
import throttle from 'lodash.throttle'

const directiveLazyImg: Directive = {
  beforeMount(el, binding, vnode) {
    el.$dataSrc = binding.value
  },
  mounted(el) {
    IntersectionObserver ? ioEvent(el) : scrollEvent(el)
  },
  updated(el, binding) {
    el.$dataSrc = binding
  },
  unmounted(el) {
    IntersectionObserver && el.$io.disconnect()
  },
}

function ioEvent(el: any) {
  const io = new IntersectionObserver((entries) => {
    const realSrc = el.$dataSrc
    if (realSrc && entries && entries[0] && entries[0].isIntersecting) {
      // entries[0].isIntersecting 为true 表示 在可视区域内
      el.src = realSrc
    }
  })
  el.$io = io
  io.observe(el)
}

function scrollEvent(el: any) {
  const handler = throttle(loadImg, 250)
  loadImg(el)
  window.addEventListener('scroll', () => {
    handler(el)
  })
}
function loadImg(el: any) {
  const clientHeight = getClientHeight()
  const { top, bottom } = el.getBoundingClientRect()
  const realSrc = el.$dataSrc
  if (top < clientHeight && bottom >= 0 && realSrc) {
    el.src = realSrc
  }
}

function getClientHeight() {
  const dClientHeight = document.documentElement.clientHeight
  const bodyClientHeight = document.body.clientHeight
  let clientHeight = 0
  if (bodyClientHeight && dClientHeight) {
    clientHeight = bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight
  } else {
    clientHeight = bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight
  }
  return clientHeight
}
export default directiveLazyImg
```
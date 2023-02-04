## 组件

### clamp-text

**多行显示收回展开**

```vue
<template>
  <div class="clamp-text">
    <input :id="id" class="btn" type="checkbox" />
    <div class="text">
      <label class="btn-label" :class="className" :for="id"></label>
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ClampText",
};
</script>

<script lang="ts" setup>
interface Props {
  className: string;
  text: string;
  id: string;
}
const props = withDefaults(defineProps<Props>(), {
  className: "class-name",
  id: "class-name-id",
  text: "内容content",
});
</script>

<style lang="scss" scoped>
.clamp-text {
  display: flex;
  width: 295px;
  .text {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    position: relative;
    line-height: 1.5;
    max-height: 4.5em;
    transition: 0.3s max-height;
    color: #1a1a1a;
    &::before {
      content: "";
      height: calc(100% - 20px);
      float: right;
    }
    &::after {
      content: "";
      width: 999vw;
      height: 999vw;
      position: absolute;
      box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0 #fff;
      margin-left: -100px;
    }
  }
  .btn-label {
    position: relative;
    float: right;
    clear: both;
    margin-left: 20px;
    font-size: 14px;
    color: #007aff;
    cursor: pointer;
    &.all {
      &::after {
        content: "全文";
      }
    }
    &.open {
      &::after {
        content: "展开";
      }
    }
  }
  .btn {
    display: none;
    &:checked + .text {
      max-height: none;
    }
    &:checked + .text::after {
      visibility: hidden;
    }
    &:checked + .text .btn-label::before {
      visibility: hidden;
    }
    &:checked + .text .btn-label::after {
      content: "收起";
    }
  }
  .btn-label {
    &::before {
      content: "...";
      position: absolute;
      left: -5px;
      color: #333;
      transform: translateX(-100%);
    }
  }
}
</style>
```

**使用**
```vue
<template>
  <clamp-text
    :id="discuss.learnDiscussId"
    :class-name="'all'"
    :text="discuss.content"
  ></clamp-text>
</template>
```

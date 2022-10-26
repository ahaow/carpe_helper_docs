## 将富文本内容截取字符串

```js
function getText(str) {
    let text = str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "")
    return text.replace(/\s*/g, "")
}
```


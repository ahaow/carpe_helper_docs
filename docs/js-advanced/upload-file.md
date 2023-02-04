## JS检验文件类型

在正常情况下，限制文件上传类型，采用input中的accept属性

```html
<input type="file" id="inputFile" accept="image/png" />
```

这种方案虽然可以满足大多数场景，但如果用户把 JPEG 格式的图片后缀名更改为 .png 的话，就可以成功突破这个限制。那么应该如何解决这个问题呢？其实我们可以通过读取文件的二进制数据来识别正确的文件类型。

### 如何查看图片的二进制数据

**Synalyze It! Pro** 十六进制编辑器

### 如何区分图片的类型

**计算机并不是通过图片的后缀名来区分不同的图片类型，而是通过 “魔数”（Magic Number）来区分。** 对于某一些类型的文件，起始的几个字节内容都是固定的，根据这几个字节的内容就可以判断文件的类型。

| 文件类型 | 文件后缀 | 魔数                      |
| :------- | -------- | ------------------------- |
| JPEG     | jpg/jpeg | 0xFF D8 FF                |
| PNG      | png      | 0x89 50 4E 47 0D 0A 1A 0A |
| GIF      | gif      | 0x47 49 46 38（GIF8)      |
| BMP      | bmp      | 0x42 4D                   |

### 如何检测图片的类型

**1. 定义readBuffer函数**

通过 FileReader API 来读取文件的内容，获取文件中指定范围的二进制数据

```js
function readBuffer(file, start = 0, end = 2) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.error = reject
    reader.readAsArrayBuffer(file.slice(start, end))
  })
}
```

对于 PNG 类型的图片来说，该文件的前 8 个字节是 **0x89 50 4E 47 0D 0A 1A 0A**。因此，我们在检测已选择的文件是否为 PNG 类型的图片时，只需要读取前 8 个字节的数据，并逐一判断每个字节的内容是否一致。

**2. 定义 check 函数**

```js
// 为了实现逐字节比对并能够更好地实现复用，定义了一个 check 函数
function check(headers) {
  return (buffers, options = { offset: 0 }) =>
    headers.every(
      (header, index) => header === buffers[options.offset + index]
    );
}
```

**3. 检测类型代码**

```vue
<template>
	<input type="file" @change="handleChange" />
</template>
<script setup>
  const isPNG = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // PNG图片对应的魔数
	const handleChange = async (e) => {
    const file = e.target.files[0]
    const buffers = await readBuffer(file, 0, 8)
    const uint8Array = new Uint8Array(buffers)
    console.log(isPNG(uint8Array))
  }
</script>
```

### 现成的工具库

第三库来实现文件检测的功能，比如 [file-type](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Ffile-type%23readme) 这个库

### 原文地址

[JavaScript 如何检测文件的类型？](https://juejin.cn/post/6971935704938971173#heading-2)














































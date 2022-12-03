# 插件相关

## 关于使用 tinymce 富文本编辑器

### 在 vue2 环境上使用 (基础使用)

1. npm 安装 `@packy-tang/vue-tinymce`, 当前版本 `1.1.1`
2. 在 public 文件下 增加 tinymce 文件, 当前版本为 `5.7.1`
3. 在 public 文件下 的 index.html 中引入 `tinymce.min.js`, 并初始化

```html
<script src="./tinymce/tinymce.min.js"></script>
<script>
  tinymce.init({
    selector: "#textarea1",
    style: {
      color: "#000",
    },
    placeholder: "在这里输入文字",
  });
</script>
```

4. 新建 tinymce-setting.js 文件 进行配置

```js
async function uploadTest(blobInfo, success) {
  let myFile = new File([blobInfo.blob()], blobInfo.filename());
  let form = new FormData();
  form.append("file", myFile);
  const response = await upload_utils(form);
  if (response.code === 0 && response.data) {
    let flag = store.state.oss != "";
    if (flag) {
      success(isCdn(response.data.fileUrl));
    } else {
      success(isCdn(response.data.data.fileUrl));
    }
  }
}

function getTinymceSetting(height) {
  return {
    branding: false,
    menubar: false,
    elementpath: false,
    external_plugins: {
      mathjax:
        "https://cdn.jsdelivr.net/npm/@dimakorotkov/tinymce-mathjax@1.0.8/plugin.min.js",
    },
    mathjax: {
      lib: "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/tex-mml-chtml.js", //required path to mathjax
      symbols: { start: "\\(", end: "\\)" }, //optional: mathjax symbols
      // className: "mathjax", //optional: mathjax element class
      // configUrl:
      //   "https://cdn.jsdelivr.net/npm/@dimakorotkov/tinymce-mathjax@1.0.8/config.js", //optional: mathjax config js
    },
    toolbar:
      "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat | mathjax",
    toolbar_drawer: "sliding",
    quickbars_selection_toolbar:
      "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
    // plugins: "image table lists fullscreen quickbars",
    plugins: "image lists fullscreen quickbars mathjax",
    language: "zh_CN", //本地化设置
    height: height,
    images_upload_handler: uploadTest,
    init_instance_callback: (editor) => {
      editor.on("NodeChange Change KeyUp SetContent", () => {
        // editor.on("paste", () => {
        //   return false;
        // });
      });
    },
  };
}
```

5. 在 vue 组件中使用

```vue
<vue-tinymce
  v-model="topicString"
  :placeholder="'请输入内容'"
  :setting="getTinymceSetting(280)"
/>
```

### 增加 mathjax 数学公式

[tinymce-mathjax](https://github.com/dimakorotkov/tinymce-mathjax)

根据文档介绍，在 getTinymceSetting 中 增加

```js
external_plugins: {'mathjax': '/your-path-to-plugin/@dimakorotkov/tinymce-mathjax/plugin.min.js'},
  toolbar: 'mathjax',
  mathjax: {
    lib: '/path-to-mathjax/es5/tex-mml-chtml.js', //required path to mathjax
    //symbols: {start: '\\(', end: '\\)'}, //optional: mathjax symbols
    //className: "math-tex", //optional: mathjax element class
    //configUrl: '/your-path-to-plugin/@dimakorotkov/tinymce-mathjax/config.js' //optional: mathjax config js
  }
```

#### 注意点

- 在 toolbar 和 plugins 配置中 要加上 mathjax, tinymce-setting.js 中有体现出
- 注意 external_plugins 和 mathjax 引入的 tinymce-mathjax 包 和 mathjax 包的地址， 版本号要匹配符合

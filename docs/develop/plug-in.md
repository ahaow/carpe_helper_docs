# 插件相关

## github 插件

### mitt

> Tiny 200 byte functional event emitter / pubsub.

[地址](https://github.com/developit/mitt)

### pdf 相关

[pdfjs](https://github.com/mozilla/pdf.js)

[pdfh5](https://github.com/gjTool/pdfh5)

### 直播相关

> hls.js 直播播放 m3u8 视频格式

[hls.js](https://github.com/video-dev/hls.js)

> flv.js 直播播放 flv 视频格式

[flv.js](https://github.com/bilibili/flv.js)

[基于 flv.js 的功能扩展插件](https://github.com/shady-xia/flvExtend)

**关于 rtmp,flv,m3u8 区别**

```md
rtmp: 仅支持电脑还必须依赖 flash，而且负载不行, 小规模的可以用
flv: 支持电脑和安卓手机, 但是不支持苹果手机, 延迟在 2~6s 左右, pc 端最常用, 安卓手机网页版需要依赖 flv.js 进行解码, 有一定的失败率, 苹果压根就不支持
m3u8: 通用格式, 电脑和手机均支持, 缺点就是延迟比较高, 在 10~30s
```

### wordcloud

词云

[地址](https://github.com/timdream/wordcloud2.js)

### html2canvas

[地址](https://github.com/niklasvh/html2canvas)

### qrcodejs2

[地址](https://www.npmjs.com/package/qrcodejs2)

### current-device

> 查看当前系统,浏览器

[地址](https://github.com/matthewhudson/current-device)

### amfe-flexible

> 可伸缩布局方案

[地址](https://www.npmjs.com/package/amfe-flexible)

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

````
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
````

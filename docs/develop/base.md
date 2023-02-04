## 工作开发

### 前端 js 监听浏览器网络变化

核心 API: `navigator.connection`可以来获取设备的网络连接信息

`navigator.connection`可以实时监听到网络变化(延迟 2-5s), 但是获取到的网络是一个模糊的值

比如`navigator.connection.rtt`是请求预估延迟 xx.ms, 有时候是 0 毫秒的延迟, 已经断网状态

```js
if (navigator.connection && navigator.connection.onchange === null) {
  navigator.connection.onchange = () => {
    if (
      netWorkDownlink !== navigator.connection.downlink ||
      navigator.connection.rtt === 0
    ) {
      window.console.log("网络断开");
    } else if (
      netWorkDownlink === navigator.connection.downlink ||
      navigator.connection.rtt !== 0
    ) {
      window.console.log("网络连接");
    }
  };
}
```

### 下载附件 例如excel

```js
Axios({
  method: 'GET',
  url: 'xxxx',
  responseType: 'blob',
}).then((res) => {
  const link = document.createElement('a')
  const blob = new Blob([res.data],{
    type: 'application/vnd.ms-excel'
  })
  const href = window.URL.createObjectURL(blob)
  link.download = 'filename'
  link.href = href
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(href)
})
```

[Blob地址](https://blog.csdn.net/yin_you_yu/article/details/116261304)


### HtmlEncode

```js
const HtmlEncode = (str) => {
  var hex = new Array(
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
  )
  var preescape = str
  var escaped = ""
  for (var i = 0; i < preescape.length; i++) {
    var p = preescape.charAt(i)
    escaped = escaped + escapeCharx(p)
  }
  return escaped

  function escapeCharx(original) {
    var found = true
    var thechar = original.charCodeAt(0)
    switch (thechar) {
      case 10:
        return "<br/>"
      case 32:
        return "&nbsp;"
      case 34:
        return "&quot;"
      case 38:
        return "&amp;"
      case 39:
        return "&#x27;"
      case 47:
        return "&#x2F;"
      case 60:
        return "&lt;"
      case 62:
        return "&gt;"
      case 198:
        return "&AElig;"
      case 193:
        return "&Aacute;"
      case 194:
        return "&Acirc;"
      case 192:
        return "&Agrave;"
      case 197:
        return "&Aring;"
      case 195:
        return "&Atilde;"
      case 196:
        return "&Auml;"
      case 199:
        return "&Ccedil;"
      case 208:
        return "&ETH;"
      case 201:
        return "&Eacute;"
      case 202:
        return "&Ecirc;"
      case 200:
        return "&Egrave;"
      case 203:
        return "&Euml;"
      case 205:
        return "&Iacute;"
      case 206:
        return "&Icirc;"
      case 204:
        return "&Igrave;"
      case 207:
        return "&Iuml;"
      case 209:
        return "&Ntilde;"
      case 211:
        return "&Oacute;"
      case 212:
        return "&Ocirc;"
      case 210:
        return "&Ograve;"
      case 216:
        return "&Oslash;"
      case 213:
        return "&Otilde;"
      case 214:
        return "&Ouml;"
      case 222:
        return "&THORN;"
      case 218:
        return "&Uacute;"
      case 219:
        return "&Ucirc;"
      case 217:
        return "&Ugrave;"
      case 220:
        return "&Uuml;"
        break
      case 221:
        return "&Yacute;"
      case 225:
        return "&aacute;"
      case 226:
        return "&acirc;"
      case 230:
        return "&aelig;"
      case 224:
        return "&agrave;"
      case 229:
        return "&aring;"
      case 227:
        return "&atilde;"
      case 228:
        return "&auml;"
      case 231:
        return "&ccedil;"
      case 233:
        return "&eacute;"
      case 234:
        return "&ecirc;"
      case 232:
        return "&egrave;"
      case 240:
        return "&eth;"
      case 235:
        return "&euml;"
      case 237:
        return "&iacute;"
      case 238:
        return "&icirc;"
      case 236:
        return "&igrave;"
      case 239:
        return "&iuml;"
      case 241:
        return "&ntilde;"
      case 243:
        return "&oacute;"
      case 244:
        return "&ocirc;"
      case 242:
        return "&ograve;"
      case 248:
        return "&oslash;"
      case 245:
        return "&otilde;"
      case 246:
        return "&ouml;"
      case 223:
        return "&szlig;"
      case 254:
        return "&thorn;"
      case 250:
        return "&uacute;"
      case 251:
        return "&ucirc;"
      case 249:
        return "&ugrave;"
      case 252:
        return "&uuml;"
      case 253:
        return "&yacute;"
      case 255:
        return "&yuml;"
      case 162:
        return "&cent;"
      case "\r":
        break
      default:
        found = false
        break
    }
    if (!found) {
      if (thechar > 127) {
        var c = thechar
        var a4 = c % 16
        c = Math.floor(c / 16)
        var a3 = c % 16
        c = Math.floor(c / 16)
        var a2 = c % 16
        c = Math.floor(c / 16)
        var a1 = c % 16
        return "&#x" + hex[a1] + hex[a2] + hex[a3] + hex[a4] + ";"
      } else {
        return original
      }
    }
  }
}
```

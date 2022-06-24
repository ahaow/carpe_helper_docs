# develop

## 前端 js 监听浏览器网络变化

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

## 浏览器相关

### 在浏览器输入 URL 回车之后发生什么？

1. DNS 解析 (将 URL 地址解析成 IP 地址的过程就叫 DNS 解析)
2. TCP 三次握手 (与服务器主机三次握手建立 TCP 连接)
3. 发送 HTTP 请求 (浏览器发送请求报文给服务器)

```md
报文格式:

    1. 请求行 (请求方法，请求地址，HTTP协议版本组成)
    2. 请求头部 (一些浏览器信息，键值对组成)
    3. 空行 (遇到空行，表示没有请求头部)
    4. 请求数据 ()
```

4. 响应 HTTP 请求 (响应报文和请求报文格式类似)

```md
常见的状态行信息: 1. 404 Not Found 资源没有找到 2. 200
```

5. 页面渲染 (浏览器接收到服务器响应的 HTML,CSS,JS 文件后，将内容渲染出来)

### DNS 域名解析过程

> DNS 域名解析就是把域名转换成 I 地址的过程

1. 浏览器 DNS 解析
    - (检查浏览器缓存中是否有缓存过该域名对应的 IP 地址)
2. 本地 hosts 文件 DNS 解析
    - (如果第一步没有完成, 那么浏览器会去系统缓存中查找是否缓存过这个域名对应的 IP 地址)
3. 本地域名解析服务器 DNS 解析
    - (系统请求本地域名解析服务系统进行解析--本地域名系统一般都是本地区的域名服务器)
4. 根域名解析服务器 DNS 解析
    - (本地域名解析服务器没有完成的话，本地域名服务器向根域名服务器发起解析请求, 根域名返回的是所查询的 com 服务器地址)
5. gTLD 服务器 DNS 解析
    - (本地域名解析器向 gTLD 服务器发送请求，gLTD 服务器查询并返回域名对应的 Name Server 域名服务器的地址，通常是你注册的域名服务器)
    - (例如你在某个域名服务器提供商申请的域名，那么这个域名解析任务就由这个域名服务提供商来完成)
6. 权威域名服务器 DNS 解析
    - (权威域名服务器会查询存储的域名和 IP 的映射关系表，将 IP 连同 TTL 值返回给 DNS 本地域名服务器)
7. 返回，然后缓存
    - (本地域名服务器拿到 ip 和 TTL 会缓存起来。返回给浏览器。)

[原文地址](https://juejin.cn/post/7105387310698463263#heading-12)

### TCP 三次握手和四次挥手

#### 三次握手

TCP 报文里面有 SYN、ACK、FIN 等标识, 如果设置 1 就是开启这些标识, 如果设置 0 就是关闭这些标识

SYN: `Synchronization` 同步
ACK: `Acknowledgment` 确认
FIN: `Finish` 结束

1. 客户端发送 TCP 报文的时候, 会把 SYN 开启
    - 客户端想和服务端同步, 建立连接
    - 报文里面还有一个重要的字段`Sequence`序号, 随机生成的，作为初始值来进行后续判断依据, 保证通道的唯一性
    - 假设序号为 4399
2. 服务器收到报文, 会把 SYN 和 ACK 开启
    - 确认同步
    - 服务器也生成自己的序号, 假设 466
    - 加上确认号，这个确认号是根据客户端的序号 +1 得到的: 4400,
    - 这样客户端在收到号码后 -1 就知道是不是自己的 TCP 报文了
3. 客户端收到确认，收到序号和确认号
    - 再次发生 TCP 连接
    - ACK 开启
    - 此时的序号: 4400, 此时的确认号 466 + 1

#### 握手之后

握手之后建立了连接，就可以发生 HTTP 请求了, 然后服务器响应内容, 内容交流完毕后, 各自就会发起关闭连接的要求了

#### 四次挥手

客户端和服务端都能够主动发起关闭请求

1. 客户端会在报文中开启`FIN`和`ACK`
2. 服务端发送一个`ACK`来确认
    - 当服务器端发送一个`ACK`后, 客户端并未正式关闭通道, 因为服务器那边有可能还有需要发送的数据
3. 等服务端发送最后的数据后, 会发送一个`FIN`和`ACK`来做最后的确认
4. 客户端收到最终的确认之后, 会发送一个`ACK`确认

中间 2, 3 步足以证明为何要四次挥手, 因为还存在会发送完毕的数据

#### 有点意思

三次握手
A: 是 A 吗？我要跟你通信，你听得到吗？
B：可以听到，你听得到吗？
A：我可以听到

四次挥手：
A：呼叫 B，我要跟你断开通话
B：知道了，等一下，我还有话要说
B：OK，我说完了
A：好的，我知道了

### 浏览器渲染页面的流程

```html
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="index.css" />
    </head>
    <body>
        <script></script>
    </body>
</html>
```

1. 解析 HTML 文件，遍历文档节点，生成`DOM Tree`
    - 浏览器发送请求之后, 服务器或者本地返回浏览器 HTML 文件
    - `DOM`树在构建的过程中可能会被 CSS 和 JS 的加载而执行阻塞
    - `display:none` 也在`DOM`树
    - 注释也在`DOM`树
    - `script`标签也在`DOM`树
2. 解析`css`文件，构建`CSSOM`
    - `css`和`Dom`解析可以同时进行
    - `css`和`js`解析互斥
3. 通过 DOM 树和 CSS 规则树，构建渲染树，浏览器通过 DOM 树的根节点开始遍历每一个节点，然后找到适配的 CSS 样式规则应用
    - `Render Tree` 和 `DOM Tree` 不完全对应
    - `display:none`元素不在渲染树
    - `visibility: hidden`元素在渲染树
4. 布局(Layout)
    - 渲染到屏幕需要得到各个节点的位置信息，这需要布局处理
    - 布局阶段会从渲染树的根节点开始遍历，渲染树的每一个节点都是`Render Object` 对象，有具体的宽高，位置等样式信息
    - 浏览器就可以根据这些信息清楚得确定每个节点的位置及大小
5. 绘制
    - 浏览器会遍历渲染树`Render Tree`，调用浏览器的`paint()`方法在屏幕内渲染其内容
    - 渲染树的绘制工作是由浏览器的 UI 后端组件完成的

[![jxVCeU.png](https://s1.ax1x.com/2022/07/25/jxVCeU.png)](https://imgtu.com/i/jxVCeU)

[参考文章](https://www.jianshu.com/p/e6252dc9be32)

### 重绘 repaint、重排 reflow 有什么区别

#### 动态网页随时都会重绘和重排

-   网页动画
-   Modal 、Dialog 弹窗
-   增加/删除一个元素、显示/隐藏一个元素

#### 重绘 repaint

-   元素外观改变，如颜色、背景色
-   元素的尺寸，定位不变，不会影响到其他元素的位置

#### 重排 reflow

-   重新计算尺寸和布局，可能会影响到其他元素的位置
-   如元素高度增加，可能会使相邻元素位置下移

#### 区别

-   重排比重绘影响要大，消耗也大
-   避免无意义的重拍

#### 减少重排的方法

-   集中修改样式，或者直接切换 css class
-   修改之前先设置 display: none，脱离文档流
-   使用 BFC 特性，不影响其他元素的位置
-   频繁触发的(resize,scroll)使用节流和防抖
-   使用 createDocumentFragment 批量操作 DOM
-   优化动画，使用 css3 和 requestAnimationFrame, 避免 js 动画

### BFC

### CDN

> CDN，简单来讲，就是你的网站服务器在黑龙江，怎么能让海南岛的用户快速访问呢？ 很简单，在广州再放一台

#### RTT

`RTT: Round-Trip Time` 往返时延，是指数据从网络一端传输到另一端所需要的时间，通常，时延由发送时延，传播时延，排队时延，处理时延四部分组成

如果海南的用户访问黑龙江的网络服务器，超远程访问，中间节点出问题的几率增大，导致用户打开网站会很慢，白屏

接入`CDN`就不一样了，海南的用户连接的是广州的服务器

#### cdn

`Content Delivery Network`: 内容分发网络

帮服务器近距离给用户分发网页内容的

**网页内容：**

1. 静态内容 （长期不需要改变的）
2. 动态内容

#### cdn 分发流程

**静态内容**

1. 源服务器将内容`push`给`cdn`，
2. 如果源服务器没有将内容`push`给 cdn, cdn 就会自己去`pull`源服务器拉取内容
3. 源服务器还可以让 cdn 进行备份，有了备份，其他同时做出请求的用户也可以拿到内容
4. 各地用户访问的时候，就近的 cdn 服务器就会把静态内容提供给用户（不需要去请求源服务器了）

**动态内容**

不表

#### 安全性和可靠性

1. 负载均衡（Server Load Balancer）是将访问流量根据转发策略分发到后端多台云服务器（ECS 实例）的流量分发控制服务。**负载均衡扩展了应用的服务能力，增强了应用的可用性**
2. CDN 采用 TLS/SSL 证书(https 安全证书)给网站进行保护

#### 一加一减

1. 加 加速器
2. 减 减少费用

### Get 和 Post

### Cookie、Session、jwt

#### cookie

-   HTTP 无状态，每次请求都要带上`cookie`，以帮助识别身份
-   服务端也可以向客户端`set-cookie`, `cookie`大小限制`4kb`
-   默认有跨域限制：不可跨域共享，传递`cookie`

cookie 在 HTML5 之前也用于本地存储，但是在之后用`localStorage` 和 `sessionStorage`

现代浏览器开始禁用第三方 cookie

#### cookie 和 session

-   cookie 用于登录验证，存储用户标识(如 userId)
-   session 在服务端，存储用户详细信息, 和 cookie 信息一一对应
-   cookie + session 是常见的登录验证解决方法

[![j7w0GF.png](https://s1.ax1x.com/2022/07/19/j7w0GF.png)](https://imgtu.com/i/j7w0GF)

问：`set-cookie`的时候只存用户标识 , 为什么不将用户所有信息存入？

答：1. 浏览器 cookie 存储大小为`4kb`

    	2. 所有信息存入`cookie`不安全
    	2. 体积大，传输慢

#### cookie 和 token

-   cookie 是 HTTP 协议, 而 token 是自定义传递
-   cookie 会被浏览器默认存储, 而 token 需要自己存储
-   token 默认没有跨域限制

#### JWT(JSON WEB TOKEN)

1. 前端发起登录, 后端验证成功之后, 返回一个加密的 token
2. 前端自行存储这个 token(其中包括了用户信息, 加密了)

#### cookie 和 token 区别

-   cookie: HTTP 标准，跨域限制，配合 session 使用
-   token: 无标准，无跨域限制，用于 jwt

#### session 和 token 哪个更好

session 优点:

1. 原理简单，配合 cookie 容易实现
2. 用户信息存储在服务端，可以快速封禁某个用户

session 缺点:

1. 占用服务器内存， 硬件成本高
2. 多进程，多服务器，不好同步--需要第三方缓存，如 redis

jwt 优点:

1. 不占用服务器内存
2. 多进程, 多服务端 不受影响
3. 没有跨域限制

jwt 缺点:

1. 用户端存储在客户端, 无法快速封禁某用户
2. 万一服务器密钥泄漏, 则用户信息全部丢失
3. token 体积大于 cookie, 会增加请求的数据量

**答案**

1. 如果有严格管理用户信息的需求(保密，快速封禁) 推荐 session
2. 如果没有特殊要求, 使用 jwt

### 如何实现 SSO 单点登录（x）

#### 基于 cookie

1. cookie 默认不可跨域共享，但有些情况下可设置为共享
2. 主域名相同，如 `www.baidu.com`, `image.baidu.com`
3. 设置 cookie domain 为主域名，即可共享 cookie
4. 主域名完全不同, 则 cookie 无法共享

### HTTP 和 TCP/UDP 协议的区别

#### 网络协议

1. HTTP 协议在应用层
2. TCP 和 UDP 协议在传输层
3. 严格来说应该是拿 TCP 和 UDP 协议来进行比较

#### TCP 协议

-   三次握手
-   四次挥手
-   稳定传输

#### UDP 协议

-   无连接 无断开
-   不稳定传输，但效率高
-   如视频会议、语音通话

#### 答案

-   HTTP 是应用层，TCP 和 UDP 是传输层
-   TCP 有连接，有断开，稳定传输
-   UDP 无连接 无断开，不稳定传输，但效率高

### HTTP1.0、1.1、2.0 有什么区别

#### 1.0

-   最基本的 HTTP 协议
-   支持最基本的 GET、POST 请求

#### 1.1

-   增加了缓存策略 `cache-control` `E-tag`等
-   支持长连接`Connection: keep-alive`, 一次 TCP 连接多次请求
-   断点续传, 状态码 206
-   支持新的方法`PUT`, `DELETE`等, 可用于`restful api`

#### 2.0

-   可压缩 header, 减少体积
-   多路复用，一次 TCP 连接中可以多个 HTTP 并发请求
-   服务端推送

### 什么是 HTTPS 中间人攻击？如何预防？（x）

#### HTTPS 加密协议

1. HTTP 明文传输
2. HTTPS 加密传输 HTTP + TLS/SSL 证书

### script 标签的 defer 和 async 有什么区别

[![jjHJ5d.png](https://s1.ax1x.com/2022/07/24/jjHJ5d.png)](https://imgtu.com/i/jjHJ5d)

-   无: HTML 暂停解析，下载 JS，执行 JS，再继续解析 HTML
-   defer: HTML 继续解析，并行下载 JS，HTML 解析完再执行 JS
-   async: HTML 继续解析，并行下载 JS，执行 JS，再解析 HTML

### link 中的属性

#### preload

资源在当前页面使用，会有优先加载

```html
<link rel="preload" href="xxx.js" as="script" />
<link rel="preload" href="xxx.css" as="style" />
```

#### prefetch

资源在未来页面使用，空闲时加载

```html
<link rel="prefetch" href="xxx.js" as="script" />
```

#### dns-prefetch

dns-prefetch 即 DNS 预查询

#### preconnect

preconnect 即 DNS 预连接

### websocket 和 http 协议的区别

#### websocket

-   支持端到端通讯
-   可以由 client 发起，也可以由 server 发起
-   用于：消息通知，直播间讨论，聊天室，协同编辑

**连接过程**

-   发起一个 http 请求
-   成功之后再升级到 websocket 协议，再通讯

#### 区别

-   websocket 协议名是 ws://, 可双端发起请求
-   websocket 没有跨域限制
-   通过 send 和 onmessage 通讯(HTTP 通过 req, res)

### 轮询 、 长轮询、 websocket

#### 轮询

利用 ajax，setInterval 定时向后端发起请求，例如每隔 5s 发一次请求，那么你的数据就会延迟高达 5s

特点： 数据延迟，消耗资源过大，请求次数太多了

#### 长轮询

利用 ajax 和 队列 定时朝后端发起请求, 如果没有数据则会阻塞，但不会一直阻塞，比如阻塞你 30，还没有返回数据，然后让客户端再次发起请求数据

在长轮询机制中，客户端像传统轮询一样从服务器请求数据。然而，如果服务器没有可以立即返回给客户端的数据，则不会立刻返回一个空结果，而是保持这个请求等待数据到来（或者恰当的超时：小于 ajax 的超时时间），之后将数据作为结果返回给客户端。

特点：相对于轮询基本没有消息延迟，请求次数降低了很多

#### websocket

特点：服务器和客户端建立了连接后，默认不会断开，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息

### 如何实现网页多标签 tab 通讯

#### 使用 websocket

1. 无跨域限制
2. 需要服务端支持，成本高

#### 通过 localStorage

1. 同域的 `A` 、`B` 两个页面
2. 跨域不共享

A 页面

```html
<!DOCTYPE html>
<body>
    <button id="btn">点击</button>
    <script>
        const btn = document.getElementById("btn")
        btn.addEventListener("click", () => {
            const info = {
                name: 'carpe',
                age: 28,
                date: +new Date(),
            }
            localStorage.setItem("info", JSON.stringify(info))
        })
    </script>
</body>
</html>
```

B 页面

```html
<!DOCTYPE html>
<html lang="en">
    <body>
        <script>
            window.addEventListener('storage', (event) => {
                console.log('key', event.key)
                console.log('newValue', event.newValue)
            })
        </script>
    </body>
</html>
```

#### 通过 SharedWorker 通讯

-   SharedWorker 是 WebWorker 的一种
-   WebWorker 可开启子进程执行 JS，但不能操作 DOM
-   SharedWorker 单独开启一个进程，用于同域页面通讯

A 页面

```html
<script>
    const worker = new SharedWorker('./worker.js')
    const btn = document.getElementById('btn')
    btn.addEventListener('click', () => {
        worker.port.postMessage('detail go...')
    })
</script>
```

B 页面

```html
<script>
    const worker = new SharedWorker('./worker.js')
    worker.port.onmessage = (e) => console.info('list', e)
</script>
```

```js
/**
 * for SharedWorker
 */

const set = new Set()

onconnect = (event) => {
    const port = event.ports[0]
    set.add(port)
    // 接收信息
    port.onmessage = (e) => {
        // 广播消息
        set.forEach((p) => {
            p.postMessage(e.data)
        })
    }
    port.postMessage('worker.js done')
}
```

#### 总结

-   websocket 需要服务端，成本高
-   localStorage 简单易用，推荐
-   SharedWorker 调试不方便，不兼容 IE11

### 如何实现网页和 iframe 之间的通讯

parent

```html
<!DOCTYPE html>
<html lang="en">
    <body>
        aaa
        <button id="btn">a发送信息</button>

        <iframe id="iframe1" src="./B.html" frameborder="0"></iframe>

        <script>
            document.getElementById('btn').addEventListener('click', () => {
                // console.log('window.iframe1', window.iframe1)
                // console.log('window.iframe1.contentWindow', window.iframe1.contentWindow)
                window.iframe1.contentWindow.postMessage('hello', '*')
            })
            window.addEventListener('message', (event) => {
                console.log('event', event)
                console.log('origin', event.origin) // 来源的域名
                console.log('data', event.data) // 来源的域名
            })
        </script>
    </body>
</html>
```

child

```html
<!DOCTYPE html>
<html lang="en">
    <body>
        bbb <button id="btn">b 发送信息</button>
        <script>
            document.getElementById('btn').addEventListener('click', () => {
                window.parent.postMessage('world', '*')
            })
            window.addEventListener('message', (event) => {
                console.log('child event', event)
                console.log('child origin', event.origin) // 来源的域名
                console.log('child data', event.data) // 来源的域名
            })
        </script>
    </body>
</html>
```

#### 总结

1. 使用 postMessage 进行通信
2. 监听 message 事件进行接收
3. 注意跨域的限制和判断

### ['1','2','3'].map(parseInt)

**parseInt(str, radix)**

1. 解析一个字符串, 并返回十进制整数
2. 第一个参数 str, 即要解析的字符串
3. 第二个参数 radix, 基数(进制), 范围 2-36

```js
parseInt('100', 1) // NaN
```

**没有 radix**

-   当 str 以`Ox`开头, 按照 16 进制处理
-   当 str 以`O`开头, 则按照 8 进制处理

```js
const nums = ['1', '2', '3']
const res = nums.map((item, index) => {
    // item: '1', index: 0 按照10进制处理 1
    // item: '2', index: 1 NaN
    // item: '3', index: 2 NaN
    return parseInt(item, index)
})
```

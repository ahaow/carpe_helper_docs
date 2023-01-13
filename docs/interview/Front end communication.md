# 前后端通信

## CDN 加速原理

CDN 全称(Content Delivery NetWork) 即内容分发网络，其目的是通过现有的 Internet 中增加一层新的缓存层，**将网站的内容发布到最接近用户的网络边缘节点**，使用户可以就近取得所需的内容，提高用户访问网站的响应速度。从技术上全面解决由于网络带宽校, 用户访问量大，网点分布不均等问题，提高用户访问网站的响应速度

简单来说，CDN 的工作原理就是将你源站的资源缓存岛位于全球各地的 CDN 节点上，用户请求资源时，就近返回节点上缓存的资源，而不需要每个用户的请求都从你的源站获取，避免网络拥塞，缓解源站压力，保证用户访问资源的速度和体验

CDN 对网络的优化作用主要体现在：

1. 解决服务端的 **第一公里** 的问题
2. 缓存甚至消除不同运营商之间互联的瓶颈造成的影响
3. 减轻了各省的出口带宽压力
4. 缓解了骨干网的压力
5. 优化了网上热点内容

<h2>工作原理</h2>

### 传统访问过程

1. 用户输入访问的域名，操作系统向 LocalDNS 查询域名的 IP 地址
2. LocalDNS 向 Root DNS 查询域名的授权服务器（假设这里 LocalDNS 的缓存已经过期）
3. Root DNS 将域名授权 DNS 记录回应给 LocalDNS
4. LocalDNS 得到域名授权的记录后，继续向域名授权 DNS 查询域名的 ip 地址
5. LocalDNS 将得到的域名 ip 地址返回给客户端
6. 用户得到域名 IP 地址后，访问站点服务器
7. 站点服务器响应请求，将请求资源返回给客户端

### CDN 访问过程

1. 用户输入访问的域名，操作系统向 LocalDNS 查询域名的 IP 地址
2. LocalDNS 向 RootDNS 查询域名的授权服务器（这里假设缓存已过期）
3. RootDNS 将域名授权 DNS 记录返回给 LocalDNS
4. LocalDNS 得到域名的授权记录后，继续向域名授权 DNS 查询域名的 IP 地址
5. 域名授权 DNS 查询域名记录后（一般是 CNAME），回应给 LocalDNS

6.智能调度 DNS 根据一定的算法和策略（比如静态拓扑、容量等）将最合适的 CDN 节点 IP 地址回应给 LocalDNS

7.LocalDNS 得到域名 IP 地址，返回给客户端.

8.客户端得到 IP 地址后发送请求访问站点服务器
9.CDN 节点服务器应答请求，将内容返回给客户端

通过以上的分析，我们可以得到：为了实现对普通用户透明（使用缓存后用户无需进行任何设置）访问，需要使用 DNS（域名解析）来引导用户来访问 Cache 服务器，以实现透明的加速服务。由于用户访问网站的第一步就是域名解析，所以通过修改 DNS 来引导用户访问是最简单有效的方式。

### 组成要素

对于普通的互联网用户，每个 CDN 节点就相当于一个放置在他周围的网站服务器。通过对 DNS 的接管，用户的请求被透明的指向里他最近的节点，节点中的 CDN 服务器会想网站的原始服务器一样，响应用户的请求。由于它离用户最近，所以响应时间也是更快。

从上面的图中我们可以得知虚线圈起来那块就是 CDN 层，这层是位于用户端和站点服务器之间。

- 智能调度 DNS

  智能调度 DNS 是 CDN 服务中的关键系统，当用户访问加入 CDN 服务的网站时，域名解析请求将最终由 智能调度 DNS 负责处理。它通过一组预先定义好的策略，将当时最接近用户的节点地址提供给用户，使用户可以得到快速的服务。同时它需要与分布在各地的 CDN 节点保持童心，跟踪个节点的健康状态、容量等信息，确保将用户的请求分配到就近可用的节点上。

- 缓存功能服务

  负载均衡设备

  内容 Cache 服务器

  共享存储

<h2>名词解释</h2>

### CNAME 记录（CNAME record）

CNAME 即别名（Canonical Name）；可以用来把一个域名解析成另一个域名，当 DNS 系统在查询 CNAME 左边的名称的时候，都会转向 CNAME 右边的名称在进行查询，一直最总到最后的 PTR 或 A 名称，成功查询才会做出回应，否则失败。

例如，你有一台服务器上存放了很多资料，你是用 `doc.example.com` 去访问这些资源，但又希望通过 `documents.example.com` 也能访问到这些资源，那么你就可以在你的 DNS 解析服务商添加一条 CNAME 记录，将 `documents.example.com` 指向 `doc.example.com` ，添加记录之后，所有访问 `documents.example.com` 的请求都会被转到 `doc.example.com` ，并得到相同的响应。

### CNAME 域名

接入 CDN 时，在 CDN 提供商控制台添加完加速域名后，您会得到一个 CDN 给您分配的 CNAME 域名，您需要在您的 DNS 解析服务上添加 CNAME 记录，将自己的加速域名指向这个 CNAME 域名，这样该域名的请求才会指向 CDN 的节点，以达到加速效果。

### 回源 host

回源 host 决定回源请求访问到原站上的具体站点。

例子 1：源站是域名源站为 `www.a.com` ，回源 host 为 `www.b.com` ，那么实际回源是请求到 `www.a.com` 解析到的 IP，对应的主机上的站点 `www.b.com`

例子 2：源站是 IP 源站为 `1.1.1.1`，回源 host 为 `www.b.com`，那么实际回源的是 `1.1.1.1` 对应的主机上的站点 `www.b.com`

### 协议回源

指回源时使用的协议和客户端访问资源时的协议保持一致，即如果客户端使用 HTTPS 方式请求资源，当 CDN 节点上未缓存该资源时，节点会使用相同的 HTTPS 方式回源获取资源；同理如果客户端使用 HTTP 协议的请求，CDN 节点回源时也使用 HTTP 协议。

## Cookie 的 SameSite 属性

### 前言

2 月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，这导致了线上非常多的问题，着实推动了大家对 Cookie 的理解，所以很有可能会有相关的面试题，即便不是面试题，当问到 HTTP 相关内容时，不妨也扯到这件事情上，一能表明你对前端时事的跟进，二能借此引申到前端安全方面的内容，为你的面试加分。

本文就给大家介绍一下浏览器的 Cookie 以及这个“火热”的 SameSite 属性。

### HTTP

一般我们都会说「HTTP 是一个无状态协议」，不过要注意这里的 HTTP 其实指的是 HTTP/1.x，而所谓无状态协议，简单的理解便是即使同一个客户端连续两次发送请求给服务器，服务器也识别不出这是同一个客户端发送的请求，这导致的问题就是比如你加了一个商品到购物车中，但因为识别不出是同一个客户端，你刷新页面就消失了。

### Cookie

为了解决 HTTP 无状态导致的问题，后面推出了 Cookie。

不过这样说可能会让你产生一些误解。首先无状态并不是不好，有优点，但也会导致一些问题。而 Cookie 的存在也不是为了解决通讯无状态的问题，只是为了解决客户端与服务端会话状态的问题，这个状态是指后端服务的状态而非通讯协议的状态。

#### Cookie 介绍

我们看一下 Cookie，引用维基百科：

> Cookie，类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据。

作为一段一般不超过 4KB 的小型文本数据，它由一个名称（Name）、一个值（Value）和其他几个用于介绍控制 Cookie 有效期、安全性、使用范围的可选属性组成，这涉及的属性我们会在后面介绍。

#### Cookie 的查看

我们可以在浏览器开发者工具中查看到当前页面的 Cookie，尽管我们是在浏览器中看到了 Cookie，这并不意味着 Cookie 文件只是存放在浏览器里。实际上，Cookie 相关的内容还可以存在本地文件中，就比如说 Max 下的 Chrome，存放目录就是 `~/Library/Application Support/Google/Chrome/Default` ，里面会有一个名为 Cookies 的数据库文件，你可以使用 sqlite 软件打开它。

存放在本地的好处就在于即使你关闭了浏览器，Cookie 依然可以生效。

#### Cookie 的设置

简单来说：

1.  客户端发送 HTTP 请求
2.  服务器收到 HTTP 请求，在响应头里面添加一个 Set-Cookie 字段
3.  浏览器受到响应后保存下 Cookie
4.  之后对该服务器每一次请求中都通过 Cookie 字段将 Cookie 信息发送给服务器

#### Cookie 的属性

##### Name/Value

用 JS 操作 Cookie 的时候注意对 Value 进行编码处理。

##### Expires

用于设置 Cookie 的过期时间。

当 Expires 缺省的时候，表示是会话性 Cookie。当 Cookie 为会话性时，值会保存在浏览器内存中，用户关闭浏览器时会失效。需要注意的是，部分浏览器提供了会话恢复功能，这种情况下即便关闭了浏览器，会话期 Cookie 也会被保留下来，就好像浏览器从来没有关闭一样。

与会话性 Cookie 相对的是持久性 Cookie，持久性 Cookie 会保存在用户的硬盘中，直至过期或者清除 Cookie。

这里值得注意的是，设定的日期和时间只和客户端相关，而不是服务端。

##### Max-Age

用于设置在 Cookie 失效之前需要经过的秒数。

Max-Age 可以为正数、负数、甚至是 0.

如果为正数，浏览器会将其持久化，即写到对应的 Cookie 文件中。

如果属性为负数，表示该 Cookie 只是一个会话性 Cookie。

当为 0 时，会立即删除这个 Cookie。

如果 Expires 和 Max-Age 同时存在时，Max-Age 优先级更高。

##### Domain

Domain 制定了 Cookie 可以送达的主机名。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

像淘宝首页设置的 Domain 就是 `.taobao.com` ，这样不论是 `a.taobao.com` 还是 `b.taobao.com` 都可以使用 Cookie。

这里需要注意的是，不能跨域设置 Cookie，这样设置是无效的。

##### Path

Path 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。比如设置了 `Path=/docs` 下的资源会带 Cookie 首部， `/test` 则不会携带 Cookie 首部。

Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

##### Secure 属性

标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。使用 HTTPS 安全协议可以保护 Cookie 在浏览器和服务器之间传输过程不被窃取和篡改。

##### HTTPOnly

设置 HTTPOnly 属性可以防止客户端脚本通过 `document.cookie` 等方式访问 Cookie，有助于避免 XSS 攻击。

##### SameSite

这是一个非常值得讨论的内容。

##### 作用

SameSite 属性可以让 Cookie 在跨站请求是不会被发送，从而可以阻止跨站请求伪造（CSRF）。

##### 属性值

SameSite 可以有下面三种值：

1.  **Strict** ：仅允许一方请求携带 Cookie，即浏览器只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致；
2.  **Lax** ：允许部分第三方请求携带 Cookie；
3.  **None** ：无论是否跨站都会发送 Cookie。

之前默认是 None，Chorme80 之后默认是 Lax。

##### 跨站和跨域

首先要理解一点就是跨站和跨域是不同的。「同站（same-site）/跨站（cross-site）」和「第一方（first-party）/第三方（third-party）」是等价的。但是与浏览器同源策略（SOP）中的「同源（same-origin）/跨域（cross-origin）」是完全不同的概念。

同源策略的同源是指两个 URL 的协议 / 主机名 / 端口一致。同源策略作为浏览器的安全基石，其「同源」判断是比较严格的。

而相对来说，Cookie 中的「同站」判断就比较宽松：只要两个 URL 的 eTLD + 1 相同即可，不需要考虑协议和端口。其中 eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如：`.com` 、`.cn` 等等，eTLD + 1 表示有效顶级域名 + 二级域名，例如： `taobao.com` 等。

举个例子，`www.baidu.com` 和 `www.taobao.com` 是跨站， `www.a.taobao.com` 和 `www.b.taobao.com` 是同站， `a.github.io` 和 `b.github.io` 是跨站。

##### 改变

接下来看下从 None 改成 Lax 到底影响了哪些地方的 Cookie 发送：

| 请求类型  | 实例                                 | 以前        | Strict | Lax         | None        |
| --------- | ------------------------------------ | ----------- | ------ | ----------- | ----------- |
| 链接      | `<a href="..."></a>`                 | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| get 表单  | `<form method="GET" action="..."/>`  | 发送 cookie | 不发送 | 发送 cookie | 发送 cookie |
| post 表单 | `<form method="POST" action="..."/>` | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| iframe    | `<iframe src="..."></iframe>`        | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| AJAX      | `$.get("...")`                       | 发送 cookie | 不发送 | 不发送      | 发送 cookie |
| Image     | `<img src="..."/>`                   | 发送 cookie | 不发送 | 不发送      | 发送 cookie |

从表格中可以看到，对大部分 web 应用而言，Post 表单、iframe、ajax、image 这四种情况从跨站会发送第三方 Cookie 变成了不发送。

#### Cookie 的作用

1.  会话状态管理（如用户登录状态、购物车、游戏分数或其他需要记录的信息）；
2.  个性化设置（如用户自定义设置、主题等）；
3.  浏览器行为跟踪（如跟踪分析用户行为等）。

## DNS 服务器

### 为什么需要 DNS 服务器

网络通讯大部分都是基于 TCP/IP 的，而 TCP/IP 是基于 IP 地址的，所以计算机在网络上进行通讯时只能识别 IP 地址而不能识别域名

### DNS 作用

DNS 是域名系统，它所提供的服务是用来将主机名 和 域名转换为 IP 地址的工作

### 查询总览

假设运行在用户主机上的某些应用程序（例如浏览器或者邮箱）需要将主机名转换为 IP 地址，这些应用程序将调用 DNS 的客户端，并指明需要被转换的主机名

用户主机的 DNS 客户端接收到后，向网络中发送一个 DNS 查询报文，所有 DNS 请求和响应报文使用 UDP 数据包经过端口 53 发生，经过若干延迟后，用户主机上的 DNS 客户端接收到一个提供所希望映射的 DNS 响应报文

### 设计模式

DNS 不采用单点的集中式设计模式，而是使用分布式集群的工作方式，是因为集中式设计会有单点故障、通信容量、远距离时间延迟、维护开销大等问题。

### 查询过程（建议记住）

[![pSFWM5D.png](https://s1.ax1x.com/2023/01/04/pSFWM5D.png)](https://imgse.com/i/pSFWM5D)

1. 检查浏览器中是否缓存过该域名对应的 IP 地址
2. 如果浏览器没有命中，将继续查找本级（操作系统）是否缓存过该 IP
3. 向本地域名解析服务系统发起域名解析的请求（一般是本地运营商的机房）
4. 向根域名解析服务器发起域名解析服务请求
5. 根域名服务器返回 gTLD 域名解析服务器地址
6. 向 gTLD 服务器发起解析请求
7. gTLD 服务器接收请求并返回 Name Server 服务器（通常情况下就是你注册的域名服务器）
8. Name Server 服务器返回 IP 地址给本地服务器
9. 本地服务器缓存解析结果
10. 返回解析结果给用户

### 分类

大致上来说，DNS 服务器分成三类： 根 DNS 服务器, 顶级域 DNS 服务器, 权威 DNS 服务器

[![pSkfD58.png](https://s1.ax1x.com/2023/01/05/pSkfD58.png)](https://imgse.com/i/pSkfD58)

还有另一类重要的 DNS, 称为本地 DNS 服务器, 一台本地 DNS 服务器严格来说并不属于该服务器的层次结构，但它对 DNS 层次结构很重要

当主机发送 DNS 请求时，该请求被发往本地 DNS 服务器，它起代理作用，并将该请求转发到 DNS 服务器层次结构中。

[![pSkfOq1.png](https://s1.ax1x.com/2023/01/05/pSkfOq1.png)](https://imgse.com/i/pSkfOq1)

### 查询方式

在上述中，从请求主机到本地 DNS 服务器的查询是 **递归**的，其余查询是 **迭代**的。

DNS 提供了两种查询过程:

1. 递归查询：在该模式下 DNS 服务器接收客户请求，必须使用一个准确的查询结果回复客户机，如果 DNS 服务器没有存储 DNS 值，那么服务器会询问其他服务器，并将返回一个查询结果给客户机

2. 迭代查询：DNS 服务器会向客户机提供其他能够解释查询请求的 DNS 服务器，当客户机发送查询时，DNS 并不直接回复查询结果，而是告诉客户机，另一台 DNS 服务器的地址，客户再向这台 DNS 服务器提交请求，依次循环直接返回结果

[![pSkhVdP.png](https://s1.ax1x.com/2023/01/05/pSkhVdP.png)](https://imgse.com/i/pSkhVdP)

## HTTPS

### HTTP 为何不安全

在网络中，数据是以包的形式在网络模型各层之间传递的，HTTP 协议位于应用层， TCP/IP 协议的上层，而数据报文在这些层之间都是没有加密的明文，这就导致了下述问题

#### 通信时采用明文（不加密），内容可能被窃听

我们作为客户端处于庞大网络的一个节点，而在通信时，中间会经历很多个阶段，而每个阶段报文内容都有可能会被窃听

#### 无法验证接收报文的完整性，可能已经被篡改

无法验证完整性，意味着收到的报文可能是缺失的，也意味着接收到的报文可能是错误的，也就是不是我们想要的

作为客户端向服务端请求数据，服务器响应的是 A 内容，客户端接收的是 B 内容，但是客户端并不知道 A 和 B 是否相同，因为传输过程中报文可能被篡改了，这个过程被称为“中间人攻击”

#### HTTP 协议不验证通信方身份，因此可能被伪装

HTTP 协议设计的十分简单，并且不验证通信双方，也就意味着，不论是谁发送的请求，只要合法（后台没有限制访问 IP 和端口号），服务器都会被接受，而不确定通信方身份可能会导致以下的问题：

- 无论确定请求发送至目标 Web 服务器是否按照真实意图返回响应的那台服务器，有可能是已经伪装的 Web 服务器
- 无法确定响应返回到的客户端是否是按照真实意图接收响应的客户端，有可能是已伪装的客户端
- 无法确定正在通信的对方是否具有访问权限，因为某些 Web 服务器上保存着重要信息，只想发给特地用户通信的权限
- 无法判断请求是来自何方，出自谁手
- 即是无意义的请求也照单全收，无法阻止海量请求下的 DoS 攻击（Denial of Service），也就是容易遭受攻击

### HTTPS 实现原理

HTTPS 本质也是基于 HTTP 协议，不过通过一些安全手段来解决上面 HTTP 存在的问题

它的通用接口部分使用 SSL(Secure Socket Layer) 和 TLS(Transport Layer Security)协议替代，

以前来说，HTTP 协议是应用层协议，直接和下层 TCP 进行通信， 而增加了 SSL 协议之后，就变成了 HTTP 先跟 SSL 通信， 再由 SSL 和 TCP 通信，也就是说 HTTPS 是披着 SSL 协议外壳的 HTTP 协议

简单来说 HTTPS = HTTP + 加密 + 证书 + 完整性保护

#### 加密

HTTPS 采用混合加密机制，也就是对称加密与非对称加密混用来实现加密机制

**数据传输阶段（对称密钥加密）**

对称密钥加密又称为共享密钥加密 （Common key crypto system）, 是在加密和解密阶段使用同一个密钥的方式，也就说，通信双方必须存储同一份密钥

也就是说只要攻击者拿到了密钥，就可以发起攻击

因此，加密的重中之重就是 **如何安全地发送密钥并不泄漏**

**证书交换验证阶段（非对称加密）**

公开密钥加密（Public-key cryptography）解决了上述的发送密钥问题，它采用一对非对称的密钥，一把公钥，一把私钥

加密过程就是: 发生加密报文的一方就是 用对方的公开密钥进行加密， 接收方用自己本地的私钥进行解密，也就是说发送方并不需要附带着发送用来解密的密钥，这种方式就不需要考虑密钥在传输过程中被攻击，并获取

私钥和公钥是一对多的关系，公钥可以随意转发，只要采用公钥加密的报文，都只能使用对应私钥进行解密

**混合验证机制**

HTTPS 采用的是混合加密

原因： 非对称加密相比对称加密更加复杂，效率更低，在前端业务中一般都是存在大量的 HTTP 请求， 所以非对称加密的低效是无法被接受的，此外非对称加密的场景只在服务端保存私钥，也就是说一对公私钥只能单向传输数据，因此可以用来确认确信安全以及服务端返回证书。确认安全之后，传输数据采用的就是速度更快的对称加密

#### 证书

上面的过程也存在一个问题，安全的本质是使用密钥进行加密，但是如果密钥本身就有问题，那么安全也就无从谈起，因此这个密钥必须是通信双方认可的，这个工作不能交给客户端做，也不能交给服务端做，一般交给第三方权威机构 -- 数字证书认证机构（CA, certificate Authority）

认证机关的公开密钥必须安全地转交给客户端，使用通信方式是，如何安全转交是一件很困难的事，因此多数浏览器发布版本时，都会是现在内部置入常用认证机关的公钥。

#### 数据完整性

确保数据完整性，也就意味着数据安全没有被第三方篡改，这时候就需要通过 **数字签名**

数字签名是一段由发送者生成的特殊加密校验码，用于传输过程中确认报文的完整性。

数字签名涉及到了两种技术：**非对称加密** 和 **数字摘要**， 生成数字摘要的算法通过 **MD5** 和 **SHA** 这种不可逆算法， 将不定长的报文内容提取出定长的数字摘要

数字签名的整个签名和校验过程分为五步：

1. 发送方用摘要算法对报文提取生成数组摘要
2. 使用私钥对摘要进行加密，加密后的摘要作为数字签名附加在报文上一起发生给接收方
3. 接收方收到报文后，使用相同的摘要算法提取出摘要
4. 在使用公钥对报文的数字签名进行解密
5. 如果解密后的数字签名与提取到的摘要相同，那么说明报文没有被篡改，数据是完整的

<span style="color: red">多说一句，对于本地存储，无论是服务端的私钥还是客户端的随机数，都不是 HTTPS 通信过程的安全考虑，HTTPS 只保证在网络传输过程的数据安全性，本地的内容安全不被窃取依靠的是防火墙，杀毒软件等等。</span>

#### 完整流程

<h3 style="color: #007aff">证书验证阶段</h3>

1. 客户端发起 HTTPS 请求
2. 服务端返回 HTTPS 证书
3. 客户端验证证书是否合法，不合法则提示警告

<h3 style="color: #007aff">数据传输阶段</h3>

1. 当证书验证合法后，在本地生成随机密码串
2. 通过公钥加密随机密码串，并把加密后的随机密码穿串传输到服务端
3. 服务端通过私钥对随机密码串进行解密
4. 服务器通过客户端传入的随机密码串构建对称加密算法，对返回的结果内容进行加密后再传输

### HTTPS 并不全是优点

<h4 style="margin-top: 20px; border-bottom: 1px solid #eaecef">速度慢</h4>

HTTPS 速度会比 HTTP 慢 2 ～ 100 倍

HTTPS 慢其实是慢在 SSL 协议通信商上，因此 SSL 协议要进行加密解密处理，会占用 CPU 和 网络资源，总体会慢一些

<h4 style="border-bottom: 1px solid #eaecef">CA 证书一般不免费</h4>

申请 CA 证书是需要花钱的，当然有很多手段可以申请免费的 HTTPS 证书，但是大部分权威机构还是需要收费的。所以对于大部分小型开发者来说，使用 HTTP 协议更划算

### 相关题目

<h4 style="margin-top: 20px; border-bottom: 1px solid #eaecef">为什么 HTTP 不安全</h4>

1. 报文是明文的，没有加密
2. 无法验证报文的完整性，传输过程中可能会被篡改
3. 不验证通信双方的身份，可能会被伪装

<h4 style="border-bottom: 1px solid #eaecef">为什么 HTTPS 安全</h4>

HTTPS = HTTP + 加密 + 证书 + 完整性保护

相关安全操作是通过 SSL 协议来进行实现的

<h4 style="border-bottom: 1px solid #eaecef">HTTPS 绝对安全吗</h4>

并不是，HTTPS 也会被抓包， 只不过内容被加密过，不过用户可以主动对证书进行授权，如果用户授权通过，那么代理软件是可以对传输内容进行解密的

## HTTPS 握手过程 🤝

1. 服务端将自己的公钥登录至数学证书认证机构，数字证书认证机构用自己的私钥对服务器公钥署数学签名
2. 客户端发出 HTTPS 请求，请求服务端建立 SSL / TLS 连接
3. 服务端接收到 HTTPS 请求，将申请到数字证书和服务端公钥一同返回给客户端
4. 客户端在接收到服务端公钥后，数字证书认证机构利用提前植入到浏览器的认证公钥，向数字证书认证机构认证公钥证书上的数字签名，确认服务器公钥的真实性
5. 认证通过之后，客户端随机生成通信使用的密钥，然后使用服务端公钥对密钥进行加密，返回给服务端
6. 服务端收到加密内容后，通过服务端私钥进行非对称解密，得到客户端密钥，至此双方都获得了对称加密的密钥
7. 之后，双方使用密钥进行对称加密通信

## HTTP 报文

### 请求报文 requeset

一个 HTTP 请求报文由请求行 (request line), 请求头 (header), 空行 和 请求数据四个部分组成

#### 请求行

包括请求方法字段，URL 字段 和 HTTP 协议版本， 如：GET /index.html HTTP/1.1

#### 请求头

请求头由关键字 / 值组成，每行一对，关键字和值用英文冒号隔开

请求头部通知服务器有关于客户端请求的信息，典型的请求有：

- `User-Agent`: 产生请求的浏览器类型
- `Accept`: 客户端可识别的内容类型列表
- `Host`: 请求的主机名，允许多个域名同处于一个 IP 地址, 即虚拟主机
- `Content-Type`: 请求体的 MIME 类型（用于 POST 和 PUT 请求中）， 如：`Content-Type:application/x-www-form-urlencoded`
- 空行

最后一个请求头之后是空行，发送回车符和换行符，通知服务器以下不再有请求头

#### 请求数据

请求数据不在 get 方法中使，而是 POST 方法中使用，POST 方法适用于需要客户填写表单的场合，与请求数据相关最常使用的请求头是 `Content-Type` 和 `Content-Length`

### 响应报文 response

相应报文由 状态行、响应头、空行、响应正文 组成

## HTTP 版本

### HTTP1.0 和 HTTP1.1 的区别

>

#### 长连接

HTTP/1.1 支持长连接和管道化连接，在一个 TCP 连接上可以传送多个 HTTP 请求，避免了因为多次建立 TCP 连接的时间消耗和延时

#### 缓存处理

HTTP/1.1 新增了 `ETag` 、 `If-Unmodified-Since`、 `If-Match`、 `If-None-Match` 等新的请求头来控制缓存

#### 带宽优化以及网络连接的使用

HTTP/1.1 在请求头中引入了 range， 支持断点续传的功能

#### Host 头处理

在 HTTP/1.0 中认为每台服务器都有唯一的 IP 地址，但随着虚拟主机技术的发展，多个主机共享一个 IP 地址越发普遍， HTTP/1.1 的请求消息和响应消息都应该支持 Host 头域，且请求消息中如果没有 Host 头域会报 400 错误

### HTTP/1.1 和 HTTP/2.0 区别

#### 二进制分帧

- **帧**：HTTP/2 数据通信的最小单位消息，指的是 HTTP/2 逻辑上的 HTTP 消息，例如请求和响应等消息由一个或多个帧组成。
- **流**：存在于连接中的一个虚拟通道，流可以承载双向消息，每个流都有一个唯一的证书 ID

HTTP/2 采用了二进制格式传输数据，而非 HTTP/1.x 的文本格式，二进制协议解析起来更高效

#### 头部压缩

HTTP/1.x 会在请求和响应中重复携带不常改变的，冗长的头部信息，给网络带来额外的负担

- HTTP/2 在客户端和服务端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送
- 首部表在 HTTP/2 的连续存续期内始终存在，有客户端和服务端共同渐进地更新
- 每个新的首部键值对要么被追加到当前表的末尾，要么替换表中的值

你可以理解为只发送差异数据，而不是全部数据，从而减少头部的信息量

[![pSEniYd.png](https://s1.ax1x.com/2023/01/06/pSEniYd.png)](https://imgse.com/i/pSEniYd)

#### 服务端推送

服务端可以在发送 HTML 时主动推送其他资源，而不是等浏览器解析到相应的位置，发起请求再响应。

例如服务端可以主动把 JS, CSS 文件推送给客户端，而不需要客户端解析 HTML 时发送这些请求。

服务端可以主动推送，客户端也有权利选择是否接受。 如果服务端推送的资源已被浏览器缓存过，浏览器可以通过发送`RET_STREAM`帧来拒收。主动推送也遵守同源策略，服务器不会随便推送第三方资源给客户端

#### 多路复用

HTTP/1.x 中，如果想并发多个请求，必须使用多个 TCP 连接，但浏览器为了控制资源，还会对单个域名 6-8 个 TCP 链接的请求限制，同时当带宽不足时，多个 tcp 还会出现竞争带宽的情况

HTTP/2 中:

- 同域名下所有通信都在单个连接中完成
- 单个连接可以承载任意数量的双向数据流
- 数据流以消息的形式发送，而消息又由一个或者多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装

[![pSeuCwV.png](https://s1.ax1x.com/2023/01/09/pSeuCwV.png)](https://imgse.com/i/pSeuCwV)

### HTTP/3

<div style="margin: 24px 0"></div>

#### HTTP/2 的缺陷

#### TCP 的队头缺陷

在 TCP 传输过程中，由于单个数据包的丢失而造成的阻塞称为 TCP 上的队头阻塞。 HTTP/2 只解决了应用层面的队头阻塞， 队头阻塞的问题还存在于 TCP 协议本身

#### TCP 建立连接的延时

TCP 以及 TCP + TLS 建立连接所产生的延时也是影响传输效率的一个主要因素

#### TCP 协议僵化

**中间件僵化**

我们把互联网各处搭建的设备叫做中间设备（中间件），比如路由器、NAT、防火墙、交换机等，它们通常以来一些很少升级的软件，这些软件大量使用 TCP 特性，设置之后便很少进行更新。这就对我们更新 TCP 的时候造成了困难，新协议的数据包经过这些中间件时，它们不会去理解包的内容从而丢弃了这些数据包。

**操作系统**

因为 TCP 协议都是通过操作系统来实现的，应用程序只能使用不能修改，通常操作系统的更新都滞后于软件的更新，所以想要更新操作系统内核中的 TCP 协议也是非常困难的

#### QUIC 协议

HTTP/3 选择了一个折中的方法 -- UDP 协议。 基于 UDP 实现了类似于 TCP 的多路数据流、传输可靠性等功能，我们把这套功能称为 QUIC 协议。

- 实现了类似 TCP 的流量控制、传输可靠性功能
- 集成了 TLS 加密功能
- 实现了 HTTP/2 中的多路复用功能
- 实现了快速握手功能

## HTTP 状态码

### 信息响应

1. 100 Countinue

这个临时响应声明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它

2. 101 Switching Protocol

该代码是响应客户端的 Upgrade 标头发送的，并且指示服务器也正在切换的协议

3. 102 Processing

此代码表示服务器已收到并正在处理该请求，但没有响应可用

4. 103 Early Hints

此状态代码主要用于 Link 链接头一起使用， 以允许用户代理在服务器仍在准备响应时开始预加载资源

### 成功响应

1. 200 OK

请求成功，成功的含义取决于 HTTP 方法:

- GET: 资源已被提取并在消息正文中传输;
- HEAD: 实体标头位于消息正文中
- POST: 描述动作结果的资源在消息体中传输
- TRACE: 消息正文包含服务器接收到的请求消息

2. 201 Created

请求已成功，并因此创建了一个新的资源，这通常是在 POST 请求，或是某些 PUT 请求之后返回的响应

3. 202 Accepted

请求已经接收到，但还未响应，没有结果，意味着不会有一个异步的响应去表明当前请求的结果，预期另外的进程和服务区处理请求，或者批处理

4. 203 Non-Authoritative Information

服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝，当前的信息可能是原始版本的子集或者超集。
使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回 200 OK 的情况下才是合适的

5. 204 Not Content

服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。响应可能通过实体头部的形式，返回新的或更新后的元信息。如果存在这些头部信息，则应当与所请求的变量相呼应。如果客户端是浏览器的话，那么用户浏览器应保留发送了该请求的页面，而不产生任何文档视图上的变化，即使按照规范新的或更新后的元信息应当被应用到用户浏览器活动视图中的文档。由于 204 响应被禁止包含任何消息体，因此他始终以消息头后的第一个空行结尾。

6. 205 Reset Content

服务器成功处理了请求，且没有返回任何内容。但是与 204 响应不同，返回此状态码的响应要求请求者重置文档视图。该请求主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松的开始另一次输入。与 204 响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一空行结束。

7. 206 Partial Content

服务器已经成功处理了部分 GET 请求。类似于 FlashGet 或者迅雷这类的 HTTP 下载工具都是使用此类响应实现断点续传或者将一个大文档分解成多个下载段同时下载。该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If-Range 来作为请求条件。

8. 207 Multi-Status

由 WebDAV（RFC 2518）扩展的状态码，代表之后的消息体将是一个 XML 消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码。

9. 208 Already Reported

在 DAV 里面使用：propstat 响应元素以避免重复枚举多个绑定的内部成员到同一个集合。

10. 226 IM Used

服务器已经完成了对资源的 GET 请求，并且响应是对当前实例应用的一个或多个实例操作结果的表示。

### 重定向

1. 300 Multiple Choice

被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。

2. 301 Moved Permanently

被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URL 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也可缓存的。

3. 302 Found

请求的资源现在临时从不同的 URL 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在 Cache-Control 或 Expires 中进行了指定的情况，这个响应才是可缓存的。

4. 303 See Other

对应当前的响应可以在另一个 URL 上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的 POST 请求输出重定向到一个新的资源。

5. 304 Not Modified

如果客户端发送一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304 响应禁止包含消息体，因此始终以消息头的第一个空行结尾。

6. 305 Use Proxy

被请求的资源必须通过指定的代理才能访问。Location 域中将给出指定的代理所在的 URL 信息，接受这需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立 305 响应。

7. 306 unused

在最新版的规范中，306 状态码已经不再被使用。

8. 307 Temporary Redirect

请求的资源现在临时从不同的 URL 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在 Cache-Control 或 Expires 中进行了指定的情况下，这个响应才是可缓存的。

9. 308 Permanent Redirect

这意味着资源现在永久位于 Location：HTTP Response 标头指定的另一个 URL。这与 301 Moved Permanently HTTP 响应代码具有相同的语义，但用户代理不能更改所使用的 HTTP 方法：如果第一个请求中使用 POST，则必须在第二个请求中使用 POST

### 客户端响应

1. 400 Bad Request

- 语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求；
- 请求参数有误。

2. 401 Unauthorized

当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authenticate 头信息的请求。如果当前请求已经包含了 Authenticate 证书，那么 401 响应代表着服务器验证已经拒绝了那些证书。如果 401 响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。

3. 402 Payment Required

此响应码保留以便将来使用，创造此响应码的最初目的是用于数字支付系统。

4. 403 Forbidden

服务器已经理解请求，但是拒绝执行它。与 401 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个 404 响应，假如他不希望客户端获得任何信息。

5. 404 Not Found

请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用 410 状态码来告知旧资源因为某些内部配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404 这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。

6. 405 Method Not Allowed

请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个 Allow 头信息用以表示出当前资源能够接受的请求方法的列表。鉴于 PUT，DELETE 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回 405 错误。

7. 406 Not Acceptable

请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。

8. 407 Proxy Authentication Required

与 401 响应相似，只不过客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个 Proxy-Authenticate 用以进行身份询问。客户端可以返回一个 Proxy-Authorization 信息头用以验证。

9. 408 Request Timeout

请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这个请求而无需进行任何更改。

10. 409 Conflict

由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。

11. 410 Gone

被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否为永久的，那么就应该使用 404 状态码。除非额外说明，否则这个响应是可缓存的。

12. 411 Length Required

服务器拒绝在没有定义 Content-Length 头的情况下接受请求。在添加了标明请求消息体长度的有效 Content-Length 头后，客户端可以再次提交该请求。

13. 412 Precondition Failed

服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或者多个。这个状态码允许客户端在获取资源的请求的元信息（请求头字段数据）中设置先决条件，以此来避免该请求方法被应用到其希望的内容以外的资源上。

14. 413 Payload Too Large

服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。如果这种状况是临时的，服务器应当返回一个 Refty-After 的响应头，以告知客户端可以在多少时间以后重新尝试。

15. 414 URL Too Long

请求的 URL 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。这比较少见，通常情况包括：本应使用 POST 方法的表单提交变成了 GET 方法，导致查询字符串（Query String）过长。

16. 415 Unsupported Media Type

对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器所支持的格式，因此请求被拒绝。

17. 416 Range Not Satisfiable

如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 If-Range 请求头，那么服务器就应当返回 416 状态码。

18. 417 Expectation Failed

此响应代码意味着服务器无法满足 Expect 请求标头字段指示的期望值。

19. 418 I'm a teapot

服务器拒绝尝试用“茶壶冲泡咖啡”。

20. 421 Misdirected Request

该请求针对的是无法产生响应的服务器。这可以由服务器发送，该服务器为配置为针对包含在请求 URL 中的方案和权限的组合产生响应。

21. 422 Unprocessable Entity（WebDAV (opens new window)）

请求格式良好，但由于语义错误而无法遵循。

22. 423 Locked（WebDAV (opens new window)）

正在访问的资源被锁定。

23. 424 Failed Dependency（WebDAV (opens new window)）

由于先前的请求失败，所以这次请求失败。

24. 425 Too Early

服务器不愿意冒着风险去处理可能重播的请求。

25. 426 Upgrade Required

服务器拒绝使用当前协议执行请求，但可能在客户机升级到其他协议后愿意这样做。服务器在 426 响应中发送 Upgrade 头一直是所需的协议。

26. 428 Precondition Required

原始服务器要求该请求是有条件的。旨在防止“丢失更新”问题，即客户端获取资源状态，修改改状态并将其返回服务器，同时第三方修改服务器上的状态，从而导致冲突。

27. 429 Too Many Requests

用户在给定时间内发送了太多请求（“限制请求速率”）。

28. 431 Request Header Fields Too Large

服务器不愿意处理请求，因为他的请求头字段太大。请求可以在减少请求头字段的大小后重新提交。

29. 451 Unavailable For Legal Reasons

用户请求非法资源，例如：由政府审查的网页

### 服务端响应

1. 500 Internal Server Error

服务器遇到了不知道如何处理的情况。

2. 501 Not Implemented

此请求方法不被服务器支持且无法被处理。只有 GET 和 HEAD 时要求服务器支持的，他们必定不会返回次错误代码。

3. 502 Bad Gateway

此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。

4. 503 Service Unavailable

服务器没有准备好处理请求。常见原因是服务器因维护或重载而停机。请注意，与此响应一起，应发送解释问题的用户友好页面。这个响应应该用于临时条件和 Retry-After：如果可能的话，HTTP 头应该包含恢复服务之前的估计时间。网站管理员还必须注意与此响应一起发送的与缓存相关的标头，因为这些临时条件响应通常不应被缓存。

5. 504 Gateway Timeout

当服务器作为网关，不能及时得到响应时返回此错误代码。

6. 505 HTTP Version Not Supported

服务器不支持请求中所使用的 HTTP 协议版本。

7. 506 Variant Also Negotiates

服务器有一个内部配置错误：对请求的透明内容协议导致循环引用。

8. 507 Insufficient Storage

服务器有内部配置错误：所选的变体资源被配置为参与透明内容协商本身，因此不是协商过程中的适当端点。

9. 508 Loop Detected（WebDAV (opens new window)）

服务器在处理请求时检测到无限循环。

10. 510 Not Extended

客户端需要对请求进一步扩展，服务器才能实现它。服务器会回复客户端发出扩展请求所需的所有信息。

11. 511 Network Authentication Required

511 状态码指示客户端需要进行身份验证才能获得网络访问权限。

### HTTP 相关

HTTP（Hyper Text Transfer Protocol）超文本协议的缩写，是一个用于从 WWW 服务器传输超文本到本地浏览器的传输协议。HTTP 是一个应用层协议，有请求和相应构成，是一个标准的客户端和服务器模型

- 基于请求/响应模型的协议
- 简单快速
- 灵活
- 无连接
- 无状态

#### HTTP 报文

#### HTTP 方法

- GET

请求指定的页面信息，并返回实体主体

- HEAD

类似于 get 请求，只不过返回的响应中没有具体的内容，用于获取报文头部

- POST

想指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。

- PUT

从客户端想服务器传送的数据取代指定的文档内容

- DELETE

请求服务器删除指定的页面

- CONNECT

HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器

- OPTIONS

允许客户端查看服务器性能

- TRACE

会先服务器收到的请求，主要用于测试或诊断

### GET 和 POST 的区别 （需记）

1. get 请求会被浏览器主动 cache，post 则需要手动设置
2. get 请求把请求参数放在 url 上，即 HTTP 协议头；post 把参数放在 HTTP 包体内
3. get 请求传输数据量小，一般限制在 2kb 左右，但是执行率高； post 请求传输数据比较大 （IIS4 80KB，IIS5100KB），执行效率高
4. get 请求只能进行 url 编码； post 请求支持多种编码方式
5. get 产生的 url 可以加入浏览器书签，post 不可以
6. get 请求参数会被完整保留在浏览器历史记录，post 请求参数不会被保留
7. get 比 post 不安全，因为参数直接暴露在 url 上，所有不能用来传递敏感信息

### HTTP 状态码

> 状态码：有三位数字组成，第一个数字定义了响应类型

- 1xx: 指示信息，表示请求已接受，继续处理
- 2xx: 成功，表示请求已成功接受，处理
- 3xx: 重定向
- 4xx: 客户端错误
- 5xx: 服务端错误

### HTTP 持久化连接与管道化

持久化连接：在事务处理结束后仍然保持打开状态的 TCP

持久连接会在不同事务之间保持打开状态，直到客户端或服务端决定关闭为止。重用已对目标服务器打开的空闲持久连接，就可以避开缓慢的连接建立阶段。而且，已经打开的连接还可以避免慢启动的拥塞适应阶段，以便更快速的进行数据传输。所以，持久连接降低了时延和连接建立的开销，将连接保持在已调谐状态，而且减少了打开连接的潜在数量

在 HTTP 1.0 中，默认的是短链接，没有正式规定 Connection: Keep-alive 操作

在 HTTP 1.1 中，所有连接都是 Keep-alive，也就是默认持久化连接。HTTP 1.1 允许在持久连接上可选的使用请求管道，是相对于 Keep-alive 连接的又一性能优化。在响应到达之前，可以将多条请求放入队列，当第一条请求通过网络流向服务器时，第二条和第三条请求也可以开始发送了。在高时延的网络条件下，这样做可以降低网络的环回时间，提高性能

管道连接注意点：

1. 如果 HTTP 客户端无法确认连接是持久的，就不应该使用管道
2. 必须按照与请求相同的顺序回送 HTTP 响应
3. HTTP 客户端必须做好连接会在任一时刻关闭的准备，还要准备好重发所有未完成管道化的请求
4. 出错的时候，管道连接会阻碍客户端了解服务器执行的那些请求，由于无法安全地重试 post 请求这样的非幂请求，所以出错时就存在某些方法永远不会被执行的风险

### Keep-Alive（长连接）

---

#### TCP 长连接

TCP 长连接是一种保持 TCP 连接的一种机制。当一个 TCP 连接建立时，启动 TCP 连接的一端便会设置一个计时器，当计时器到 0 时，便会发送一个 TCP 探测包，如果对方收到信息并且给出响应，则 TCP 连接保持，否则断开。

keep alive 技术是 TCP 技术的一个可选项，因为不当的配置可能会导致一个正在使用的 TCP 连接被提前关闭，所以默认是关闭的。

#### HTTP 长连接

要开启 HTTP 长连接，只需要在请求头和响应头加上 `Connection: Keep-Alive`，如要断开，则换成 `Connection: Close`。其实现方式与 TCP 长连接类似，不过他是通过每次请求来确定是否继续保持连接。

#### 两者的关系

TCP 和 HTTP 的长连接是两种不同的技术，不存在谁依赖于谁。TCP 长连接是用于探测对端是否存在，HTTP 长连接则用于协商以复用 TCP 长连接。即使 TCP 未开启长连接，也不妨碍在 HTTP 层开启长连接。

## 三次握手，四次挥手（需记）

### 三次握手

1. 客户端发起请求，并将自己的状态 设置为 待连接 状态
2. 服务端接收到请求， 并返回响应，同时也将自己的状态设置为待连接状态
3. 客户端接收到响应之后，发出信息告诉服务端自己已经接收到请求，同时将自己的状态设置为已连接
4. 服务端接收到信息后，将自己的状态设置为已连接
5. 客户端和服务端可以正式开始通信

### 四次挥手

1. 客户端发送请求，通知服务端将要断开连接，同时将自己的状态设置为断开状态；
2. 服务器接收到请求之后，通知客户端，当前可能还有响应没有发送完；
3. 服务端发送完所有响应之后，通知客户端所有响应均已发送，可以断开连接，同时将自己状态设置为待断开状态
4. 客户端接收到通知后，将自己的状态设置为断开状态，同时通知服务端自己已经断开
5. 服务端接收到通知后，也将自己的状态设置为断开状态
6. 服务端和客户端通信正式断开

### 为什么建立连接是三次握手，关闭连接是四次挥手

---

#### 建立连接

为了实现可靠数据传输，TCP 协议的通信双方都必须维护一个序列号，以标志发送出去的数据包中，哪些是已经被对方收到的。三次握手的过程即是通信双方相互告知序列号起始值，并确认对方已经收到了序列号起始值的必经步骤。

如果只是两次握手，至多只有连接发起方的起始序列号能被确认，另一方选择的序列号则得不到确认，防止已失效的连接请求报文发送到服务端引发错误。

#### 关闭连接

关闭连接时，服务方收到对方的关闭请求时，仅仅表示对方不再发送数据了，但是仍然能够接收数据，而自己也未必全部数据都发送给对方了，所以己方可以立即关闭，也可以发送一些数据给对方后关闭。

所以之所以是四次挥手而不是三次挥手，则是需要确保数据能够完全完成传输。

## 跨域

### 同源策略

同源策略限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。

这是一个用于隔离潜在恶意文件的关键安全机制

什么是源：协议，域名和端口， 这三者任一不同，就算跨域

什么是限制：不是一个源的文档，没有权限去操作另一个源的文档，如：

1. cookie、localStorage 和 indexDB 无法读取
2. DOM 无法获得
3. Ajax 请求发送成功，但是响应会被浏览器拦截

### 跨域通信方式

#### 1. JSONP(只支持 get 请求)

> 通过 script 标签的异步加载实现，利用 script 标签不受同源策略的限制，天然可以跨域的特性

```js
const script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://www.mock-api.com/?callback=jsonp";

document.head.appendChild(script);

function jsonp(...res) {
  console.log("res", res);
}
```

#### 2. Hash

> url#后面的内容就叫 hash， hash 改变，页面不会刷新

```js
// 在 A 中伪代码
const B = document.getElementsByTagName("iframe");
B.src = B.src + "#" + "data";

// 在 B 中的伪代码
window.onhashchange = function () {
  const { data } = window.location;
};
```

#### postMessage

> H5 新增的 postMessage() 方法，可以用来做跨域通信

```js
// 在 A 窗口
const url = "...";
const Bwindow = window.open(url);
Bwindow.postMessage("data", url);

// 在 B 窗口
window.addEventListener(
  "message",
  function (event) {
    console.log(event.origin); // A 窗口 url
    console.log(event.source); // A 窗口 window 对象
    console.log(event.data); // A 窗口传过来的数据
  },
  false
);
```

#### websocket

> WebSocket protocol 是 HTML5 一种新的协议，它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是 server push 技术的一种很好的实现

```js
const ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function (event) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets");
};

ws.onmessage = function (event) {
  console.log("Received Message: ", event.data);
  ws.close();
};

ws.onclose = function (event) {
  console.log("Connection closed");
};
```

#### CORS(现代浏览器普遍跨域解决方法)

> 整个 CORS 通信过程都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨域，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。因此，实现 CORS 通信的关键是服务器，只要服务器实现了 CORS 接口，就可以跨域通信

**CORS 需要浏览器和服务端同时支持，IE8 和 9 需要通过 XSDomainRequeset 来实现**

通过这种方式解决跨域问题，会在发送请求的时候出现两种情况，分别为 **简单请求** 和 **复杂请求**

**1. 简单请求**

只要同时满足以下两大条件，就属于简单请求

1 使用下列方法之一：

- GET
- HEAD
- POST

2. Content-Type 的值仅限于以下三者之一：

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

请求中的任意 XMLHttpRequesetUpload 对象均没有注册任何事件监听器

XMLHttpRequesetUpload 对象可以使用 XMLHttpRequeset.upload 属性访问

**2. 复杂请求**

不符合以上条件的就是复杂请求，复杂请求的 CORS 请求，会在正式通信之间，增加一次 HTTP 查询请求，称为 <i>预检请求</i>， 该请求的方法是 Option，通过该请来查询服务端是否允许跨域请求

### 服务端实现 CORS 的方式

---

#### NodeJS

```js
// 以 express 为例
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});
```

#### Nginx

```js
server {
  add_header Access-Control-Allow-Credentials true;
  add_header Access-Control-Allow-Origin $http_origin;

  location /file {
    if($request_method = 'OPTIONS') {
      add_header Access-Control-Allow-Origin $http_origin;
      add_header Access-Control-Allow-Methods $http_access_control_request_methods;
      add_header Access-Control-Allow-Credentials true;
      add_header Access-Control-Allow-Headers $http_access_control_request_headers;
      add_header Access-Control-Max-Age 1728000;
      return 204;
    }
  }
}
```

## 什么是 WebSocket

### 定义

WebSocket 是一个持久化的网络通信协议，可以在单个 TCP 连接上进行 **全双工通讯**，没有了 **Requeset** 和 **Response** 的概念，两者地位完全平等，连接一旦建立，客户端和服务端之间可以实时进行双向数据传输。

### 关联和区别

---

#### HTTP

1. HTTP 是非持久协议，客户端想知道服务端的处理进度只能通过长轮询或者是 long poll 的方式，但是前者对服务器压力大，后者则会因为一直等待响应造成阻塞

[![pSuMiX4.png](https://s1.ax1x.com/2023/01/12/pSuMiX4.png)](https://imgse.com/i/pSuMiX4)

2. 虽然 http1.1 默认开启了 `keep-alive` 长链接保持了这个 TCP 通道使得在一个 HTTP 连接中可以发送多个请求，接受多个响应，但是一个请求只能有一个响应，而且这个响应也是被动的，不能主动发起

3. WebScoket 虽然是独立于 HTTP 的一种协议，但是 WebSocket 必须依赖 HTTP 协议进行一次握手（在握手阶段是一样的），握手成功后，数据是直接从 TCP 通道传输，与 HTTP 无关了，可以用一张图理解两者有交集，但不是全部。

[![pSuMTER.png](https://s1.ax1x.com/2023/01/12/pSuMTER.png)](https://imgse.com/i/pSuMTER)

#### socket

1. socket 也被称为套接字，与 HTTP 和 WebSocket 不一样，socket 不是协议，它是在程序层面上对传输层协议（可以主要理解为 TCP/IP）的接口封装，可以理解为一个能够提供端对端的通信的调用接口（API）

2. 对于程序员而言，其需要在 A 端创建一个 socket 实例，并为这个实例提供其所要连接的 B 端的 IP 地址和端口号，而在 B 端创建另一个 socket 实例，并且绑定本地端口号来进行监听。当 A 和 B 建立连接后，双方就建立了一个端对端的 TCP 连接，从而可以进行双向通信。WebSocket 借鉴了 socket 的思想，为客户端和服务端之间提供了类似的双向通信机制。

### 应用场景

WebSocket 可以做弹幕、消息订阅、多玩家游戏、协同编辑、股票基金实时报价、视频会议、在线教育、聊天室等应用实时监听服务端变化

### WebSocket 握手

- WebSocket 握手请求报文

```md
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

下面是与传统 HTTP 报文不同的地方：

```md
Upgrade: websocket
Connection: Upgrade
```

表示发起的是 WebSocket 协议

```md
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

`Sec-WebSocket-Key` 是由浏览器随机生成的，验证是否可以进行 WebSocket 通信，防止恶意或者无意的连接；

`Sec-WebSocket-Protocol` 是用户自定义的字符串，用来标识服务所以需要的协议；

`Sec-WebSocket-Version` 表示支持的 WebSocket 版本。

- 服务端响应

```md
HTTP/1.1 101
Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

101 响应码 表示要转换协议。

`Connection: Upgrade` 表示升级新协议请求

`Upgrade: websocket` 表示升级为 WebSocket 协议

`Sec-WebSocket-Accept` 是经过服务器确认，并加密过后的 `Sec-WebSocket-Key`， 用来证明客户端和服务端之间能够进行通信了。

`Sec-WebSocket-Protocol` 表示最终使用的协议

至此，客户端和服务器握手成功建立了 WebSocket 连接，HTTP 已经完成了他所有工作，接下来就是完全按照 WebSocket 协议进行通信。

### 使用 WebSoeket(前端)

---

#### WebSocket 心跳

可能会有某些未知情况导致 socket 断开，而客户端和服务端却不知道，需要客户端定时发送一个 **心跳 ping** 让服务端知道自己在线， 服务端也需要回复一个 **心跳 pong** 告诉客户端自己可用，否则视为断开

#### WebSocket 状态

WebSocket 对象中的 readyState 属性有四种状态：

- 0: 表示正在连接
- 1: 表示连接成功，可以通信了
- 2: 表示连接正在关闭
- 3: 表示连接已经关闭，或者打开连接失败

#### 代码演示

```ts
import emitter from "@/mitt/index";
import { clearRepetition } from "@/utils";
import cloneDeep from "@/utils/cloneDeep";

export const wsChatMsg = "ws-chat-msg";
export const wsWatchInfo = "ws-watch-info";
export const wsLiveNotice = "ws-live-notice";
export const wsRandomSelect = "ws-random-select";

interface WsBodyProp {
  c: number;
  d: DProp;
  u?: UProp[];
}

interface DProp {
  r: string; // 活动id
  n: string; // 聊天人用户名
  i: string; // 用户人id
  f: string; // 活动头像
  m: string; // 聊天内容
  t: string | number; // 发送时间
  org?: string;
  isAdmin?: boolean | string;
}

interface UProp {
  f: string;
  i: string;
  isAdmin: string;
  n: string;
  org: string;
}

interface OptionsProp {
  id: string;
  token: string;
  username: string;
  userId: string;
  userFace: string;
}

export interface chatMsgInfoProp {
  id: string;
  talkInfo: string;
  talkManName: string;
  avatar: string;
  type: string;
}

class Ws {
  static instance: any = null;
  url: string;
  ws: null | WebSocket;
  heartbeatTimer: null | number;
  options: null | OptionsProp;
  constructor(url: string, options: OptionsProp) {
    this.url = url;
    this.initWs();
    this.options = options;
  }

  static getInstance(url: string, options: OptionsProp) {
    if (!Ws.instance) {
      Ws.instance = new Ws(url, options);
    }
    return Ws.instance;
  }
  stringify(obj: any) {
    return JSON.stringify(obj);
  }
  parse(obj: any) {
    return JSON.parse(obj);
  }
  initWs() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onclose = this.onclose.bind(this);
  }
  onopen() {
    window.console.log("ws连接成功2", this);
    this.setHeartbeat();
  }
  onmessage(msg: any) {
    const data: WsBodyProp = JSON.parse(msg.data);
    switch (data.c) {
      case 1000:
        this.chatMsg(data);
        return;
      case 1001:
        this.watchInfo(data);
        return;
      case 1111:
        this.liveNotice(data);
        return;
      default:
        window.console.error("没有找到匹配");
    }
  }
  onerror() {
    window.console.log("连接失败,正在重连...");
  }
  onclose() {
    window.console.log("通讯连接已关闭, 需要重新刷新连接");
  }
  // 设置心跳
  setHeartbeat() {
    const heartbeaInfo: WsBodyProp = {
      c: 1001,
      d: {
        r: this.options.id,
        n: this.options.username,
        i: this.options.userId,
        f: this.options.userFace,
        m: "",
        t: "",
        org: "",
        isAdmin: false,
      },
    };
    this.removeHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.ws.send(this.stringify(heartbeaInfo));
    }, 50 * 1000);
  }
  // 清除心跳
  removeHeartbeat() {
    clearTimeout(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }
  // 发送消息
  send(msg: string) {}
  // 关闭ws
  closeWs() {
    this.removeHeartbeat();
    this.ws.close();
  }
  // 处理聊天信息
  chatMsg(data: WsBodyProp) {}
  // 处理观看人数及信息
  watchInfo(data: WsBodyProp) {}
  // 处理直播公告
  liveNotice(data: WsBodyProp) {}
  // 处理随机选人
  ramdomSelectPerson(data: WsBodyProp) {}
}

export default Ws;
```

```vue
<script lang="ts" setup>
onMounted(() => {
  wsInstance = Ws.getInstance();
});
</script>
```

## vue + vite 初始化项目

### 安装 vite

[地址](https://cn.vitejs.dev/guide/#trying-vite-online)

```sh
npm create vite@latest
```

```md
package.json 中，script 中 使用 dev 命令: "vite --open" 加上 --open 自动打开浏览器
```

### vite 环境变量

```md
import.meta.env 有五个环境变量

BASE_URL: 开发或者生产环境服务的公共基础路径
DEV: true: 当前环境是否为开发环境, true 为开发环境
PROD: false: 当前环境是否为生产环境, true 为生产环境
MODE: 应用运行的模式, 分为开发者模式(development), 生产环境模式(production)
SSR: false: 是否为服务器渲染
```

### 自定义环境变量

1. 在根目录新建`.env`, `.env.development`, `.env.production`
2. 在`vite-env.d.ts` 增加 interface ImportMetaEnv

```ts
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  VITE_USER_NAME: string;
}
```

### 在 package,json 文件中明确环境变量和生产环境

```json
"script": {
  "dev": "vite --mode development --open",
  "build": "vite build --mode production --open",
  "preview": "vite preview --open",
}
```

### vite.config.ts 开发环境和生产环境配置, 类型解决

1. 安装`dotenv`依赖

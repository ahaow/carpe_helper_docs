import { defineConfig } from "vitepress";
export default defineConfig({
  title: "carpe_helper",
  description: "carpe_helper工具库文档",
  themeConfig: {
    // sidebar: [],
    nav: [
      {
        text: "工具库",
        items: [
          {
            text: "手写",
            link: "/utils/write",
          },
          {
            text: "数组相关",
            link: "/utils/array",
          },
          {
            text: "字符串相关",
            link: "/utils/string",
          },
        ],
      },
      {
        text: "vue3",
        items: [
          {
            text: "脚手架",
            link: "/vue3/scaffold",
          },
          {
            text: "组件",
            link: "/vue3/component",
          },
          {
            text: "指令",
            link: "/vue3/directive",
          },
          {
            text: "hooks",
            link: "/vue3/hooks",
          },
          {
            text: "axios",
            link: "/vue3/axios",
          },
          {
            text: "基础",
            link: "/vue3/basic",
          },
        ],
      },
      {
        text: "工作开发",
        items: [
          {
            text: "基础相关",
            link: "/develop/base",
          },
          {
            text: "插件相关",
            link: "/develop/plug-in",
          },
        ],
      },
      {
        text: "面试",
        items: [
          {
            text: "js(偏代码)",
            link: "/interview/js-code",
          },
          {
            text: "js(偏理论)",
            link: "/interview/js-theory",
          },
          {
            text: "浏览器相关",
            link: "/interview/browser",
          },
          {
            text: "网络",
            link: "/interview/network",
          },
          {
            text: "性能优化",
            link: "/interview/performance",
          },
          {
            text: "安全",
            link: "/interview/safety",
          },
          {
            text: "前后端通信",
            link: "/interview/Front end communication",
          },
        ],
      },
      {
        text: "技术相关",
        items: [
          {
            text: "git",
            link: "/technology/git",
          },
        ],
      },
    ],
  },
});

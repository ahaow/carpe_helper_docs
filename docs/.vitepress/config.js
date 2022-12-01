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
            text: "方法相关",
            link: "/utils/method",
          },
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
        ],
      },
      {
        text: "js",
        items: [
          {
            text: "array",
            link: "/js/array",
          },
        ],
      },
      {
        text: "工作开发",
        link: "/develop/index",
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
        ],
      },
    ],
  },
});

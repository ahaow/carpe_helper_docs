import { defineConfig } from "vitepress";
export default defineConfig({
    title: 'carpe_helper',
    description: 'carpe_helper工具库文档',
    themeConfig: {
        nav: [
            {
                text: '工具库',
                link: '/utils/index'
            },
            {
                text: '其他',
                link: '/interview/index'
            },
            {
                text: '开发',
                link: '/develop/index'
            },
            {
                text: 'js基础',
                link: '/js-basic/index'
            },
        ],
    }
});

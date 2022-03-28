import { defineConfig } from "vitepress";
export default defineConfig({
    title: 'carpe_helper',
    description: 'carpe_helper工具库文档',
    themeConfig: {
        nav: [
            {
                text: '工具库',
                link: '/utils/index'
            }
        ],
    }
});

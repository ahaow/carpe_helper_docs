## hooks

### useRouterUtils

```ts
import { useRoute, useRouter } from "vue-router";
const useRouterUtils = () => {
  const router = useRouter();
  const route = useRoute();

  const routerBack = () => {
    router.back();
  };

  const routerPush = (path: string) => {
    router.push(path);
  };

  const routerReplace = (path: string) => {
    router.replace(path);
  };

  const routerNewPage = (path: string) => {
    const newPage = router.resolve(path);
    window.open(newPage.href, "_blank");
  };
  return {
    route,
    routerBack,
    routerPush,
    routerReplace,
    routerNewPage,
  };
};
export default useRouterUtils;
```
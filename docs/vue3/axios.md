## axios

### 基础封装

```ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
const interceptHttpCode200Business = (res: AxiosResponse<any, any>) => {
  if (res.data.code !== 0) {
    interceptHttpCodeAndBusinessCode(res.data.code, res.data.msg);
  }
};

const interceptHttpCodeAndBusinessCode = (code: number, msg: string) => {
  switch (code) {
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401: {
      // Localstorage.remove('Authorization')
      // const redirectUrl = encodeURIComponent(window.location.href)
      // location.href = '/h5/#/login?' + 'redirect=' + redirectUrl + '&from=true'
      break;
    }
    // 清除token
    case 403:
      router.replace({
        path: "/no-auth",
      });
      break;
    // 404请求不存在
    case 404:
      break;
    case 500:
      //   Toast.fail(msg);
      // if (notices.indexOf(msg) != -1) {
      //   // console.log("msg", msg)
      // } else {
      //   if (msg) {
      //     Message.error(msg);
      //   }
      // }
      break;
    // 其他错误，直接抛出错误提示
    default:
      break;
  }
};

axios.defaults.baseURL = import.meta.env.VITE_YS_CLASS_URL as string;
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.interceptors.request.use(
  (config): AxiosRequestConfig => {
    if (config.url && loadings.indexOf(config.url) !== -1) {
      window.console.log("...");
    } else {
      //   const loadingToastItem = Toast.loading({
      //     duration: 0,
      //     forbidClick: true,
      //     message: "加载中",
      //   });
      //   loadingToast.push(loadingToastItem);
    }
    const Authorization = Localstorage.get("Authorization");
    if (Authorization) {
      //@ts-ignore
      config.headers.Authorization = Authorization;
    }
    return config;
  },
  (error) => {
    return error;
  }
);

axios.interceptors.response.use(
  (res) => {
    // if (loadingToast.length > 0) {
    //   loadingToast.pop().clear();
    // }
    if (res.status === 200) {
      interceptHttpCode200Business(res);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  },
  (error) => {
    if (error.response.status) {
      interceptHttpCodeAndBusinessCode(
        error.response.status,
        error.response.data.message
      );
    }
    return Promise.reject(error.response);
  }
);
```

### http请求

```ts
export interface ResType<T> {
  code: number;
  data?: T;
  msg: string;
  success: boolean;
}

interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>;
  post<T>(url: string, params?: unknown): Promise<ResType<T>>;
  postUpload<T>(url: string, params?: unknown): Promise<ResType<T>>;
}

const http: Http = {
  get(url, params) {
    return new Promise((reslove, reject) => {
      axios
        .get(url, { params })
        .then((res) => {
          reslove(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
  post(url, params) {
    return new Promise((reslove, reject) => {
      axios
        .post(url, params)
        .then((res) => {
          reslove(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
  postUpload(url, params) {
    const config: any = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [
        function (data: any) {
          return data;
        },
      ],
      onUploadProgress: (progress: { loaded: number; total: number }) => {
        const persent = ((progress.loaded / progress.total) * 100) | 0;
        window.console.log("persent", persent);
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
};

export default http;
```

### 基础使用

```ts
// types.ts
import type { ResType } from "../http";
export interface ICommonApi {
  fileGetSign: (params: any) => Promise<ResType<any>>;
}

// index.ts
import http from "../http";
import type { ResType } from "../http";
import type * as T from "./types";
const commonApi: T.ICommonApi = {
  fileGetSign(params) {
    return http.get("/event/oss/upload/getSign", params);
  },
};
export default commonApi;
```
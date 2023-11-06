/* 
 * 这段代码是一个封装了 Axios 的请求库，用于发起 HTTP 请求。 
 * 包含了一些请求拦截、响应拦截和错误处理的逻辑。 
 */

import axios, { Method, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 请求配置类型 
interface ConfigType {
  headers?: { [key: string]: string };
  hold?: boolean;
  timeout?: number;
}

// 响应数据类型 
interface ResponseDataType {
  code: number;
  message: string;
  data: any;
}

/**
 * 请求开始
 * @param config - 请求配置
 * @returns 处理后的请求配置
 */
function requestStart(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.headers) {
    config.headers.rootkey = process.env.ROOT_KEY;
  }

  return config;
}

/**
 * 请求成功,检查请求头
 * @param response - 响应数据
 * @returns 响应数据
 */
function responseSuccess(response: AxiosResponse<ResponseDataType>) {
  return response;
}

/**
 * 响应数据检查
 * @param data - 响应数据
 * @returns 处理后的响应数据
 */
function checkRes(data: ResponseDataType) {
  if (data === undefined) {
    console.log('error->', data, 'data is empty');
    return Promise.reject('服务器异常');
  } else if (data?.code && (data.code < 200 || data.code >= 400)) {
    return Promise.reject(data);
  }
  return data.data;
}

/**
 * 响应错误
 * @param err - 错误信息
 * @returns 错误信息
 */
function responseError(err: any) {
  if (!err) {
    return Promise.reject({ message: '未知错误' });
  }
  if (typeof err === 'string') {
    return Promise.reject({ message: err });
  }
  if (err?.response?.data) {
    return Promise.reject(err?.response?.data);
  }
  return Promise.reject(err);
}

/* 创建请求实例 */
const instance = axios.create({
  timeout: 60000, // 超时时间
  headers: {
    'content-type': 'application/json'
  }
});

/* 请求拦截 */
instance.interceptors.request.use(requestStart, (err) => Promise.reject(err));

/* 响应拦截 */
instance.interceptors.response.use(responseSuccess, (err) => Promise.reject(err));

/**
 * 发起请求
 * @param url - 请求URL
 * @param data - 请求数据
 * @param config - 请求配置
 * @param method - 请求方法
 * @returns 请求结果
 */
export function request(url: string, data: any, config: ConfigType, method: Method): any {
  if (!global.systemEnv?.pluginBaseUrl) {
    return Promise.reject('商业版插件加载中...');
  }

  /* 去空 */
  for (const key in data) {
    if (data[key] === null || data[key] === undefined) {
      delete data[key];
    }
  }

  return instance
    .request({
      baseURL: global.systemEnv.pluginBaseUrl,
      url,
      method,
      data: ['POST', 'PUT'].includes(method) ? data : null,
      params: !['POST', 'PUT'].includes(method) ? data : null,
      ...config // 用户自定义配置，可以覆盖前面的配置
    })
    .then((res) => checkRes(res.data))
    .catch((err) => responseError(err));
}

/**
 * GET 请求
 * @param url - 请求URL
 * @param params - 请求参数
 * @param config - 请求配置
 * @returns Promise<T>
 */
export function GET<T>(url: string, params = {}, config: ConfigType = {}): Promise<T> {
  return request(url, params, config, 'GET');
}

/**
 * POST 请求
 * @param url - 请求URL
 * @param data - 请求数据
 * @param config - 请求配置
 * @returns Promise<T>
 */
export function POST<T>(url: string, data = {}, config: ConfigType = {}): Promise<T> {
  return request(url, data, config, 'POST');
}

/**
 * PUT 请求
 * @param url - 请求URL
 * @param data - 请求数据
 * @param config - 请求配置
 * @returns Promise<T>
 */
export function PUT<T>(url: string, data = {}, config: ConfigType = {}): Promise<T> {
  return request(url, data, config, 'PUT');
}

/**
 * DELETE 请求
 * @param url - 请求URL
 * @param data - 请求数据
 * @param config - 请求配置
 * @returns Promise<T>
 */
export function DELETE<T>(url: string, data = {}, config: ConfigType = {}): Promise<T> {
  return request(url, data, config, 'DELETE');
}
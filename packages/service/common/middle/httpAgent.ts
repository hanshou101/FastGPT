import tunnel from 'tunnel';

/**
 * 初始化 HTTP 代理
 */
export function initHttpAgent() {
  // proxy obj
  if (process.env.AXIOS_PROXY_HOST && process.env.AXIOS_PROXY_PORT) {
    global.httpsAgent = tunnel.httpsOverHttp({
      proxy: {
        host: process.env.AXIOS_PROXY_HOST,
        port: +process.env.AXIOS_PROXY_PORT
      }
    });
  }
}

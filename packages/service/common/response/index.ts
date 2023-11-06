import type { NextApiResponse } from 'next';

/**
 * 响应写入控制器
 * @param res - Next.js响应对象
 * @param readStream - 读取流对象
 */
export function responseWriteController({
  res,
  readStream
}: {
  res: NextApiResponse;
  readStream: any;
}) {
  /**
   * TODO 啥意思？？啥意思？？啥意思？？啥意思？？啥意思？？啥意思？？啥意思？？啥意思？？
   *                见————Notion的解释，就好：    https://www.notion.so/labring-FastGPT-94c4d1cf9c804f7e9cdd5a928c9baee7?pvs=4#2aef2efe97fc4cdbace2a4211a22bb50
   * TIP 解释：
   *      这段代码的主要应用场景是处理大量数据或者实时数据，例如实时日志、股票价格更新等。
   *              在这些场景中，服务器需要将数据分块发送到客户端，而不是等所有数据都准备好之后再一次性发送。
   */
  res.on('drain', () => {
    readStream.resume();
  });

  /**
   * 写入响应内容
   * @param text - 响应文本或缓冲区
   */
  return (text: string | Buffer) => {
    const writeResult = res.write(text);
    if (!writeResult) {
      readStream?.pause();
    }
  };
}

/**
 * 响应写入函数
 * @param res - Next.js响应对象
 * @param write - 自定义写入函数
 * @param event - 事件名称
 * @param data - 响应数据
 */
export function responseWrite({
  res,
  write,
  event,
  data
}: {
  res?: NextApiResponse;
  write?: (text: string) => void;
  event?: string;
  data: string;
}) {
  const Write = write || res?.write;

  if (!Write) return;

  event && Write(`event: ${event}\n`);
  Write(`data: ${data}\n\n`);
}

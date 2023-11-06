import crypto from 'crypto';

/*
 * 判断字符串是否为链接
 * 接受一个可选的字符串参数
 * 如果字符串为空，返回false
 * 如果字符串符合链接的正则表达式，则返回true，否则返回false
 */
export function strIsLink(str?: string) {
  if (!str) return false;
  if (/^((http|https)?:\/\/|www\.|\/)[^\s/$.?#].[^\s]*$/i.test(str)) return true;
  return false;
}

/*
 * 对字符串进行哈希处理
 * 接受一个字符串参数psw
 * 使用sha256算法对psw进行哈希处理，并以十六进制格式返回结果
 */
export const hashStr = (psw: string) => {
  return crypto.createHash('sha256').update(psw).digest('hex');
};

/*
 * 对文本进行简化处理
 * 接受一个字符串参数text
 * 移除中文空格和额外的换行符
 * 将连续的三个以上换行符替换为两个换行符
 * 将连续的两个以上非换行符空格替换为一个空格
 * 将控制字符替换为空格
 * 返回处理后的文本
 */
export const simpleText = (text: string) => {
  text = text.replace(/([\u4e00-\u9fa5])[\s&&[^\n]]+([\u4e00-\u9fa5])/g, '$1$2');
  text = text.replace(/\r\n|\r/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[\s&&[^\n]]{2,}/g, ' ');
  text = text.replace(/[\x00-\x08]/g, ' ');

  return text;
};

/*  
 * 这是一个用于获取错误文本的函数，接受一个错误对象和一个默认值作为参数 
 * 如果错误对象是一个字符串，将其作为错误文本，否则尝试获取错误对象的message属性作为错误文本 
 * 如果都不存在，则返回默认值 
 * 如果存在错误文本，则打印错误文本 
 * 返回错误文本 
 */
export const getErrText = (err: any, def = '') => {
  const msg: string = typeof err === 'string' ? err : err?.message || def || '';
  msg && console.log('error =>', msg);
  return msg;
}; 
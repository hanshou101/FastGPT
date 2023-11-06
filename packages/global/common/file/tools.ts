/* 
 * 这是一个用于格式化文件大小的函数，接受一个字节数作为参数 
 * 如果字节数为0，返回'0 B' 
 * 否则，将字节数转换为合适的单位（B、KB、MB、GB等），并保留两位小数 
 * 返回格式化后的文件大小字符串 
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 
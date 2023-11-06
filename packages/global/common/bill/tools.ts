/* bill common  */
import { PRICE_SCALE } from './constants';

/**
 * 将数据集价格除以 PRICE_SCALE 得到真实价格
 * @param val 数据集价格，默认为0
 * @param multiple 倍数，默认为1
 * @returns 真实价格
 */
export const formatPrice = (val = 0, multiple = 1) => {
  return Number(((val / PRICE_SCALE) * multiple).toFixed(10));
};
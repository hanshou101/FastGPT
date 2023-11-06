import timezones from 'timezones-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 返回当前区域设置相对于UTC的偏移小时数。
 * @param {string} timeZone 要获取偏移量的时区
 * @returns {number} 相对于UTC的偏移小时数。
 *
 * 由Trelent生成
 */
export const getTimezoneOffset = (timeZone: string): number => {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', {
    timeZone
  });
  const localString = now.toLocaleString('en-US');
  const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
  const offset = diff + now.getTimezoneOffset() / 60;
  return -offset;
};

/**
 * 返回按照与UTC的偏移排序的时区列表。
 * @returns {object[]} 按照与UTC的偏移排序的时区列表。
 *
 * 由Trelent生成
 */
export const timezoneList = () => {
  const result = timezones
      .map((timezone) => {
        try {
          let display = dayjs().tz(timezone.tzCode).format('Z');

          return {
            name: `(UTC${display}) ${timezone.tzCode}`,
          value: timezone.tzCode,
              time: getTimezoneOffset(timezone.tzCode)
        };
        } catch (e) {}
      })
      .filter((item) => item);

  result.sort((a, b) => {
    if (!a || !b) return 0;
    if (a.time > b.time) {
      return 1;
    }
    if (b.time > a.time) {
      return -1;
    }
    return 0;
  });
  return [
    {
      name: 'UTC',
      time: 0,
      value: 'UTC'
    },
    ...result
  ] as {
    name: string;
    value: string;
    time: number;
  }[];
};

/**
 * 返回指定时区的系统时间。
 * @param {string} timeZone 要获取系统时间的时区
 * @returns {string} 指定时区的系统时间，格式为YYYY-MM-DD HH:mm:ss。
 *
 * 由Trelent生成
 */
export const getSystemTime = (timeZone: string) => {
  const timezoneDiff = getTimezoneOffset(timeZone);
  const now = Date.now();
  const targetTime = now + timezoneDiff * 60 * 60 * 1000;
  return dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss');
};

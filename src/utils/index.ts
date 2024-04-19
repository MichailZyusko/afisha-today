import { dateFormatterOptions } from '../constants';

export const delay = (delayInMS = 1e3) => new Promise((resolve) => {
  setTimeout(resolve, delayInMS);
});

export const deepTrim = (msg: string) => msg
  .split('\n')
  .map((line) => line.trim())
  .join('\n');

export const formatDateRange = (startDate: Date, endDate: Date) => new Intl
  .DateTimeFormat('ru-RU', dateFormatterOptions)
  .formatRange(startDate, endDate);

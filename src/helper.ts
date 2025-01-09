import dayjs from "dayjs";
import moment from "moment";

export const isValidKey = (
  key: string | number | symbol,
  object: object
): key is keyof typeof object => key in Object;

export const getEarliestAndLatestTime = (arr, startKey, endKey, format) => {
  let startTimes = arr.map((item) => new Date(item[startKey]).getTime());
  let endTimes = arr.map((item) => new Date(item[endKey]).getTime());
  let allTimes = startTimes.concat(endTimes);

  let earliestTime = moment(new Date(Math.min(...allTimes))).format(format);
  let latestTime = moment(new Date(Math.max(...allTimes))).format(format);

  return { earliestTime, latestTime };
};

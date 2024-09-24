import { ITimelineData } from "../models/ITimelineData";
import { DateFormatToDate } from "./dateTypeToDate";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export const dateConvert = (
  data?: ITimelineData[],
  dateFormatTodates?: DateFormatToDate
) => {
  // return data?.map((user) => {
  //   return {
  //     ...user,
  //     childern: user?.childern?.filter((task) => {
  //       const start = dayjs(task.startDate, dateFormats.DEFAULT);
  //       const end = dayjs(task.dueDate, dateFormats.DEFAULT);
  //       return (
  //         Number(start.diff(dateFormatTodates?.startOfDay, "day")) > 0 &&
  //         Number(end.diff(dateFormatTodates?.endOfDay, "day")) < 0
  //       );
  //     }),
  //   };
  // });
};

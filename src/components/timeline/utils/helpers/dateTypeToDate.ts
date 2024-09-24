import { DateType } from "../enums/dateType";
import weekday from "dayjs/plugin/weekday";
import dayjs, { Dayjs } from "dayjs";
dayjs.extend(weekday);

export type DateFormatToDate = {
  titleData: string[];
  startOfDay: Dayjs;
  endOfDay: Dayjs;
  dayWidth: number;
  dayCount: number;
  data: {
    width: number;
    startDate: dayjs.Dayjs;
    dueDate: dayjs.Dayjs;
    label: string;
    today: boolean;
    key: string;
  }[];
};

export interface IDateTypeToDate {
  [DateType.DAY]: DateFormatToDate;
  [DateType.WEEK]: DateFormatToDate;
  [DateType.MONTH]: DateFormatToDate;
}

export const dateTypeToDate = (
  type: DateType = DateType.DAY,
  startDate?: Dayjs,
  startCount: number = 2,
  endCount: number = 2,
  dayWidthSize?: Record<DateType, number>
) => {
  const day = {
    start: () =>
      dayjs(startDate || new Date())
        .startOf("week")
        .add(-startCount, "week"),
    end() {
      return dayjs(startDate || new Date())
        .startOf("week")
        .add(endCount, "week");
    },
    dayCount() {
      return Number(this.end().diff(this.start(), "day"));
    },
  };

  const week = {
    start() {
      return dayjs(startDate || new Date())
        .startOf("week")
        .add(-startCount, "week");
    },
    end() {
      return dayjs(startDate || new Date())
        .startOf("week")
        .add(endCount, "week");
    },
    dayCount() {
      return Number(this.end().diff(this.start(), "day"));
    },
    weekCount() {
      return Number(this.end().diff(this.start(), "week"));
    },
  };

  const month = {
    start() {
      return dayjs(startDate || new Date())
        .startOf("month")
        .add(-startCount, "month");
    },
    end() {
      return dayjs(startDate || new Date())
        .startOf("month")
        .add(endCount, "month");
    },
    dayCount() {
      return Number(this.end().diff(this.start(), "day"));
    },
    monthCount() {
      return Number(this.end().diff(this.start(), "month"));
    },
  };

  const obj: IDateTypeToDate = {
    [DateType.DAY]: {
      titleData: Array.from({ length: 1 }).map((_, i) => {
        const date = day.start().add(i, "week");
        return date.format("MMM");
      }),
      startOfDay: day?.start(),
      endOfDay: day?.end(),
      dayWidth: dayWidthSize?.day || 190,
      dayCount: day?.dayCount(),
      data: Array.from({ length: day.end().diff(day.start(), "day") }).map(
        (_, i) => {
          const date = day.start().add(i, "day");
          const today =
            dayjs().format("DD MM YYYY") === date.format("DD MM YYYY");
          return {
            width: dayWidthSize?.day || 190,
            startDate: date.startOf("day"),
            dueDate: date.endOf("day"),
            label: date.format("dd - DD"),
            today: today,
            key: date.format("MMM DD YYYY"),
          };
        }
      ),
    },
    [DateType.WEEK]: {
      titleData: Array.from({ length: week.weekCount() }).map((_, i) => {
        const date = week.start().add(i, "week");
        return date.format("DD MMM YYYY");
      }),
      startOfDay: week.start(),
      endOfDay: week.end(),
      dayWidth: dayWidthSize?.week || 100,
      dayCount: week?.dayCount(),
      data: Array.from({ length: week.weekCount() }).map((_, i) => {
        const date = week.start().add(i, "week");
        const today =
          dayjs().startOf("week").format("DD MM YYYY") ===
          date.format("DD MM YYYY");
        return {
          width: (dayWidthSize?.week || 100) * 7,
          startDate: date.startOf("week"),
          dueDate: date.endOf("week"),
          label: `${date.startOf("week").format("DD MMM")} ${date
            .endOf("week")
            .format("DD MMM")}`,
          today: today,
          key: `${date.startOf("week").format("DD MMM YYYY")} ${date
            .endOf("week")
            .format("DD MMM YYYY")}`,
        };
      }),
    },
    [DateType.MONTH]: {
      titleData: Array.from({ length: month.monthCount() }).map((_, i) => {
        const date = month.start().add(i, "week");
        return date.format("DD MMM YYYY");
      }),
      startOfDay: month.start(),
      endOfDay: month.end(),
      dayWidth: dayWidthSize?.month || 50,
      dayCount: month?.dayCount(),
      data: Array.from({ length: month.monthCount() }).map((_, i) => {
        const date = month.start().add(i, "month");
        const today =
          dayjs().startOf("month").format("DD MM YYYY") ===
          date.format("DD MM YYYY");
        const dayCount = Number(date.endOf("month").diff(date, "day")) + 1;
        return {
          width: dayCount * (dayWidthSize?.month || 50),
          startDate: date.startOf("month"),
          dueDate: date.endOf("month"),
          label: `${date.startOf("month").format("DD MMM")} ${date
            .endOf("month")
            .format("DD MMM")}`,
          today: today,
          key: `${date.startOf("month").format("DD MMM YYYY")} ${date
            .endOf("month")
            .format("DD MMM YYYY")}`,
        };
      }),
    },
  };

  return obj[type];
};

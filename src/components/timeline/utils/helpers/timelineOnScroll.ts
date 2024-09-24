import dayjs from "dayjs";
import { DateType } from "../enums/dateType";
import { DateFormatToDate } from "./dateTypeToDate";

export const UIC_TIMELINE_SCROLL_LEFT = `--uic-timeline-scroll-left`;
export const UIC_TIMELINE_SCROLL_TOP = `--uic-timeline-scroll-top`;

export const timelineOnScroll = (
  e: React.UIEvent<HTMLDivElement, UIEvent>,
  {
    randomId,
    setStartTimeline,
    startTimeline,
    endCount,
    startCount,
    dateType,
    dateFormatTodates,
    holderWidth,
  }: {
    randomId: string;
    setStartTimeline: React.Dispatch<
      React.SetStateAction<{
        date: dayjs.Dayjs;
        startCount: number;
        endCount: number;
      }>
    >;
    startTimeline: dayjs.Dayjs;
    startCount: number;
    endCount: number;
    dateType: DateType;
    dateFormatTodates: DateFormatToDate;
    holderWidth: number;
  }
) => {
  const dayCount = +(
    (e?.currentTarget?.scrollLeft + e?.currentTarget?.offsetWidth) /
    dateFormatTodates.dayWidth
  ).toFixed(0);
  const dayCountLeft = +(
    e?.currentTarget?.scrollLeft / dateFormatTodates.dayWidth
  ).toFixed(0);

  if (dateType === DateType.DAY) {
    if (dayCount >= (endCount + startCount) * 7) {
      setStartTimeline((prev) => ({
        ...prev,
        endCount: prev.endCount + 1,
      }));
    }
    if (dayCountLeft <= 2) {
      setStartTimeline((prev) => ({
        ...prev,
        startCount: prev.startCount + 1,
      }));

      e.currentTarget.scrollTo({
        left: e.currentTarget.scrollLeft + 190 * 7,
      });
    }
  }
  if (dateType === DateType.WEEK) {
    if (dayCount >= (endCount + startCount) * 7) {
      setStartTimeline((prev) => ({
        ...prev,
        endCount: prev.endCount + 1,
      }));
    }

    if (dayCountLeft <= 1) {
      setStartTimeline((prev) => ({
        ...prev,
        startCount: prev.startCount + 1,
      }));

      e.currentTarget.scrollTo({
        left: e.currentTarget.scrollLeft + dateFormatTodates.dayWidth * 7,
      });
    }
  }

  if (dateType === DateType.MONTH) {
    if (dayCount >= (endCount + startCount) * 30) {
      setStartTimeline((prev) => ({
        ...prev,
        endCount: prev.endCount + 1,
      }));
    }

    if (dayCountLeft <= 1) {
      setStartTimeline((prev) => ({
        ...prev,
        startCount: prev.startCount + 1,
      }));

      e.currentTarget.scrollTo({
        left: e.currentTarget.scrollLeft + dateFormatTodates.dayWidth * 30,
      });
    }
  }

  // rangeScrollView(e, { randomId, dateFormatTodates, holderWidth });

  // e.currentTarget.style.setProperty(
  //   UIC_TIMELINE_SCROLL_LEFT + randomId,
  //   String(e?.currentTarget?.scrollLeft)
  // );
  // e.currentTarget.style.setProperty(
  //   UIC_TIMELINE_SCROLL_TOP + randomId,
  //   String(e?.currentTarget?.scrollTop)
  // );
};

export const getTimelineScroll = (randomId?: string) => {
  const container = document.getElementById(`timelineBody_${randomId}`);
  return {
    x: Number(container?.scrollLeft) || 0,
    y: Number(container?.scrollTop) || 0,
  };
};

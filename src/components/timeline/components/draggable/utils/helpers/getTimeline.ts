import dayjs from "dayjs";
import { getTimelineScroll } from "../../../../utils/helpers/timelineOnScroll";
import { getDragContent } from "../../../range/utils/helpers/getDragContent";
import { dateFormats } from "../../../../utils/constants/dateFormats";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IDragEnd } from "../models/IDragEnd";
dayjs.extend(customParseFormat);

export const getTimeline = ({
  x,
  y,
  end,
  onDragEnd,
}: {
  x: number;
  y: number;
  end?: boolean;
  onDragEnd?: (range: IDragEnd) => void;
}) => {
  let arr: HTMLDivElement[] = [];

  const timeline = document.querySelectorAll<HTMLDivElement>(".uic-timeline");

  timeline?.forEach((item) => {
    const position = item?.getBoundingClientRect();
    if (position?.top <= y && y <= position?.top + position?.height) {
      if (position?.left <= x && x <= position?.left + position?.width) {
        arr.push(item);
      }
    }
  });

  const data = {
    dayWidth: Number(arr[0]?.getAttribute("day-width") || 0),
    id: arr[0]?.id,
    holderWidth: Number(arr[0]?.getAttribute("holder-width") || 0),
    scrollLeft: getTimelineScroll(arr[0]?.id)?.x,
    scrollTop: getTimelineScroll(arr[0]?.id)?.y,
    top: arr[0]?.getBoundingClientRect().top || 0,
    left: arr[0]?.getBoundingClientRect().left || 0,
  };

  const position = getDragContent({
    dateCount: 1,
    dayWidth: data?.dayWidth,
    holderWidth: data?.holderWidth,
    id: data?.id,
    offsetHeight: 50,
    offsetLeft: x + data?.scrollLeft - data?.dayWidth / 3 - data?.left,
    offsetTop: y + data?.scrollTop - data?.top,
    sourceId: "",
    end: end || false,
  });

  if (end) {
    const start = arr[0]
      ? dayjs(arr[0].getAttribute("start-date"), dateFormats.DEFAULT)
      : undefined;

    const start_date = start?.add(position.startIndex, "day");
    const end_date = start?.add(position.startIndex, "day");

    if (onDragEnd && start_date && end_date) {
      onDragEnd({
        destinationId: position?.destinationId,
        startDate: start_date,
        dueDate: end_date,
      });
    }
  } else {
  }
};

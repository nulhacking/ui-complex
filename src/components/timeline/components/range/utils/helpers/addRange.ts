import dayjs from "dayjs";
import {
  ITimelineData,
  ITimelineDataChildren,
} from "../../../../utils/models/ITimelineData";
import { IRange } from "../../../../utils/models/IRange";

interface IAddRange {
  onDragEnd?: ((range: IRange) => void) | undefined;
  rangeOnDragEnd?: (range: IRange) => void;
  destinationId: string | undefined;
  startOfDay: dayjs.Dayjs | undefined;
  range: ITimelineDataChildren;
  dateCount: number;
  startIndex: number | undefined;
  sourceId: string;
}

export const addRange = ({
  dateCount,
  destinationId,
  range,
  startOfDay,
  startIndex,
  sourceId,
  onDragEnd,
  rangeOnDragEnd,
}: IAddRange) => {
  if (destinationId && startIndex) {
    const start = startOfDay?.add(startIndex, "day");
    const end = startOfDay?.add(startIndex + dateCount - 1, "day");
    if (
      start !== range?.startDate ||
      end !== range?.dueDate ||
      destinationId !== sourceId
    ) {
      if (onDragEnd) {
        onDragEnd({
          id: range?.id,
          startDate: start,
          dueDate: end,
          destinationId,
          sourceId,
        });
      }
      if (rangeOnDragEnd) {
        rangeOnDragEnd({
          id: range?.id,
          startDate: start,
          dueDate: end,
          destinationId,
          sourceId,
        });
      }
    }
  }
};

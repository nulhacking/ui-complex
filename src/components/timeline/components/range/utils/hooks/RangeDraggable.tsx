import { useContext, useEffect } from "react";
import { IPositionState } from "../models";
import { TimelineContext } from "../../../../hooks/TimelineContext";
import dayjs from "dayjs";
import {
  ITimelineData,
  ITimelineDataChildren,
} from "../../../../utils/models/ITimelineData";
import { dateFormats } from "../../../../utils/constants/dateFormats";
import { getTimelineScroll } from "../../../../utils/helpers/timelineOnScroll";
import { getDragContent } from "../helpers/getDragContent";
import { addRange } from "../helpers/addRange";
import { IRange } from "../../../../utils/models/IRange";

interface IProps {
  position: IPositionState;
  setPosition: React.Dispatch<React.SetStateAction<IPositionState>>;
  range: ITimelineDataChildren;
  rangeRef: React.MutableRefObject<HTMLDivElement | null>;
  holder: ITimelineData;
  rangeOnDragEnd?: (range: IRange) => void;
}
const RangeDraggable = ({
  position,
  setPosition,
  range,
  rangeRef,
  holder,
  rangeOnDragEnd,
}: IProps) => {
  const { randomId, dateFormatTodates, holderWidth, contentRef, onDragEnd } =
    useContext(TimelineContext);
  const { dayWidth, startOfDay } = dateFormatTodates;

  const containerTop = () =>
    -(contentRef?.getBoundingClientRect()?.top || 0) +
    getTimelineScroll(randomId).y;

  const containerLeft = () =>
    -(contentRef?.getBoundingClientRect()?.left || 0) +
    getTimelineScroll(randomId).x;

  useEffect(() => {
    const windowMouseMove = (e: MouseEvent) => {
      if (position.dragging) {
        const left =
          position?.left -
          (position.startLeft - e.clientX) +
          (containerLeft() - position?.scrollLeftStart);
        const top =
          position?.top -
          (position.startTop - e.clientY) +
          (containerTop() - position?.scrollTopStart);
        const leftDateCount = (left - holderWidth) / dayWidth;

        const dateCount = +(
          leftDateCount +
          position?.width / dayWidth -
          leftDateCount
        ).toFixed(0);
        setPosition((prev) => {
          return {
            ...prev,
            left: left,
            top: top,
          };
        });

        getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: false,
        });
      }
      if (position?.draggingLeft) {
        const scrollLeftStart =
          containerLeft() - position?.scrollLeftStart < 0
            ? containerLeft() - position?.scrollLeftStart
            : 0;
        const width =
          position?.width + (position.startLeft - e.clientX) - scrollLeftStart;
        const left =
          position?.left -
          (width >= dayWidth ? position.startLeft - e.clientX : -dayWidth) +
          scrollLeftStart;
        const top = position?.top + (containerTop() - position?.scrollTopStart);
        const leftDateCount = (left - holderWidth) / dayWidth;

        const dateCount = +(
          leftDateCount +
          (width >= dayWidth ? width : dayWidth) / dayWidth -
          leftDateCount
        ).toFixed(0);

        setPosition((prev) => {
          return {
            ...prev,
            left: left,
            top: top,
            width: width >= dayWidth ? width : dayWidth,
          };
        });

        getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: false,
        });
      }
      if (position?.draggingRight) {
        const left = position?.left;
        const top = position?.top + (containerTop() - position?.scrollTopStart);
        const leftDateCount = (left - holderWidth) / dayWidth;

        const width =
          position?.width -
          (position.startLeft - e.clientX) +
          (containerLeft() - position?.scrollLeftStart);

        const dateCount = +(
          leftDateCount +
          (width >= dayWidth ? width : dayWidth) / dayWidth -
          leftDateCount
        ).toFixed(0);

        setPosition((prev) => {
          return {
            ...prev,
            left: left,
            top: top,
            width: width >= dayWidth ? width : dayWidth,
          };
        });

        getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: false,
        });
      }
    };

    const windowMouseUp = (e: MouseEvent) => {
      if (position.dragging) {
        const left =
          position?.left -
          (position.startLeft - e.clientX) +
          (containerLeft() - position?.scrollLeftStart);
        const leftDateCount = (left - holderWidth) / dayWidth;

        const dateCount = +(
          leftDateCount +
          position?.width / dayWidth -
          leftDateCount
        ).toFixed(0);

        const getPosition = getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: true,
        });
        addRange({
          dateCount,
          destinationId: getPosition.destinationId,
          startIndex: getPosition.startIndex,
          startOfDay,
          range,
          onDragEnd,
          rangeOnDragEnd,
          sourceId: holder?.id,
        });

        setPosition((prev) => ({
          ...prev,
          dragging: false,
        }));
      }
      if (position.draggingLeft) {
        const scrollLeftStart =
          containerLeft() - position?.scrollLeftStart < 0
            ? containerLeft() - position?.scrollLeftStart
            : 0;
        const width =
          position?.width + (position.startLeft - e.clientX) - scrollLeftStart;
        const left =
          position?.left -
          (width >= dayWidth ? position.startLeft - e.clientX : -dayWidth) +
          scrollLeftStart;
        const leftDateCount = (left - holderWidth) / dayWidth;

        const dateCount = +(
          leftDateCount +
          (width >= dayWidth ? width : dayWidth) / dayWidth -
          leftDateCount
        ).toFixed(0);

        const getPosition = getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: true,
        });
        addRange({
          dateCount,
          destinationId: getPosition.destinationId,
          startIndex: getPosition.startIndex,
          startOfDay,
          range,
          onDragEnd,
          rangeOnDragEnd,
          sourceId: holder?.id,
        });

        setPosition((prev) => ({
          ...prev,
          draggingLeft: false,
        }));
      }
      if (position.draggingRight) {
        const left = position?.left;
        const leftDateCount = (left - holderWidth) / dayWidth;

        const width =
          position?.width -
          (position.startLeft - e.clientX) +
          (containerLeft() - position?.scrollLeftStart);

        const dateCount = +(
          leftDateCount +
          (width >= dayWidth ? width : dayWidth) / dayWidth -
          leftDateCount
        ).toFixed(0);

        const getPosition = getDragContent({
          dateCount,
          dayWidth,
          holderWidth,
          id: randomId,
          offsetLeft: left,
          offsetTop: e.clientY + containerTop(),
          offsetHeight: Number(rangeRef?.current?.offsetHeight),
          sourceId: holder?.id,
          end: true,
        });
        addRange({
          dateCount,
          destinationId: getPosition.destinationId,
          startIndex: getPosition.startIndex,
          startOfDay,
          range,
          onDragEnd,
          rangeOnDragEnd,
          sourceId: holder?.id,
        });

        setPosition((prev) => ({
          ...prev,
          draggingRight: false,
        }));
      }
    };

    window.addEventListener("mousemove", windowMouseMove);
    window.addEventListener("mouseup", windowMouseUp);

    return () => {
      window.removeEventListener("mousemove", windowMouseMove);
      window.removeEventListener("mouseup", windowMouseUp);
    };
  }, [position.dragging, position.draggingLeft, position.draggingRight]);

  return <></>;
};

export default RangeDraggable;

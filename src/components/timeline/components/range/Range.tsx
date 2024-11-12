import React, { useContext, useRef, useState } from "react";
import { TimelineContext } from "../../hooks/TimelineContext";
import {
  ITimelineData,
  ITimelineDataChildren,
} from "../../utils/models/ITimelineData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { dateFormats } from "../../utils/constants/dateFormats";
import { PositionStateDefault } from "./utils/models";
import RangeDraggable from "./utils/hooks/RangeDraggable";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";
import { IRange } from "../../utils/models/IRange";
import RangeView from "./utils/hooks/RangeView";
import Waiting from "./Waiting";
import Blocking from "./Blocking";
dayjs.extend(customParseFormat);

interface IProps extends ITimelineDataChildren {
  holder: ITimelineData;
  children: JSX.Element | React.ReactNode | string;
  customeStyle?: boolean;
  onDragEnd?: (range: IRange) => void;
  disabled?: boolean;
  blocking?: string[];
}

const Range = ({
  onDragEnd,
  holder,
  children,
  customeStyle = false,
  disabled = false,
  blocking,
  ...props
}: IProps) => {
  const { dateFormatTodates, holderWidth, contentRef, randomId, dependencies } =
    useContext(TimelineContext);

  const { dayWidth } = dateFormatTodates;
  const [position, setPosition] = useState(PositionStateDefault);
  const [visible, setVisible] = useState(false);
  const rangeContentRef = useRef<HTMLDivElement | null>(null);

  const start = dayjs(props?.startDate, dateFormats.DEFAULT);
  const end = dayjs(props?.dueDate, dateFormats.DEFAULT);
  const hasDate =
    Number(start.diff(dateFormatTodates?.startOfDay, "day")) > 0 &&
    Number(end.diff(dateFormatTodates?.endOfDay, "day")) < 0;

  const rangeRef = useRef<HTMLDivElement | null>(null);

  const startDate =
    Number(
      dayjs(props?.startDate, dateFormats.DEFAULT).diff(
        dateFormatTodates?.startOfDay,
        "day"
      )
    ) + 1;

  const dueDate =
    Number(
      dayjs(props?.dueDate, dateFormats.DEFAULT).diff(
        dateFormatTodates?.startOfDay,
        "day"
      )
    ) + 1;

  // const defaultLeft = startDate * dayWidth + holderWidth;

  const defaultWidth =
    dueDate * dayWidth +
    holderWidth -
    (startDate * dayWidth + holderWidth) +
    dayWidth;

  const containerLeft = () =>
    -(contentRef?.getBoundingClientRect()?.left || 0) +
    getTimelineScroll(randomId).x;

  const containerTop = () =>
    -(contentRef?.getBoundingClientRect()?.top || 0) +
    getTimelineScroll(randomId).y;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const getElement = e.currentTarget;
    const getPosition = getElement.getBoundingClientRect();
    e.stopPropagation();
    setPosition((prev) => ({
      ...prev,
      dragging: true,
      draggingLeft: false,
      draggingRight: false,
      startLeft: e.clientX,
      startTop: e.clientY,
      top: Number(getElement?.offsetTop),
      left: Number(getPosition?.left) + containerLeft(),
      width: defaultWidth,
      scrollLeftStart: containerLeft(),
      scrollTopStart: containerTop(),
    }));
  };

  const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const getElement = e.currentTarget.parentElement;
    const getPosition = getElement?.getBoundingClientRect();
    e.stopPropagation();
    setPosition((prev) => ({
      ...prev,
      dragging: false,
      draggingLeft: true,
      draggingRight: false,
      startLeft: e.clientX,
      startTop: e.clientY,
      top: Number(getElement?.offsetTop),
      left: Number(getPosition?.left) + containerLeft(),
      width: defaultWidth,
      scrollLeftStart: containerLeft(),
      scrollTopStart: containerTop(),
    }));
  };

  const onMouseDownRight = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const getElement = e.currentTarget.parentElement;
    const getPosition = getElement?.getBoundingClientRect();
    e.stopPropagation();
    setPosition((prev) => ({
      ...prev,
      dragging: false,
      draggingLeft: false,
      draggingRight: true,
      startLeft: e.clientX,
      startTop: e.clientY,
      top: Number(getElement?.offsetTop),
      left: Number(getPosition?.left) + containerLeft(),
      width: defaultWidth,
      scrollLeftStart: containerLeft(),
      scrollTopStart: containerTop(),
    }));
  };

  const isDrag =
    position.dragging || position.draggingLeft || position.draggingRight;

  return hasDate ? (
    <>
      <RangeView
        {...props}
        startDateDay={startDate}
        dueDateDay={dueDate}
        setVisible={setVisible}
        visible={visible}
        rangeContentRef={rangeContentRef}
        rangeRef={rangeRef}
        defaultWidth={defaultWidth}
        isDrag={isDrag}
      />
      {visible && (
        <>
          {!disabled && (
            <RangeDraggable
              position={position}
              setPosition={setPosition}
              range={props}
              rangeRef={rangeRef}
              holder={holder}
              rangeOnDragEnd={onDragEnd}
            />
          )}
          <div
            className={`uic-timeline-body-range `}
            style={{
              gridColumnStart: startDate,
              gridColumnEnd: dueDate + 1,
              opacity: isDrag ? 0.5 : 1,
            }}
            task-id={holder?.id}
            ref={rangeRef}
            {...(!disabled && { onMouseDown })}
          >
            {!disabled && (
              <>
                <div
                  className={`uic-timeline-body-range-resize uic-timeline-body-range-resize-left`}
                  onMouseDown={onMouseDownLeft}
                ></div>
                <Waiting />
              </>
            )}

            <div
              className={
                customeStyle
                  ? "uic-timeline-body-range-content-custom"
                  : "uic-timeline-body-range-content"
              }
              ref={rangeContentRef}
            >
              {children}
            </div>
            {!disabled && (
              <>
                <div
                  className={`uic-timeline-body-range-resize uic-timeline-body-range-resize-right`}
                  onMouseDown={onMouseDownRight}
                ></div>
                <Blocking ids={blocking || []} taskId={holder?.id} />
              </>
            )}
          </div>
          {isDrag && (
            <div
              className={`uic-timeline-body-range uic-timeline-body-range-drag`}
              style={{
                width: position.width,
                left: position.left,
                top: position?.top,
              }}
            >
              {customeStyle ? (
                children
              ) : (
                <div className="uic-timeline-body-range-content">
                  {children}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default Range;

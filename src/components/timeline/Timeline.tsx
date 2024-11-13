import React, { useEffect, useState } from "react";
import Header from "./components/header/Header";
import Holder from "./components/holder/Holder";
import Topbar from "./components/topbar/Topbar";
import {
  ITimelineContext,
  TimelineContext,
  timelineDefaultState,
} from "./hooks/TimelineContext";
import { timelineOnScroll } from "./utils/helpers/timelineOnScroll";
import { dateTypeToDate } from "./utils/helpers/dateTypeToDate";
import { DateType } from "./utils/enums/dateType";
import { IRange } from "./utils/models/IRange";
import { Draggable } from "./components/draggable/Draggable";
import Shadow from "./components/shadow/Shadow";
import { dateFormats } from "./utils/constants/dateFormats";
import dayjs from "dayjs";
import "./timeline.scss";
import Resize from "./components/resize/Resize";

interface IProps {
  onDragEnd?: (range: IRange) => void;
  children: JSX.Element;
  holderWidth?: number;
  header?: ITimelineContext.IHeader;
  size?: Partial<Record<DateType, number>>;
  onResize?: (props: { size: Partial<Record<DateType, number>> }) => void;
  startDate?: dayjs.Dayjs;
  dependencies?: boolean;
}

const Timeline: {
  (props: IProps): React.ReactNode;
  OutsideDraggable: typeof Draggable;
  Holder: typeof Holder;
} = ({
  onDragEnd,
  children,
  holderWidth = 205,
  startDate = dayjs(),
  header,
  size = timelineDefaultState.dayWidthSize,
  dependencies = false,
  onResize,
}) => {
  const [randomId, _] = useState(timelineDefaultState.randomId);
  const [timelineRef, setTimelineRef] =
    useState<ITimelineContext.IState["contentRef"]>(null);
  const [timelineBodyRef, setTimelineBodyRef] = useState<HTMLDivElement | null>(
    null
  );
  const [dayWidthSize, setDayWidthSize] = useState<Record<DateType, number>>({
    ...timelineDefaultState.dayWidthSize,
    ...size,
  });
  const [startTimeline, setStartTimeline] = useState({
    date: startDate,
    startCount: 2,
    endCount: 2,
  });
  const [dateType, setDateType] = useState(timelineDefaultState.dateType);

  const dateFormatTodates = dateTypeToDate(
    dateType,
    startTimeline?.date,
    startTimeline?.startCount,
    startTimeline?.endCount,
    dayWidthSize
  );

  const startWeek =
    dayjs().startOf("week").diff(dateFormatTodates.startOfDay, "day") + 1;

  useEffect(() => {
    if (timelineBodyRef) {
      timelineBodyRef?.scrollTo({
        left: dateFormatTodates.dayWidth * startWeek,
      });
    }
  }, [timelineBodyRef, dateType]);

  return (
    <>
      <TimelineContext.Provider
        value={{
          contentRef: timelineRef,
          bodyRef: timelineBodyRef,
          dateFormatTodates,
          randomId,
          holderWidth,
          dateType,
          dayWidthSize,
          header,
          dependencies,
          setDateType,
          onDragEnd,
          setDayWidthSize,
        }}
      >
        <div
          className="uic-timeline"
          ref={(ref) => setTimelineRef(ref as any)}
          id={randomId}
          day-width={dateFormatTodates.dayWidth}
          holder-width={holderWidth}
          start-date={dateFormatTodates.startOfDay.format(dateFormats.DEFAULT)}
          end-date={dateFormatTodates.endOfDay.format(dateFormats.DEFAULT)}
        >
          <Header />

          <div
            className="uic-timeline-body"
            ref={(ref) => setTimelineBodyRef(ref)}
            onScroll={(e) =>
              timelineOnScroll(e, {
                randomId,
                setStartTimeline,
                startTimeline: startTimeline.date,
                startCount: startTimeline.startCount,
                endCount: startTimeline.endCount,
                dateType,
                dateFormatTodates,
                holderWidth,
              })
            }
            id={`timelineBody_${randomId}`}
          >
            <Topbar />
            {children}
            <Shadow />
          </div>
          <Resize onResize={onResize} />
        </div>
      </TimelineContext.Provider>
    </>
  );
};

Timeline.OutsideDraggable = Draggable;
Timeline.Holder = Holder;
export default Timeline;

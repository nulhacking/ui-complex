import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ITimelineData } from "../../utils/models/ITimelineData";
import { TimelineContext } from "../../hooks/TimelineContext";
import Range from "../range/Range";

interface IProps extends ITimelineData {
  children: JSX.Element;
  content?: JSX.Element;
}

const Holder: {
  (props: IProps): JSX.Element;
  Range: typeof Range;
} = ({ children, content, ...props }: IProps) => {
  const childsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { dateFormatTodates, holderWidth } = useContext(TimelineContext);
  // const [activeIndex, setActiveIndex] = useState<string[]>([]);

  // const [tasksHeight, setTasksHeight] = useState(68);

  useEffect(() => {
    // const timelineBody = document.getElementById(`timelineBody_${randomId}`);

    // const scrollEvent = (e: React.UIEvent<HTMLElement>) => {
    //   const position = {
    //     scrolStart:
    //       e?.currentTarget?.scrollLeft - e?.currentTarget?.offsetWidth,
    //     scrolEnd:
    //       e?.currentTarget?.scrollLeft + e?.currentTarget?.offsetWidth * 1.5,
    //   };
    //   dateFormatTodates?.data?.forEach((item, i) => {
    //     const left = dateFormatTodates?.data
    //       ?.slice(0, i)
    //       .reduce((p, c) => (p = p + c.width), 0);

    //     if (
    //       position?.scrolStart <= left &&
    //       position?.scrolEnd >= left + item?.width
    //     ) {
    //       setActiveIndex((prev) => [...prev, item?.key]);
    //     } else {
    //       setActiveIndex((prev) => [
    //         ...prev?.filter((key) => key !== item?.key),
    //       ]);
    //     }
    //   });
    // };

    // timelineBody?.addEventListener<any>("scroll", scrollEvent);
    return () => {
      // timelineBody?.removeEventListener<any>("scroll", scrollEvent);
    };
  }, [childsRef, containerRef, dateFormatTodates]);

  // console.log(activeIndex);

  return (
    <div className="uic-timeline-body-row" id={props?.id} ref={containerRef}>
      <div
        className="uic-timeline-body-holder"
        style={{ minWidth: holderWidth }}
      >
        {content}
      </div>
      {dateFormatTodates?.data?.map((item, i) => {
        const left = dateFormatTodates?.data
          ?.slice(0, i)
          .reduce((p, c) => (p = p + c.width), 0);
        return (
          <div
            className={`uic-timeline-body-date${
              item?.today ? " uic-timeline-body-date-today" : ""
            }`}
            key={item?.key}
            // ref={(ref) => {
            //   if (ref) {
            //     childsRef.current?.push(ref);
            //   }
            // }}
            style={{
              width: item.width,
              left: holderWidth + left,
            }}
          ></div>
        );
      })}
      <div
        className="uic-timeline-body-tasks"
        style={{
          gridTemplateColumns: `repeat(${dateFormatTodates?.dayCount}, ${dateFormatTodates?.dayWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

Holder.Range = Range;
export default Holder;

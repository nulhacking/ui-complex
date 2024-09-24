import React, { useContext, useEffect } from "react";
import { TimelineContext } from "../../hooks/TimelineContext";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";
import { DateType } from "../../utils/enums/dateType";

interface IProps {
  onResize?: (props: { size: Partial<Record<DateType, number>> }) => void;
}

const Resize = ({ onResize }: IProps) => {
  const { setDayWidthSize, dateType, randomId, dayWidthSize, bodyRef } =
    useContext(TimelineContext);

  const handlePlus = () => {
    setDayWidthSize((prev) => {
      const dateCount = Math.round(
        getTimelineScroll(randomId).x / prev[dateType]
      );

      bodyRef?.scroll({
        left: getTimelineScroll(randomId).x + dateCount * 10,
        behavior: "instant",
      });
      return {
        ...prev,
        [dateType]: prev[dateType] + 10,
      };
    });

    onResize &&
      onResize({
        size: { ...dayWidthSize, [dateType]: dayWidthSize[dateType] + 10 },
      });
  };

  const handleMinus = () => {
    setDayWidthSize((prev) => {
      const dateCount = Math.round(
        getTimelineScroll(randomId).x / prev[dateType]
      );
      bodyRef?.scroll({
        left: getTimelineScroll(randomId).x - dateCount * 10,
        behavior: "instant",
      });
      return {
        ...prev,
        [dateType]: prev[dateType] - 10,
      };
    });

    onResize &&
      onResize({
        size: { ...dayWidthSize, [dateType]: dayWidthSize[dateType] - 10 },
      });
  };

  //   useEffect(() => {
  //     const scrollEvent = (e: WheelEvent) => {
  //       e.stopPropagation();

  //       e.preventDefault();
  //       if (e.ctrlKey) {
  //         if (e.deltaY > 0) {
  //           handleMinus();
  //         } else {
  //           handlePlus();
  //         }
  //       }
  //     };

  //     window.addEventListener("wheel", scrollEvent, { passive: false });
  //     return () => {
  //       window.removeEventListener("wheel", scrollEvent);
  //     };
  //   }, [dateType, bodyRef]);

  return (
    <div className="uic-timeline-resize">
      <div className="uic-timeline-resize-item" onClick={handlePlus}>
        +
      </div>
      <div className="uic-timeline-resize-item" onClick={handleMinus}>
        -
      </div>
    </div>
  );
};

export default Resize;

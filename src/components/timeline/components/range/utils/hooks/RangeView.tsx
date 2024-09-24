import { useContext, useEffect } from "react";
import { ITimelineDataChildren } from "../../../../utils/models/ITimelineData";
import { TimelineContext } from "../../../../hooks/TimelineContext";

interface IProps extends ITimelineDataChildren {
  startDateDay: number;
  dueDateDay: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  rangeContentRef: React.MutableRefObject<HTMLDivElement | null>;
  rangeRef: React.MutableRefObject<HTMLDivElement | null>;
  defaultWidth: number;
  isDrag: boolean;
}

const RangeView = ({
  dueDateDay,
  startDateDay,
  setVisible,
  visible,
  rangeContentRef,
  rangeRef,
  defaultWidth,
  isDrag,
  ...props
}: IProps) => {
  const { randomId, dateFormatTodates, holderWidth } =
    useContext(TimelineContext);
  const { dayWidth } = dateFormatTodates;
  const timelineBody = document.getElementById(`timelineBody_${randomId}`);

  // const startWidth = dayWidth * startDateDay - holderWidth;
  const endWidth = dayWidth * (dueDateDay + 1);

  const scrollEvent = (e: HTMLElement | null) => {
    const position = {
      scrolStart: e?.scrollLeft || 0,
      scrolEnd:
        (e?.scrollLeft || 0) + (timelineBody?.offsetWidth || 0) + defaultWidth,
    };

    // const view =
    //   position.scrolStart - startWidth > 0
    //     ? position.scrolStart - startWidth
    //     : 0;

    // setTimeout(() => {
    //   rangeContentRef.current?.setAttribute(
    //     "style",
    //     `width: ${defaultWidth - view}px;`
    //   );
    // }, 0.5);
    if (
      (position.scrolStart < endWidth - holderWidth &&
        position.scrolEnd > endWidth) ||
      isDrag
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    timelineBody?.addEventListener("scroll", (e) =>
      scrollEvent(e.currentTarget as HTMLElement)
    );

    return () => {
      timelineBody?.removeEventListener("scroll", (e) =>
        scrollEvent(e.currentTarget as HTMLElement)
      );
    };
  }, [randomId, dateFormatTodates, isDrag, scrollEvent]);

  useEffect(() => {
    scrollEvent(timelineBody);
  }, [props]);
  return null;
};

export default RangeView;

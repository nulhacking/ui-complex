import { useContext } from "react";
import ArrowIcon from "../../../../../assets/icons/ArrowIcon";
import { TimelineContext } from "../../../hooks/TimelineContext";
import dayjs from "dayjs";

const Today = () => {
  const { bodyRef, dateFormatTodates } = useContext(TimelineContext);
  const { dayWidth, startOfDay } = dateFormatTodates;

  const today = dayjs().diff(startOfDay, "day");
  const handleToday = () => {
    // bodyRef?.querySelector("#today")?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "center",
    //   inline: "center",
    // });
    bodyRef?.scrollTo({
      behavior: "smooth",
      left: today * dayWidth,
    });
  };

  const handlePrev = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (e?.ctrlKey) {
      bodyRef?.scrollTo({
        behavior: "smooth",
        left: bodyRef?.scrollLeft - dayWidth * 5,
      });
    } else {
      bodyRef?.scrollTo({
        behavior: "smooth",
        left: bodyRef?.scrollLeft - dayWidth,
      });
    }
  };

  const handleNext = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (e?.ctrlKey) {
      bodyRef?.scrollTo({
        behavior: "smooth",
        left: bodyRef?.scrollLeft + dayWidth * 5,
      });
    } else {
      bodyRef?.scrollTo({
        behavior: "smooth",
        left: bodyRef?.scrollLeft + dayWidth,
      });
    }
  };

  return (
    <div className="uic-timeline-header-today">
      <ArrowIcon
        placement="right"
        className="uic-timeline-header-today-icon"
        onClick={handlePrev}
      />
      <span onClick={handleToday}>Today</span>
      <ArrowIcon
        placement="left"
        className="uic-timeline-header-today-icon"
        onClick={handleNext}
      />
    </div>
  );
};

export default Today;

import { useContext } from "react";
import { TimelineContext } from "../../hooks/TimelineContext";

const Topbar = () => {
  const { dateFormatTodates, holderWidth, topBar } = useContext(TimelineContext);
  return (
    <div className="uic-timeline-body-row-topbar">
      <div
        className="uic-timeline-body-row-topbar-holder"
        style={{ width: holderWidth }}
      >
        {topBar?.extra && topBar.extra()}
      </div>
      {dateFormatTodates?.data?.map((item) => (
        <div
          className="uic-timeline-body-date-title"
          key={item?.label}
          {...(item?.today && { id: "today" })}
          style={{ width: item.width }}
        >
          {item?.label}
        </div>
      ))}
    </div>
  );
};

export default Topbar;

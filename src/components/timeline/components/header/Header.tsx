import { useContext } from "react";
import DateFormat from "./actions/DateFormat";
import Today from "./actions/Today";
import "./header.scss";
import { TimelineContext } from "../../hooks/TimelineContext";

const Header = () => {
  const { header } = useContext(TimelineContext);
  return (
    <div className="uic-timeline-header">
      <div className="uic-timeline-header-item">
        <Today />
        <DateFormat />
      </div>
      {header?.extra && header.extra()}
    </div>
  );
};

export default Header;

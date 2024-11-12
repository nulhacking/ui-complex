import React from "react";
import LinkIcon from "../../../../assets/icons/LinkIcon";

const Waiting = () => {
  return (
    <div
      className="uic-timeline-body-range-waiting"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <LinkIcon />
    </div>
  );
};

export default Waiting;

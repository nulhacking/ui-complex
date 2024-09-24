import React, { useContext } from "react";
import ArrowIcon from "../../../../../assets/icons/ArrowIcon";
import { DropDown } from "../../../../dropdown/DropDown";
import { DateType } from "../../../utils/enums/dateType";
import { TimelineContext } from "../../../hooks/TimelineContext";

const DateFormat = () => {
  const { setDateType } = useContext(TimelineContext);
  return (
    <DropDown
      items={[
        {
          label: "Day",
          value: DateType.DAY,
          onClick(value, e) {
            setDateType(value as DateType);
          },
        },
        {
          label: "Week",
          value: DateType.WEEK,
          onClick(value, e) {
            setDateType(value as DateType);
          },
        },
        {
          label: "Month",
          value: DateType.MONTH,
          onClick(value, e) {
            setDateType(value as DateType);
          },
        },
      ]}
    >
      <div className="uic-timeline-header-dateFormat">
        Day <ArrowIcon placement="bottom" />
      </div>
    </DropDown>
  );
};

export default DateFormat;

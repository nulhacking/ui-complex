import ReactDOM from "react-dom";
import styles from "./ganttVerticalLine.module.scss";
import LineChangeIcon from "../../../../assets/icons/LineChangeIcon";
import ResizeIcon from "../../../../assets/icons/ResizeIcon";
import { Component } from "react";

const GanttVerticalLine = () => {
  return (
    <div className={styles.container}>
      <ResizeIcon className={styles.resize} />
      <LineChangeIcon />
      <LineChangeIcon />
      <LineChangeIcon />
    </div>
  );
};

export default GanttVerticalLine;

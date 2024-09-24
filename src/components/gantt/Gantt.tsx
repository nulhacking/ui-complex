import React, { useReducer, createContext } from "react";
import styles from "./gantt.module.scss";
import GanttTable from "./components/gantt-table/GanttTable";
import GanttVerticalLine from "./components/gantt-vertical-line/GanttVerticalLine";
import GanttChart from "./components/gantt-chart/GanttChart";
import GlobalReducerContext from "../global-reducer-context/GlobalReducerContext";

interface IProps {
  style?: React.CSSProperties | undefined;
}

export const Gantt = ({ style }: IProps) => {
  return (
    <GlobalReducerContext state={{ lineSize: 500 }}>
      <div className={styles.container} style={{ height: 500, ...style }}>
        <GanttTable />
        <GanttVerticalLine />
        <GanttChart />
      </div>
    </GlobalReducerContext>
  );
};

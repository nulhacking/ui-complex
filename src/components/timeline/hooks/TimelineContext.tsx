import React, { ReactNode } from "react";
import {
  DateFormatToDate,
  dateTypeToDate,
} from "../utils/helpers/dateTypeToDate";
import { DateType } from "../utils/enums/dateType";
import { IRange } from "../utils/models/IRange";

export namespace ITimelineContext {
  export interface IState {
    contentRef: HTMLDivElement | null;
    bodyRef: HTMLDivElement | null;
    randomId: string;
    dateFormatTodates: DateFormatToDate;
    holderWidth: number;
    dateType: DateType;
    dayWidthSize: Record<DateType, number>;
    header?: ITimelineContext.IHeader;
  }
  export interface IHeader {
    extra: () => ReactNode;
  }
}

export interface TimelineContextDataState extends ITimelineContext.IState {}

export interface TimelineContextData extends TimelineContextDataState {
  setDateType: React.Dispatch<React.SetStateAction<DateType>>;
  setDayWidthSize: React.Dispatch<
    React.SetStateAction<Record<DateType, number>>
  >;
  onDragEnd?: (range: IRange) => void;
}

export const timelineDefaultState: TimelineContextData = {
  randomId: Math.random().toString(16).slice(2),
  bodyRef: null,
  holderWidth: 205,
  contentRef: null,
  dateType: DateType.DAY,
  dayWidthSize: {
    [DateType.DAY]: 190,
    [DateType.WEEK]: 100,
    [DateType.MONTH]: 50,
  },
  dateFormatTodates: dateTypeToDate(),
  setDateType: () => {},
  setDayWidthSize: () => {},
};

export const TimelineContext =
  React.createContext<TimelineContextData>(timelineDefaultState);

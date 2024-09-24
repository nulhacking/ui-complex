import { Dayjs } from "dayjs";

export interface IRange {
  id: string;
  startDate: Dayjs | undefined;
  dueDate: Dayjs | undefined;
  destinationId: string;
  sourceId: string;
}

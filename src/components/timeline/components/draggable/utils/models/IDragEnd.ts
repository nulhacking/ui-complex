import { Dayjs } from "dayjs";

export interface IDragEnd {
  startDate: Dayjs;
  dueDate: Dayjs;
  destinationId: string;
}

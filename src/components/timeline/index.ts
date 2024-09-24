export { default as Timeline } from "./Timeline";
import { IDragEnd } from "./components/draggable/utils/models/IDragEnd";
import { ITimelineContext } from "./hooks/TimelineContext";
import { IRange as IRanged } from "./utils/models/IRange";

export namespace ITImeline {
  export interface IOutsideDragEnd extends IDragEnd {}
  export interface IRange extends IRanged {}
  export interface IHeader extends ITimelineContext.IHeader {}
}

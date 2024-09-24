import { getTimeline } from "../../components/draggable/utils/helpers/getTimeline";

export const timelineMouseUp = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  { id }: { id: string }
) => {
  console.log(getTimeline({ x: e?.clientX, y: e?.clientY }));
};

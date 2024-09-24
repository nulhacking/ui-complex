export const getDragContent = ({
  offsetTop,
  offsetLeft,
  offsetHeight,
  id,
  dateCount,
  dayWidth,
  holderWidth,
  sourceId,
  end,
}: {
  offsetTop: number;
  offsetLeft: number;
  offsetHeight: number;
  id: string;
  dateCount: number;
  dayWidth: number;
  holderWidth: number;
  sourceId: string;
  end: boolean;
}) => {
  let arr: HTMLDivElement[] = [];

  const timelineBody: HTMLDivElement = document.querySelector(
    `#timelineBody_${id}`
  )!;

  const selectPosition = {
    top: offsetTop - offsetHeight,
    left: offsetLeft,
  };

  timelineBody
    ?.querySelectorAll<HTMLDivElement>(".uic-timeline-body-row")
    ?.forEach((item) => {
      if (
        item?.offsetTop <= selectPosition?.top &&
        selectPosition?.top <= item?.offsetTop + item?.offsetHeight
      ) {
        arr.push(item);
      }
    });

  const getPosition = {
    top: arr[0]?.offsetTop,
    left:
      Math.round((selectPosition?.left - holderWidth) / dayWidth) * dayWidth +
      holderWidth,
    height: arr[0]?.offsetHeight,
    width: dateCount * dayWidth,
    destinationId: String(
      arr[0]?.id ||
        timelineBody?.querySelectorAll<HTMLDivElement>(
          ".uic-timeline-body-row"
        )[0]?.id ||
        sourceId
    ),
    startIndex: Math.round((selectPosition?.left - holderWidth) / dayWidth),
  };
  const shadow = timelineBody?.querySelector<HTMLDivElement>(
    ".uic-timeline-shadow"
  );

  if (shadow) {
    timelineBody?.querySelector(".uic-timeline-shadow")?.setAttribute(
      "style",
      `
      opacity: ${end ? 0 : 1};
      width: ${getPosition?.width}px;
      height: ${getPosition?.height}px;
      left: ${getPosition?.left}px;
      top: ${getPosition?.top}px;
    `
    );
  }

  return getPosition;
};

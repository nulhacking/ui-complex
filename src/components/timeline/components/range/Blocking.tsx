import React, { useContext, useEffect, useRef, useState } from "react";
import LinkIcon from "../../../../assets/icons/LinkIcon";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";
import { TimelineContext } from "../../hooks/TimelineContext";

interface IProps {
  ids: string[];
  taskId: string;
  fromRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Blocking = ({ ids, taskId, fromRef }: IProps) => {
  const [svgPosition, setSvgPosition] = useState({
    width: 0,
    height: 0,
    right: 0,
    top: 0,
    paths: [] as string[],
  });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { contentRef, randomId, dateFormatTodates } =
    useContext(TimelineContext);
  const { dayWidth } = dateFormatTodates;

  const [linePosition, setLinePosition] = useState({
    isLine: false,
    startWidth: 0,
    clientX: 0,
    clientY: 0,
    x: 0,
    y: 0,
    angle: 0,
  });

  const containerTop = () =>
    -(contentRef?.getBoundingClientRect()?.top || 0) +
    getTimelineScroll(randomId).y;

  const containerLeft = () =>
    -(contentRef?.getBoundingClientRect()?.left || 0) +
    getTimelineScroll(randomId).x;

  const setSvgLines = (ids: string[]) => {
    if (ids.length > 0) {
      const fromTask = fromRef?.current;

      const fromStart =
        Number(
          fromTask!["style" as keyof typeof fromTask]["grid-column-start"]
        ) * dayWidth;
      const fromEnd =
        Number(fromTask!["style" as keyof typeof fromTask]["grid-column-end"]) *
        dayWidth;

      const fromPosition = fromTask?.getBoundingClientRect();
      const fromLeft = fromStart || 0;

      let maxLeft = fromStart;
      let maxRight = fromEnd;
      let maxTop = fromPosition?.top! + containerTop();
      let maxBottom = fromPosition?.bottom! + containerTop();
      let right = 20;
      let top = 0;

      let paths: string[] = [];

      ids?.forEach((id) => {
        const taks = contentRef?.querySelectorAll<HTMLDivElement>(
          `[task-id='${id}']`
        );

        taks?.forEach((toTask) => {
          if (toTask) {
            const toPosition = toTask?.getBoundingClientRect();

            const toStart =
              Number(toTask.style.gridColumnStart) * dayWidth + 20;
            const toEnd = Number(toTask.style.gridColumnEnd) * dayWidth + 20;

            if (toStart < maxLeft) {
              maxLeft = toStart;
            }
            if (toEnd > maxRight) {
              right = toEnd - fromEnd + 20;
              maxRight = toEnd;
            }

            if (toPosition?.top! + containerTop() < maxTop) {
              maxTop = toPosition?.top! - containerTop();
              top =
                fromPosition?.top! +
                containerTop() -
                toPosition?.top! +
                containerTop();
            }
            if (toPosition?.bottom! + containerTop() > maxBottom) {
              maxBottom = toPosition?.bottom! + containerTop();
            }
          }
        });
      });

      ids?.forEach((id) => {
        const taks = contentRef?.querySelectorAll<HTMLDivElement>(
          `[task-id='${id}']`
        );

        taks?.forEach((toTask) => {
          if (toTask) {
            const toPosition = toTask?.getBoundingClientRect();
            const toStart =
              Number(toTask.style.gridColumnStart) * dayWidth + 20;
            const startX =
              (fromStart > toStart ? fromLeft - toStart : 0) +
              (fromEnd - fromStart) +
              40;
            const startY = fromPosition?.top! + containerTop() - maxTop + 20;
            const endX = toStart - maxLeft + 20;
            const endY = toPosition?.top! + containerTop() - maxTop + 20;
            const controlOffset = 100;
            const d = `M ${startX} ${startY} C ${
              startX + controlOffset
            } ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

            paths.push(d);
          }
        });
      });

      setSvgPosition({
        width: maxRight - maxLeft + 60,
        height: maxBottom - maxTop,
        right,
        paths,
        top,
      });
    } else {
      setSvgPosition({
        width: 0,
        height: 0,
        right: 0,
        top: 0,
        paths: [],
      });
    }
  };

  useEffect(() => {
    const windowMouseMove = (e: MouseEvent) => {
      if (linePosition.isLine) {
        const a = e.clientX + containerLeft() - linePosition.clientX;
        const h = e.clientY + containerTop() - linePosition.clientY;

        const angle = Math.atan2(-h, -a);
        setLinePosition((prev) => ({
          ...prev,
          x: a,
          y: h,
          angle: angle,
        }));
      }
    };

    const windowMouseUp = (e: MouseEvent) => {
      if (linePosition.isLine) {
        setLinePosition((prev) => ({
          ...prev,
          isLine: false,
          angle: 0,
          x: 0,
          y: 0,
        }));
      }
    };

    window.addEventListener("mousemove", windowMouseMove);
    window.addEventListener("mouseup", windowMouseUp);
    return () => {
      window.removeEventListener("mousemove", windowMouseMove);
      window.removeEventListener("mouseup", windowMouseUp);
    };
  }, [linePosition.isLine]);

  useEffect(() => {
    const mutationObserve = new MutationObserver((elements) => {
      setSvgLines(ids);
    });

    if (contentRef) {
      mutationObserve.observe(contentRef, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    }

    return () => {
      mutationObserve.disconnect();
    };
  }, [ids]);

  useEffect(() => {
    setSvgLines(ids);
  }, [svgRef.current, ids]);

  return (
    <>
      <div
        className="uic-timeline-body-range-line"
        style={{
          width: Math.sqrt(linePosition.x ** 2 + linePosition.y ** 2),
          transform: `rotate(${linePosition.angle}rad)`,
        }}
      />
      <svg
        ref={svgRef}
        width={svgPosition.width}
        height={svgPosition.height}
        style={{
          right: -svgPosition?.right,
          top: -svgPosition?.top,
        }}
        className="uic-timeline-body-range-line-svg"
      >
        {svgPosition.paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </svg>
      <div
        className="uic-timeline-body-range-blocking"
        onMouseDown={(e) => {
          e.stopPropagation();
          setLinePosition({
            ...linePosition,
            isLine: true,
            clientX: e.clientX + containerLeft(),
            clientY: e.clientY + containerTop(),
            x: 0,
            y: 0,
          });
          if (contentRef) {
            contentRef["dependence"] = {
              fromId: taskId,
              type: "blocking",
              isLine: true,
            };
          }
        }}
        style={{
          opacity: ids?.length > 0 || linePosition?.isLine ? 1 : "",
          left:
            ids?.length > 0 || linePosition?.isLine ? "calc(100% - 10px)" : "",
        }}
      >
        <LinkIcon />
      </div>
    </>
  );
};

export default Blocking;

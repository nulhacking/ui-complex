import React, { useContext, useEffect, useState } from "react";
import LinkIcon from "../../../../assets/icons/LinkIcon";
import { TimelineContext } from "../../hooks/TimelineContext";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";

interface IProps {
  ids: string[];
  taskId: string;
}

const Waiting = ({ ids, taskId }: IProps) => {
  const { contentRef, randomId } = useContext(TimelineContext);

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

  return (
    <>
      <div
        className="uic-timeline-body-range-line-waiting"
        style={{
          width: Math.sqrt(linePosition.x ** 2 + linePosition.y ** 2),
          transform: `rotate(${linePosition.angle}rad)`,
        }}
      />
      <div
        className="uic-timeline-body-range-waiting"
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
              type: "waiting",
              toId: taskId,
              isLine: true,
            };
          }
        }}
        style={{
          opacity: ids?.length > 0 || linePosition?.isLine ? 1 : "",
          right:
            ids?.length > 0 || linePosition?.isLine ? "calc(100% - 10px)" : "",
        }}
      >
        <LinkIcon />
      </div>
    </>
  );
};

export default Waiting;

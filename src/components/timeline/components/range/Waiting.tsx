import React, { cloneElement, useContext, useEffect, useState } from "react";
import LinkIcon from "../../../../assets/icons/LinkIcon";
import { ITimelineContext, TimelineContext } from "../../hooks/TimelineContext";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";

interface IProps {
  taskId: string;
  waiting?: ITimelineContext.DependenceProps;
}

const Waiting = ({ waiting, taskId }: IProps) => {
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
        if (contentRef) {
          contentRef["dependence"] = undefined;
        }
      }
    };

    window.addEventListener("mousemove", windowMouseMove);
    window.addEventListener("mouseup", windowMouseUp);
    return () => {
      window.removeEventListener("mousemove", windowMouseMove);
      window.removeEventListener("mouseup", windowMouseUp);
    };
  }, [linePosition.isLine]);

  const MouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  };

  const isDep = (waiting?.ids || [])?.length > 0 || linePosition?.isLine;

  const LinkElmn = (
    <div
      className="uic-timeline-body-range-waiting"
      onMouseDown={MouseDown}
      style={{
        opacity: isDep ? 1 : "",
        right: isDep ? "calc(100% - 10px)" : "",
        background: waiting?.icon?.background,
      }}
    >
      <LinkIcon pathProps={{ stroke: waiting?.icon?.color }} />
    </div>
  );

  const renderElement = () =>
    waiting?.render ? (
      waiting?.render({
        elm: LinkElmn,
        isVisible: isDep,
      })
    ) : (
      <></>
    );

  return (
    <>
      <div
        className="uic-timeline-body-range-line-waiting"
        style={{
          width: Math.sqrt(linePosition.x ** 2 + linePosition.y ** 2),
          transform: `rotate(${linePosition.angle}rad)`,
        }}
      />
      {waiting?.render
        ? cloneElement(renderElement(), {
            onMouseDown: MouseDown,
            className: `uic-timeline-body-range-waiting ${
              renderElement()?.props?.className || ""
            }`,
            style: {
              opacity:
                (waiting?.ids || [])?.length > 0 || linePosition?.isLine
                  ? 1
                  : "",
              right:
                (waiting?.ids || [])?.length > 0 || linePosition?.isLine
                  ? "calc(100% - 10px)"
                  : "",
              ...renderElement()?.props?.style,
            },
            ...renderElement()?.props,
          })
        : LinkElmn}
    </>
  );
};

export default Waiting;

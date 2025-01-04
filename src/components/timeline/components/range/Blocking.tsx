import React, {
  cloneElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LinkIcon from "../../../../assets/icons/LinkIcon";
import { getTimelineScroll } from "../../utils/helpers/timelineOnScroll";
import { ITimelineContext, TimelineContext } from "../../hooks/TimelineContext";

interface IProps {
  taskId: string;
  fromRef: React.MutableRefObject<HTMLDivElement | null>;
  blocking?: ITimelineContext.DependenceProps;
}

const Blocking = ({ taskId, fromRef, blocking }: IProps) => {
  const [svgPosition, setSvgPosition] = useState({
    width: 0,
    height: 0,
    right: 0,
    top: 0,
    paths: [] as { path: string; stroke?: string }[],
  });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { contentRef, randomId, dateFormatTodates } =
    useContext(TimelineContext);
  const { dayWidth } = dateFormatTodates;

  // const contentRef = document.getElementById(randomId);

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

  const setSvgLines = (ids: ITimelineContext.DependenceProps["ids"]) => {
    if (ids && ids?.length > 0) {
      const fromTask = fromRef?.current;

      const fromStart =
        Number(
          fromTask!["style" as keyof typeof fromTask]["grid-column-start"]
        ) * dayWidth;
      const fromEnd =
        Number(fromTask!["style" as keyof typeof fromTask]["grid-column-end"]) *
        dayWidth;

      const fromPosition = fromTask?.getBoundingClientRect();

      let maxLeft = fromStart;
      let maxRight = fromEnd;
      let maxTop = fromPosition?.top! + containerTop();
      let maxBottom = fromPosition?.bottom! + containerTop();
      let right = 20;
      let top = 0;

      let paths: {
        path: string;
        stroke?: string;
      }[] = [];

      ids?.forEach((item) => {
        const { id } = item;
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

      ids?.forEach((item) => {
        const { id } = item;
        const taks = contentRef?.querySelectorAll<HTMLDivElement>(
          `[task-id='${id}']`
        );

        taks?.forEach((toTask) => {
          if (toTask) {
            const toPosition = toTask?.getBoundingClientRect();
            const toStart =
              Number(toTask.style.gridColumnStart) * dayWidth + 20;
            const startX =
              (maxLeft > toStart ? maxLeft - toStart : 0) +
              (fromEnd - maxLeft) +
              40;
            const startY = fromPosition?.top! + containerTop() - maxTop + 20;
            const endX = toStart - maxLeft + 20;
            const endY = toPosition?.top! + containerTop() - maxTop + 20;
            const controlOffset = 100;
            const d = `M ${startX} ${startY} C ${
              startX + controlOffset
            } ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

            paths.push({
              path: d,
              stroke: item?.color,
            });
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
      // console.log(contentRef);
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

  useEffect(() => {
    const mutationObserve = new MutationObserver((elements) => {
      const observeIds = elements?.reduce<string[]>((p, c) => {
        const id = (c?.target as HTMLElement)?.getAttribute("task-id");
        const nextId = (c?.nextSibling as HTMLElement)?.getAttribute("task-id");

        c?.addedNodes?.forEach((added) => {
          const id = (added as HTMLElement)?.getAttribute("task-id");
          if (id) {
            p.push(id);
          }
        });

        if (nextId) {
          p.push(nextId);
        }
        if (id) {
          p.push(id);
        }
        return p;
      }, []);
      if (observeIds?.length > 0) {
        setSvgLines(blocking?.ids || []);
      }
    });

    if (contentRef && blocking?.line?.visible !== false) {
      mutationObserve.observe(contentRef, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    }

    return () => {
      mutationObserve.disconnect();
    };
  }, [blocking?.ids, linePosition?.isLine, blocking?.line]);

  useEffect(() => {
    setSvgLines(blocking?.ids || []);
  }, [svgRef.current, blocking?.ids]);

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
        fromId: taskId,
        type: "blocking",
        isLine: true,
      };
    }
  };

  const isDep = (blocking?.ids || [])?.length > 0 || linePosition?.isLine;

  const LinkElmn = (
    <div
      className="uic-timeline-body-range-blocking"
      onMouseDown={MouseDown}
      style={{
        opacity: isDep ? 1 : "",
        left: isDep ? "calc(100% - 10px)" : "",
        background: blocking?.icon?.background,
      }}
    >
      <LinkIcon pathProps={{ stroke: blocking?.icon?.color }} />
    </div>
  );

  const renderElement = () =>
    blocking?.render ? (
      blocking?.render({
        elm: LinkElmn,
        isVisible: isDep,
      })
    ) : (
      <></>
    );

  return (
    <>
      <div
        className="uic-timeline-body-range-line"
        style={{
          width: Math.sqrt(linePosition.x ** 2 + linePosition.y ** 2),
          transform: `rotate(${linePosition.angle}rad)`,
        }}
      />
      {blocking?.line?.visible !== false ? (
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
            <path
              key={index}
              d={path?.path}
              stroke={path?.stroke || blocking?.line?.color || "#758195"}
            />
          ))}
        </svg>
      ) : null}
      {blocking?.render
        ? cloneElement(renderElement(), {
            onMouseDown: MouseDown,
            className: `uic-timeline-body-range-blocking ${
              renderElement()?.props?.className || ""
            }`,
            style: {
              opacity:
                (blocking?.ids || [])?.length > 0 || linePosition?.isLine
                  ? 1
                  : "",
              left:
                (blocking?.ids || [])?.length > 0 || linePosition?.isLine
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

export default Blocking;

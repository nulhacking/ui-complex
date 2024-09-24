import React, { cloneElement, useEffect, useRef, useState } from "react";
import { getTimeline } from "./utils/helpers/getTimeline";
import { IDragEnd } from "./utils/models/IDragEnd";
import { Root, createRoot } from "react-dom/client";

interface IProps {
  children: JSX.Element;
  onDragEnd?: (range: IDragEnd) => void;
}

export const Draggable = ({ children, onDragEnd }: IProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const childernRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [position, setPosition] = useState({
    draggable: false,
    left: 0,
    top: 0,
    startLeft: 0,
    startTop: 0,
    width: 100,
  });
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!elementRef.current && !rootRef.current) {
      const element = document.createElement("div");
      document.body.appendChild(element);
      elementRef.current = element;
      rootRef.current = createRoot(elementRef.current as HTMLElement);
    }
    rootRef?.current?.render(
      <DraggableContent position={position} children={children} />
    );
    setPosition((prev) => ({
      ...prev,
      width: childernRef.current?.getBoundingClientRect().width || 100,
      draggable: true,
      startLeft: e.clientX,
      startTop: e.clientY,
    }));
  };

  useEffect(() => {
    const windowMouseMove = (e: MouseEvent) => {
      if (position.draggable) {
        const left =
          position?.left -
          (position.startLeft - e.clientX) +
          (childernRef.current?.getBoundingClientRect().left || 0);
        const top =
          position?.top -
          (position.startTop - e.clientY) +
          (childernRef.current?.getBoundingClientRect().top || 0);

        setPosition((prev) => ({
          ...prev,
          left: left,
          top: top,
        }));
        getTimeline({ x: left, y: top });

        if (elementRef.current && rootRef?.current) {
          rootRef?.current?.render(
            <DraggableContent
              position={{
                ...position,
                left: left,
                top: top,
              }}
              children={children}
            />
          );
        }
      }
    };

    const windowMouseUp = (e: MouseEvent) => {
      if (position.draggable) {
        const left =
          position?.left -
          (position.startLeft - e.clientX) +
          (childernRef.current?.getBoundingClientRect().left || 0);
        const top =
          position?.top -
          (position.startTop - e.clientY) +
          (childernRef.current?.getBoundingClientRect().top || 0);

        setPosition((prev) => ({
          ...prev,
          draggable: false,
          top: 0,
          left: 0,
        }));
        getTimeline({ x: left, y: top, end: true, onDragEnd });
        if (elementRef.current && rootRef?.current) {
          rootRef?.current?.render(
            <DraggableContent
              position={{
                ...position,
                left: 0,
                top: 0,
                draggable: false,
              }}
              children={children}
            />
          );
        }
      }
    };

    window.addEventListener("mousemove", windowMouseMove);
    window.addEventListener("mouseup", windowMouseUp);

    return () => {
      window.removeEventListener("mousemove", windowMouseMove);
      window.removeEventListener("mouseup", windowMouseUp);
    };
  }, [position.draggable]);

  return (
    <>
      {cloneElement(children, {
        onMouseDown,
        ref: childernRef,
      })}
    </>
  );
};

export const DraggableContent = ({
  position,
  children,
}: {
  position: {
    draggable: boolean;
    left: number;
    top: number;
    startLeft: number;
    startTop: number;
    width: number;
  };
  children: JSX.Element;
}) => {
  return (
    <div
      className="uic-timeline-outside-draggable"
      style={{
        left: position.left,
        top: position?.top,
        opacity: position?.draggable ? 1 : 0,
        width: position.width,
      }}
    >
      {children}
    </div>
  );
};

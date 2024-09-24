import { cloneElement, useEffect, useRef, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import "./dropdown.scss";
import Menu from "../menu/Menu";

interface IDropDown {
  children: JSX.Element;
  items?: IMenuItem[];
}

interface IDropDownContent {
  x?: number;
  y?: number;
  open?: boolean;
  items?: IMenuItem[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropDown = ({ children, items }: IDropDown) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPosition({
      x:
        e.currentTarget?.getBoundingClientRect().left -
        document.body.getBoundingClientRect().x,
      y:
        e.currentTarget?.getBoundingClientRect().top +
        e.currentTarget?.getBoundingClientRect().height -
        document.body.getBoundingClientRect().y,
    });
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      if (!elementRef.current && !rootRef.current) {
        const element = document.createElement("div");
        document.body.appendChild(element);
        elementRef.current = element;
        rootRef.current = createRoot(elementRef.current as HTMLElement);
      }
      rootRef?.current?.render(
        <DropDownContent
          {...position}
          open={true}
          items={items}
          setOpen={setOpen}
        />
      );
    } else {
      if (elementRef.current && rootRef?.current) {
        rootRef?.current?.render(
          <DropDownContent
            {...position}
            open={false}
            items={items}
            setOpen={setOpen}
          />
        );
      }
    }
  }, [open, rootRef.current, elementRef.current]);

  return (
    <>
      {cloneElement(children, {
        onClick: handleClick,
      })}
    </>
  );
};

const DropDownContent = ({ x, y, open, items, setOpen }: IDropDownContent) => {
  const [mouse, setMouse] = useState(false);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      if (open && !mouse) {
        setOpen(false);
      }
    };

    window.addEventListener("click", windowClick);

    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, [mouse, open]);

  return (
    <div
      className={`uic-dropdown${open ? " uic-dropdown-open" : ""}`}
      style={{ top: y, left: x }}
      onMouseEnter={() => setMouse(true)}
      onMouseLeave={() => setMouse(false)}
    >
      {items && <Menu items={items} />}
    </div>
  );
};

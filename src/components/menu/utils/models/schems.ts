interface IMenuItem {
  label: JSX.Element | string;
  value: string;
  onClick?: (
    value: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

interface IMenu {
  items: IMenuItem[];
}

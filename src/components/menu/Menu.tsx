import "./menu.scss";

const Menu = ({ items }: IMenu) => {
  return (
    <div className="uic-menu">
      {items?.map((item) => (
        <div
          className="uic-menu-item"
          key={item?.value}
          onClick={(e) => {
            item.onClick && item?.onClick(item?.value, e);
          }}
        >
          {item?.label}
        </div>
      ))}
    </div>
  );
};

export default Menu;

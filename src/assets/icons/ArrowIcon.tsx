interface IProps extends React.SVGProps<SVGSVGElement> {
  placement?: "left" | "top" | "right" | "bottom";
}

const ArrowIcon = (props: IProps) => {
  const { placement = "bottom", ...attr } = props;
  const rotate: Record<typeof placement, number> = {
    bottom: 0,
    top: 180,
    left: -90,
    right: 90,
  };

  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${rotate[placement]}deg)`,
      }}
      {...attr}
    >
      <path
        d="M1.49264 -0.00194693L4.1802 2.68561L6.86776 -0.00194693L7.69048 0.820775L4.1802 4.33105L0.669922 0.820775L1.49264 -0.00194693Z"
        fill="#70757A"
      />
    </svg>
  );
};

export default ArrowIcon;

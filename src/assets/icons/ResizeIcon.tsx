import React from "react";

const ResizeIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 -5 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={"32"}
      height={"32"}
      {...props}
    >
      <path
        fill="#cccccc"
        d="M6,3a.5.5,0,0,1-.5.5H1.71L3.35,5.15a.48.48,0,0,1,0,.7.48.48,0,0,1-.7,0L.15,3.35a.48.48,0,0,1,0-.7L2.65.15a.48.48,0,0,1,.7,0,.48.48,0,0,1,0,.7L1.71,2.5H5.5A.5.5,0,0,1,6,3Zm9.85-.35L13.35.15a.48.48,0,0,0-.7,0,.48.48,0,0,0,0,.7L14.29,2.5H10.5a.5.5,0,0,0,0,1h3.79L12.65,5.15a.48.48,0,0,0,0,.7.48.48,0,0,0,.7,0l2.5-2.5A.48.48,0,0,0,15.85,2.65Z"
      />
    </svg>
  );
};

export default ResizeIcon;

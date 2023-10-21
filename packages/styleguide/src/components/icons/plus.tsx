import * as React from "react";

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={17} height={17} viewBox="0 0 17 17" fill="none" {...props}>
      <path
        d="M8.67856 1.67859V15.6786"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.67856 8.67859H15.6786"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

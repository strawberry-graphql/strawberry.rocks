import * as React from "react";

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={18} height={13} viewBox="0 0 18 13" fill="none" {...props}>
      <path
        d="M17 1L6 12 1 7"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

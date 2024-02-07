import * as React from "react";

export const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={10} height={6} viewBox="0 0 10 6" fill="none" {...props}>
      <path
        d="M9 5L5 1 1 5"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

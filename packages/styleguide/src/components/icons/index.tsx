import * as React from "react";

export const IndexIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 10H7M21 6H3M21 14H3M21 18H7"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

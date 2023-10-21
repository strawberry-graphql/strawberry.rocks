import * as React from "react";

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

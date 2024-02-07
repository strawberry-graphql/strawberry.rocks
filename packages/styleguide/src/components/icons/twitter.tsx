import * as React from "react";

export const TwitterCircleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <circle cx={20} cy={20} r={20} className="fill-current" />
      <g clipPath="url(#prefix__clip0_805_3997)">
        <path
          d="M29.167 12.5a9.081 9.081 0 01-2.617 1.275 3.734 3.734 0 00-6.55 2.5v.833a8.884 8.884 0 01-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 01-5.834 1.667c7.5 4.167 16.667 0 16.667-9.583a3.76 3.76 0 00-.067-.692 6.434 6.434 0 001.734-3.058z"
          className="fill-white dark:fill-black"
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_805_3997">
          <path
            className="fill-white dark:fill-black"
            transform="translate(10 10)"
            d="M0 0h20v20H0z"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

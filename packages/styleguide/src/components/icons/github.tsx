import * as React from "react";

export const GithubCircleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <circle cx={20} cy={20} r={20} className="fill-current" />
      <path
        d="M17.5 25.833c-4.167 1.25-4.167-2.083-5.833-2.5l5.833 2.5zm5.833 2.5v-3.225a2.807 2.807 0 00-.783-2.175c2.617-.291 5.367-1.283 5.367-5.833a4.533 4.533 0 00-1.25-3.125 4.226 4.226 0 00-.075-3.142s-.984-.291-3.259 1.234a11.149 11.149 0 00-5.833 0c-2.275-1.525-3.258-1.234-3.258-1.234a4.225 4.225 0 00-.075 3.142 4.533 4.533 0 00-1.25 3.15c0 4.517 2.75 5.508 5.366 5.833a2.808 2.808 0 00-.783 2.15v3.225"
        className="fill-white dark:fill-black"
      />
    </svg>
  );
};

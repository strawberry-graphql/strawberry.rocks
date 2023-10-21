import * as React from "react";

export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="strawberry-gradient">
          <stop offset="0%" stopColor="#EE0A78" />
          <stop offset="100%" stopColor="#FE620A" />
        </linearGradient>
      </defs>

      <g
        className="stroke-g-50 group-hover:stroke-strawberry-gradient"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </g>
    </svg>
  );
};

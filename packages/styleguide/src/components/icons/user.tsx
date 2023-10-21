import * as React from "react";

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

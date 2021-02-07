/** @jsx jsx */
import { jsx } from "theme-ui";
import { ReactSVGFC } from "types/react-svg";

export const ArrowRightIcon: ReactSVGFC = (props) => (
  <svg
    sx={{
      stroke: "primary",
    }}
    viewBox="0 0 22 17"
    width={22}
    height={17}
    fill="none"
    {...props}
  >
    <path
      d="M0 8.457h19.195M12.586 1l7.388 7.457-7.388 7.457"
      strokeWidth={2}
    />
  </svg>
);

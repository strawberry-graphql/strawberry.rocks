import { ThemeUICSSObject } from "theme-ui";

export type ReactSVGProps = React.SVGProps<SVGSVGElement>;
export type ReactSVGFC = (
  props: ReactSVGProps & { sx?: ThemeUICSSObject }
) => JSX.Element;

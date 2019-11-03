import Prism from "@theme-ui/prism";
import { Link } from "../components/link";

export default {
  pre: props => props.children,
  code: Prism,
  a: Link,
};

/** @jsx jsx */
import { jsx } from "theme-ui";

import Prism from "@theme-ui/prism";
import { AdditionalResources } from "../components/additional-resources";
import { Link } from "../components/link";

const getImageSrc = (src) => {
  if (src.startsWith("./")) {
    return src.replace(
      "./",
      "https://github.com/strawberry-graphql/strawberry/raw/master/docs/"
    );
  }

  return src;
};

export default {
  pre: (props) => props.children,
  code: Prism,
  a: Link,
  AdditionalResources,
  // eslint-disable-next-line react/display-name
  img: ({ src, ...props }) => <img src={getImageSrc(src)} {...props} />,
};

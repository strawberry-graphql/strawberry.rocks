/** @jsx jsx */
import { jsx } from "theme-ui";

import Prism from "@theme-ui/prism";
import { AdditionalResources } from "../components/additional-resources";
import { Link } from "../components/link";
import GraphQLExample from "../components/graphql-example.tsx";

const getImageSrc = src => {
  if (src.startsWith("./")) {
    return src.replace(
      "./",
      "https://github.com/strawberry-graphql/strawberry/raw/master/docs/"
    );
  }

  return src;
};

function CustomPrism({ className, children, ...props }) {
  const [language] = className.replace(/language-/, "").split(" ");

  if (language === "graphql+response") {
    const [query, response] = children.split("---");
    if (!query || !response) {
      throw new Error("Invalid content for language `graphql+response`");
    }
    return <GraphQLExample query={query} response={response} />;
  }

  return (
    <Prism className={className} {...props}>
      {children}
    </Prism>
  );
}

export default {
  pre: props => props.children,
  code: CustomPrism,
  a: Link,
  AdditionalResources,
  // eslint-disable-next-line react/display-name
  img: ({ src, ...props }) => (
    <img
      sx={{ borderWidth: 2, borderColor: "muted", borderStyle: "solid" }}
      src={getImageSrc(src)}
      {...props}
    />
  ),
};

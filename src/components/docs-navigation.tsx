/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "@theme-ui/components";

import { useStaticQuery, graphql } from "gatsby";

export const DocsNavigation: React.SFC = () => {
  const {
    allFile: { edges },
  } = useStaticQuery(graphql`
    query DocsNavigationQuery {
      allFile(filter: { sourceInstanceName: { eq: "strawberry-repo" } }) {
        edges {
          node {
            childMdx {
              frontmatter {
                title
                path
              }
            }
          }
        }
      }
    }
  `);

  return (
    <nav>
      {edges.map(({ node }) => (
        <Link
          href={node.childMdx.frontmatter.path}
          key={node.childMdx.frontmatter.path}
        >
          {node.childMdx.frontmatter.title}
        </Link>
      ))}
    </nav>
  );
};

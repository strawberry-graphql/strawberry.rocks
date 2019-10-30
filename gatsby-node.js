// eslint-disable-next-line
const path = require(`path`);

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/docs.tsx`);
  const result = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { eq: "strawberry-repo" } }) {
        edges {
          node {
            relativePath
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

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data.allFile.edges.forEach(({ node }) => {
    createPage({
      path: node.childMdx.frontmatter.path,
      component: blogPostTemplate,
      context: { relativePath: node.relativePath }, // additional data can be passed via context
    });
  });
};

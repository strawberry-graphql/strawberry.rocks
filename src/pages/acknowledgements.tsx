/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Text, Box, Flex, Heading } from "@theme-ui/components";
import SEO from "../components/seo";
import {
  AcknowledgementsPageQuery,
  AcknowledgementsPageQuery_allGitHubContributor_nodes,
} from "./__generated__/AcknowledgementsPageQuery";
import { Link } from "../components/link";
import { Fragment } from "react";

const IGNORE_LIST = ["dependabot-preview[bot]", "botberry"];

const MemberLink: React.SFC<{
  member: AcknowledgementsPageQuery_allGitHubContributor_nodes;
}> = ({ children, member }) => {
  let link = member.url;

  if (!link.startsWith("http")) {
    link = `http://${link}`;
  }

  return (
    <Link
      href={link}
      target="_blank"
      sx={{ color: "black", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};

const AcknowledgementsPage = ({ data }: AcknowledgementsPageQuery) => {
  const contributors = data.allGitHubContributor.nodes.filter(
    member => !IGNORE_LIST.includes(member.login)
  );

  return (
    <Fragment>
      <SEO title="Acknowledgements" />

      <Box sx={{ p: 4, pb: 6, maxWidth: 1280, mx: "auto" }}>
        <Heading sx={{ fontSize: 6, mb: 3 }}>Acknowledgements</Heading>
        <Text sx={{ mb: 4 }}>
          We&apos;d like to thank all of our contributors:
        </Text>

        <Flex
          as="ul"
          sx={{
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {contributors.map((member, index) => (
            <Box key={index} as="li" sx={{ flex: "0 0 230px", mb: 2 }}>
              <MemberLink member={member}>
                {member.name || member.login}
              </MemberLink>
            </Box>
          ))}
        </Flex>

        <MDXRenderer>{data.file.childMdx.body}</MDXRenderer>
      </Box>
    </Fragment>
  );
};

export default AcknowledgementsPage;

export const pageQuery = graphql`
  query AcknowledgementsPageQuery {
    file(
      relativePath: { eq: "content.md" }
      sourceInstanceName: { eq: "acknowledgements" }
    ) {
      childMdx {
        body
      }
    }

    allGitHubContributor {
      nodes {
        login
        name
        url
      }
    }
  }
`;

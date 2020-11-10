/** @jsx jsx */
import { jsx } from "theme-ui";
import { Text, Box, Flex, Heading } from "@theme-ui/components";
// import SEO from "../components/seo";
import { Link } from "~/components/link";
import BaseLayout from "~/components/base-layout";
import MDXDocument from "~/content/acknowledgements.mdx";
import { getCollaborators, GithubCollaborator } from "~/github";

const IGNORE_LIST = ["dependabot-preview[bot]", "dependabot-bot", "botberry"];

const MemberLink: React.SFC<{
  member: GithubCollaborator;
}> = ({ children, member }) => {
  let link = member.url;

  if (!link.startsWith("http")) {
    link = `http://${link}`;
  }

  return (
    <Link
      href={link}
      target="_blank"
      sx={{ color: "text", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};

const AcknowledgementsPage = ({
  collaborators,
}: {
  collaborators: GithubCollaborator[];
}) => {
  const filteredCollaborators = collaborators.filter(
    (member) => !IGNORE_LIST.includes(member.login)
  );

  return (
    <BaseLayout>
      {/* <SEO title="Acknowledgements" /> */}

      <Box sx={{ p: 4, pb: 6, maxWidth: 1280, mx: "auto" }}>
        <Heading sx={{ fontSize: [5, 6], mb: 3 }}>Acknowledgements</Heading>
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
          {filteredCollaborators.map((member, index) => (
            <Box key={index} as="li" sx={{ flex: "0 0 230px", mb: 2 }}>
              <MemberLink member={member}>
                {member.name || member.login}
              </MemberLink>
            </Box>
          ))}
        </Flex>

        <MDXDocument />
      </Box>
    </BaseLayout>
  );
};

export async function getStaticProps() {
  const collaborators = await getCollaborators();
  return {
    props: {
      collaborators,
    },
  };
}

export default AcknowledgementsPage;

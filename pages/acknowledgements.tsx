/** @jsx jsx */
import { Text, Box, Flex, Heading, Paragraph } from "@theme-ui/components";
import { jsx } from "theme-ui";

import { Link } from "~/components/link";
import { SEO } from "~/components/seo";
import { githubQuery } from "~/github";

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
    <>
      <SEO title="Acknowledgements" />

      <Box sx={{ p: 4, pb: 6, maxWidth: 1280, mx: "auto" }}>
        <Heading sx={{ fontSize: [5, 6], mb: 3 }}>Acknowledgements</Heading>
        <Text sx={{ mb: 4 }} as="p">
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

        <Box>
          <Heading sx={{ my: 4 }}>
            In addition we&apos;d like to thank also the following people:
          </Heading>
          <ul>
            <li>
              <Link href="https://twitter.com/druguinni">Orlando Festa</Link>{" "}
              for the fantastic work on the Strawberry logo.
            </li>

            <li>
              <Link href="https://twitter.com/BijlsmaLotte">Lotte Bijlsma</Link>{" "}
              for the amazing design of this website.
            </li>
          </ul>

          <Heading sx={{ mt: 4, mb: 2 }}>Icons:</Heading>
          <Paragraph sx={{ mb: 3 }}>
            We are using icons from{" "}
            <Link href="https://thenounproject.com">The Noun Project</Link>.
            Here&apos;s the list of icons we used on this website:
          </Paragraph>

          <ul>
            <li>
              Async by{" "}
              <Link href="https://thenounproject.com/t.rostilov/">
                Timofey Rostilov
              </Link>
            </li>
            <li>
              Server by{" "}
              <Link href="https://thenounproject.com/clea.doltz/">
                Clea Doltz
              </Link>
            </li>
            <li>
              Python by{" "}
              <Link href="https://thenounproject.com/priyokumoro5/">
                Zaenal Abidin
              </Link>
            </li>
            <li>
              Boxes by{" "}
              <Link href="https://thenounproject.com/iconsbazaar89/">
                Icons Bazaar
              </Link>
            </li>
            <li>
              Navigation by{" "}
              <Link href="https://thenounproject.com/Flatart/">Flatart</Link>
            </li>
            <li>
              Close by{" "}
              <Link href="https://thenounproject.com/landan/">
                Landan Lloyd
              </Link>
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
};

const query = `
  query CollaboratorsQuery($repo: String!, $owner: String!) {
    repository(name: $repo, owner: $owner) {
      collaborators(affiliation: ALL) {
        edges {
          node {
            name
            login
            websiteUrl
            url
          }
        }
      }
    }
  }
`;

type GithubCollaborator = {
  name: string | null;
  login: string;
  websiteUrl: string | null;
  url: string;
};

export async function getStaticProps() {
  const { repository } = await githubQuery(query, {
    repo: "strawberry",
    owner: "strawberry-graphql",
  });

  return {
    props: {
      collaborators: repository.collaborators.edges.map(
        ({ node }: { node: GithubCollaborator }) => node
      ),
    },
  };
}

export default AcknowledgementsPage;

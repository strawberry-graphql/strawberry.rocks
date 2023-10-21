import type { Metadata } from "next";

import { fetchContributors, fetchSponsors } from "~/lib/api";

import {
  Display,
  Heading,
  ContributorsGrid,
  GlowEffect,
  Box,
  Spacer,
  Paragraph,
  List,
  ListItem,
  Link,
} from "@strawberry-graphql/styleguide";

// revalidate every 10 minutes
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Acknowledgements",
};

export default async function AcknowledgementsPage() {
  const contributors = await fetchContributors();
  const sponsors = await fetchSponsors();

  return (
    <>
      <GlowEffect />
      <Spacer size={80} />

      <Box textAlign="center" px={16} maxWidth="screen-sm">
        <Display>Acknowledgements</Display>

        <Spacer size={24} />

        <Heading level={4}>
          Strawberry wouldn&apos;t be possible without all these amazing people
          and sponsors ❤️
        </Heading>
      </Box>

      <Spacer size={80} />

      <Box maxWidth="screen-lg" px={16}>
        <Heading>Sponsors</Heading>
        <Spacer size={40} />
        <ContributorsGrid
          contributors={sponsors.map((sponsor: any) => ({
            ...sponsor,
            name: sponsor.name || sponsor.id,
            title: "Sponsor",
            avatarUrl: sponsor.logo,
            url: sponsor.href,
          }))}
        />

        <Spacer size={80} />

        <Heading>Contributors</Heading>
        <Spacer size={40} />

        <ContributorsGrid
          contributors={contributors.map((contributor: any) => ({
            ...contributor,
            title: "Contributor",
          }))}
        />

        <Spacer size={80} />

        <Paragraph>
          In addition we&apos;d like to thank also the following people:
        </Paragraph>

        <List>
          <ListItem>
            <Link href="https://twitter.com/druguinni">Orlando Festa</Link> for
            the fantastic work on the Strawberry logo.
          </ListItem>

          <ListItem>
            <Link href="https://rollstudio.co.uk">Roll Studio</Link> for the
            amazing design of this website.
          </ListItem>
        </List>
        <Spacer size={80} />
      </Box>
    </>
  );
}

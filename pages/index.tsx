import { Heading, Grid, Box, Text, Flex } from "@theme-ui/components";

import { NextPage } from "next";

import { Features } from "~/components/features";
import { Hero } from "~/components/hero";
import { FlashIcon } from "~/components/icons/flash";
import { Link } from "~/components/link";
import { Section } from "~/components/section";
import { SEO } from "~/components/seo";

const HomePage: NextPage = () => (
  <>
    <SEO title="A Python library for GraphQL" />

    <Hero />

    <Section sx={{ flex: 1 }}>
      <Heading sx={{ mb: 3 }}>
        Learn how to create GraphQL API using Strawberry
      </Heading>

      <Link href="/docs/">View documentation</Link>
      <Features />

      <Grid
        columns={2}
        sx={{
          px: 4,
          my: 6,
          textAlign: "left",
          gridTemplateColumns: [null, "2fr 6fr 105px"],
        }}
      >
        <Box sx={{ p: 3 }}>
          <Heading as="h2">Create GraphQL APIs in no time</Heading>
        </Box>
        <Box
          sx={{
            py: 3,
            textAlign: "right",
            gridColumnStart: [null, 3],
            gridColumnEnd: [null, 3],
          }}
        >
          <FlashIcon sx={{ width: [50, 100], height: [80, 160] }} />
        </Box>
        <Flex
          sx={{
            p: 3,
            gridRowStart: [null, 1],
            gridColumnStart: [1, 2],
            gridColumnEnd: [3, 2],
          }}
        >
          <Box>
            <Text sx={{ mb: 2 }}>
              Strawberry&apos;s friendly API allows to create GraphQL API rather
              quickly, the debug server makes it easy to quickly test and debug.
            </Text>
            <Text>
              <strong>Django</strong> and <strong>ASGI</strong> support allow to
              have your API deployed in production in matter of minutes
            </Text>
          </Box>
        </Flex>
      </Grid>
    </Section>
  </>
);

export default HomePage;

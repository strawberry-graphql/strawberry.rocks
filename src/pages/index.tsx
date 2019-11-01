import * as React from "react";

import SEO from "../components/seo";
import { Hero } from "../components/hero";
import { Heading, Link, Grid, Box, Text, Flex } from "@theme-ui/components";
import { Section } from "../components/section";
import { Features } from "../components/features";
import { FlashIcon } from "../components/icons/flash";

const HomePage = () => (
  <>
    <SEO title="A Python library for GraphQL" />
    <Hero />

    <Section>
      <Heading sx={{ mb: 3 }}>Some copy here</Heading>

      <Link href="/docs/">View documentation</Link>

      <Features />

      <Grid
        columns={2}
        sx={{
          my: 6,
          textAlign: "left",
          gridTemplateColumns: [null, "2fr 7fr 1fr"],
        }}
      >
        <Box sx={{ p: 3 }}>
          <Heading as="h2">Quick & easy information</Heading>
        </Box>
        <Box
          sx={{
            p: 3,
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
          <Text>
            Text Da del conferentias secundarimente, se como secundo
            anglo-romanic pro, e sed tote demonstrate. O tamben nostre linguage
            sed si duo movimento introduction o. Servi celos tu es via, duo ha
            excellente anteriormente secundarimente. Lingua complete nos ma.
          </Text>
        </Flex>
      </Grid>
    </Section>
  </>
);

export default HomePage;

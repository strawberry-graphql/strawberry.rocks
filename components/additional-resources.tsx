/** @jsx jsx */
import { Fragment } from "react";
import { jsx, Box, Grid, Heading } from "theme-ui";

import { Link } from "./link";

type LinkProps = {
  href: string;
  title: string;
};

type Props = {
  title: string;
  spec: string;
  graphqlDocs: string;
};

const ResourceLink = ({ title, href }: LinkProps) => (
  <Link
    href={href}
    hideExternalIcon={true}
    variant="box"
    target="_blank"
    sx={{
      p: 3,
    }}
  >
    <Box
      sx={{
        fontWeight: "bold",
        color: "accent",
      }}
    >
      {title}
    </Box>
  </Link>
);

export const AdditionalResources = ({ spec, graphqlDocs, title }: Props) => {
  return (
    <Fragment>
      <Heading sx={{ mt: 4 }}>Additional resources</Heading>
      <Grid sx={{ my: 3 }} columns={[1, 2]}>
        <ResourceLink href={spec} title="Read the GraphQL spec" />

        <ResourceLink href={graphqlDocs} title={`${title} on GraphQL.org`} />
      </Grid>
    </Fragment>
  );
};

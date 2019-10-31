/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Heading, Text, Input, Button, Flex } from "@theme-ui/components";
import { ArrowRightIcon } from "./icons/arrow-right";

export const NewsletterSection: React.SFC = () => (
  <Box
    sx={{
      p: 5,
      backgroundColor: "primary",
      color: "white",
      borderTopRightRadius: "50vh",
      borderBottomRightRadius: "50vh",
      position: "relative",
    }}
  >
    <Box
      sx={{
        background: "black",
        position: "absolute",
        top: "50%",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
      }}
    />
    <Box
      sx={{
        mx: "auto",
        maxWidth: 440,
        textAlign: "center",
      }}
    >
      <Heading sx={{ mb: 4 }}>Newsletter</Heading>
      <Text sx={{ mb: 4 }}>BlaBlaBlaBlaBla</Text>

      <Flex
        as="form"
        sx={{
          height: 58,
          color: "primary",
          borderRadius: 40,
          backgroundColor: "white",
        }}
      >
        <Input
          sx={{
            color: "primary",
            p: 3,
            border: "none",
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40,
          }}
          type="email"
          placeholder="my@email.com"
        />
        <Button
          type="submit"
          sx={{
            borderRadius: "100%",
            backgroundColor: "muted",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            width: 58,
            height: 58,
          }}
        >
          <ArrowRightIcon />
        </Button>
      </Flex>
    </Box>
  </Box>
);

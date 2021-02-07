/** @jsx jsx */
import { useState } from "react";
import { useMailchimp } from "react-use-mailchimp";
import { jsx, Box, Heading, Text, Input, Button, Flex } from "theme-ui";

import { ArrowRightIcon } from "./icons/arrow-right";

const url =
  "https://twitter.us4.list-manage.com/subscribe/post?u=4ad955ae4a0b2d7c67f48323e&amp;id=5e44c190e6";

const Loading = (): jsx.JSX.Element => (
  <Box
    sx={{
      fontSize: 3,
      animation: "spin 2s linear infinite",
    }}
  >
    🍓
  </Box>
);

const Form: React.FC = () => {
  const [email, setEmail] = useState("");
  const [mailchimp, subscribe] = useMailchimp({
    url,
  });
  const { loading, error, data } = mailchimp;

  const canSubmit = email.trim() !== "" && !loading;

  if (data && data.result === "success") {
    return <Text sx={{ fontSize: 3 }}>🎉 Thanks for subscribing! 🎉</Text>;
  }

  if (error) {
    return (
      <Text
        sx={{ fontSize: 3 }}
        dangerouslySetInnerHTML={{ __html: error }}
      ></Text>
    );
  }

  return (
    <Flex
      as="form"
      sx={{
        height: 58,
        color: "primary",
        borderRadius: 40,
        backgroundColor: "background",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) {
          subscribe({ EMAIL: email });
        }
      }}
    >
      <Input
        sx={{
          color: "primary",
          p: 3,
          border: "none",
          borderTopLeftRadius: 40,
          borderBottomLeftRadius: 40,
          "&::placeholder": {
            opacity: 1,
          },
        }}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="my@email.com"
      />
      <Button
        type="submit"
        disabled={!canSubmit}
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
        {loading ? <Loading /> : <ArrowRightIcon />}
      </Button>
    </Flex>
  );
};

export const NewsletterSection = (): jsx.JSX.Element => (
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
        backgroundColor: "backgroundDark",
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
      <Heading sx={{ mb: 4 }}>Newsletter 💌</Heading>
      <Text sx={{ mb: 4 }}>
        Do you want to receive the latest updates on Strawberry? Subscribe to
        our newsletter!
      </Text>

      <Form />
    </Box>
  </Box>
);

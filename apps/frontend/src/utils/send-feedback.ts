export const sendFeedback = async ({
  sentiment,
  feedback,
  url,
}: {
  sentiment: string;
  feedback: string;
  url: string;
}) => {
  const request = await fetch("https://api.strawberry.rocks/graphql", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query:
        "mutation ($input: SendFeedbackInput!) { sendFeedback(input: $input) }",
      variables: {
        input: { feedback, sentiment, url: `https://strawberry.rocs${url}` },
      },
    }),
  });

  const response = await request.json();

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }
};

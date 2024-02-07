import client from "@mailchimp/mailchimp_marketing";

client.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY,
  server: "us4",
});

export const subscribeToMailchimp = async (email: string) => {
  const response = await client.lists.addListMember("5e44c190e6", {
    email_address: email,
    status: "pending",
  });
  console.log(response);
};

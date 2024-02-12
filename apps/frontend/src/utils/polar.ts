export const subscribeToPolar = async (email: string) => {
  const payload = {
    tier_id: "83b65458-9842-491e-b737-e036deb64594",
    customer_email: email,
  };

  const response = await fetch(
    "https://api.polar.sh/api/v1/subscriptions/subscriptions/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.POLAR_SH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    console.log(response.status);

    const body = await response.text();

    throw new Error(body || "Failed to subscribe to Polar");
  }

  const content = await response.json();

  return content;
};

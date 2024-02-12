export const githubFetch = async (
  url: string,
  {
    method,
    body,
  }: {
    method: string;
    body?: string;
  }
) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    ...(body ? { body } : {}),
  });

  if (!response.ok) {
    console.error(response.body);

    throw new Error("Network response was not ok");
  }

  return response;
};

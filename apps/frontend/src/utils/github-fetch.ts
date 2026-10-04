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
    console.error("GitHub request failed", {
      url,
      status: response.status,
      statusText: response.statusText,
      rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
      rateLimitReset: response.headers.get("x-ratelimit-reset"),
      retryAfter: response.headers.get("retry-after"),
    });

    throw new Error(
      `GitHub request failed (${response.status} ${response.statusText})`
    );
  }

  return response;
};

export const fetchDownloads = async () => {
  if (process.env.LOCAL === "true") {
    return { lastMonth: 999_999, lastWeek: 250_000 };
  }

  const { data } = await fetch(
    "https://pypistats.org/api/packages/strawberry-graphql/recent"
  ).then((res) => res.json());

  return {
    lastMonth: data.last_month,
    lastWeek: data.last_week,
  };
};

export const fetchDownloads = async () => {
  const { data } = await fetch(
    "https://pypistats.org/api/packages/strawberry-graphql/recent",
  ).then((res) => res.json());

  return {
    lastMonth: data.last_month,
    lastWeek: data.last_week,
  };
};

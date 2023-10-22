export const fetchDownloads = async () => {
  if (process.env.LOCAL_REPO_PATH) {
    return { lastMonth: 639284, lastWeek: 144952 };
  }

  const { data } = await fetch(
    "https://pypistats.org/api/packages/strawberry-graphql/recent"
  ).then((res) => res.json());

  return {
    lastMonth: data.last_month,
    lastWeek: data.last_week,
  };
};
